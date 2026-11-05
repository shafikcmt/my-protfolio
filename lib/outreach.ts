import crypto from 'crypto'
import { sendEmail } from '@/lib/email'
import { OUTREACH_CONFIG, outreachSendingConfigured } from '@/lib/outreachConfig'
import { LINK_PLACEHOLDER, draftFollowUp, researchAndDraft } from '@/lib/outreachAgent'
import { SITE_URL } from '@/lib/constants'
import { escapeHtml, sendTelegram, sendTelegramMessage } from '@/lib/telegram'
import Prospect from '@/models/Prospect'

/**
 * Client prospecting workflow: research → draft → my approval → send →
 * follow-ups, with a daily sending limit and unsubscribe handling.
 */

const DAY = 86_400_000
const ACTIVE_SEQUENCE = ['sent', 'followup_1']

export function domainOf(url?: string | null) {
  if (!url) return ''
  try {
    return new URL(/^https?:\/\//.test(url) ? url : `https://${url}`).hostname.replace(/^www\./, '').toLowerCase()
  } catch {
    return ''
  }
}

export function isValidEmail(email?: string | null) {
  return Boolean(email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
}

function ensureCodes(prospect: any) {
  if (!prospect.refCode) {
    const base = (prospect.domain || prospect.company || 'co').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 18) || 'co'
    prospect.refCode = `${base}-${crypto.randomBytes(2).toString('hex')}`
  }
  if (!prospect.unsubscribeToken) prospect.unsubscribeToken = crypto.randomBytes(16).toString('base64url')
}

export function unsubscribeUrl(token: string) {
  return `${SITE_URL}/api/outreach/unsubscribe?t=${token}`
}

/** Emails sent today (UTC), first emails and follow-ups together. */
export async function sentTodayCount() {
  const start = new Date(new Date().toISOString().slice(0, 10) + 'T00:00:00.000Z')
  const [row] = await Prospect.aggregate([
    { $unwind: '$emails' },
    { $match: { 'emails.sentAt': { $gte: start } } },
    { $count: 'n' },
  ])
  return row?.n || 0
}

function buildEmail(prospect: any, body: string) {
  const link = `${SITE_URL}/?ref=${prospect.refCode}`
  const withLink = body.includes(LINK_PLACEHOLDER) ? body.split(LINK_PLACEHOLDER).join(link) : `${body.trim()}\n\nPortfolio: ${link}`
  const s = OUTREACH_CONFIG.sender
  const footer = `--\n${s.name}\n${s.title} · ${s.website.replace(/^https?:\/\//, '')} · WhatsApp ${s.whatsapp}\n${s.location}\n\nNot relevant? Reply "no" or unsubscribe: ${unsubscribeUrl(prospect.unsubscribeToken)}`
  const text = `${withLink.trim()}\n\n${footer}`
  const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:#1f2937">${escapeHtml(text)
    .replace(/(https?:\/\/[^\s<]*[^\s<.,!?)])/g, '<a href="$1">$1</a>')
    .replace(/\n/g, '<br>')}</div>`
  return { text, html }
}

/** Sends one email of the sequence. Respects unsubscribes, replies and the daily limit. */
export async function sendProspectEmail(prospect: any, kind: 'initial' | 'followup_1' | 'followup_2', email: { subject: string; body: string }) {
  if (['unsubscribed', 'replied', 'stopped', 'skipped'].includes(prospect.status)) return { ok: false, error: `Prospect is ${prospect.status}` }
  if (!isValidEmail(prospect.email)) return { ok: false, error: 'No valid email address' }
  if (!outreachSendingConfigured()) return { ok: false, error: 'Email sending is not set up (RESEND_API_KEY / OUTREACH_FROM_EMAIL)' }
  if ((await sentTodayCount()) >= OUTREACH_CONFIG.dailySendLimit) return { ok: false, error: 'Daily sending limit reached — it will go out tomorrow', limited: true }

  // Never email an address that unsubscribed under another prospect record
  const optedOut = await Prospect.exists({ email: prospect.email, status: 'unsubscribed' })
  if (optedOut) {
    prospect.status = 'unsubscribed'
    await prospect.save()
    return { ok: false, error: 'This address unsubscribed earlier' }
  }

  ensureCodes(prospect)
  const { text, html } = buildEmail(prospect, email.body)
  const result = await sendEmail({
    from: `${OUTREACH_CONFIG.sender.name} <${OUTREACH_CONFIG.fromEmail}>`,
    to: prospect.email,
    subject: email.subject,
    text,
    html,
    replyTo: OUTREACH_CONFIG.replyTo,
    headers: {
      'List-Unsubscribe': `<${unsubscribeUrl(prospect.unsubscribeToken)}>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    },
  })
  if (!result.ok) {
    prospect.lastError = result.error
    await prospect.save()
    return result
  }

  prospect.emails.push({ kind, subject: email.subject, body: text, sentAt: new Date(), providerId: result.id })
  prospect.status = kind === 'initial' ? 'sent' : kind
  const nextIndex = kind === 'initial' ? 0 : kind === 'followup_1' ? 1 : -1
  prospect.nextSendAt = nextIndex >= 0 ? new Date(Date.now() + OUTREACH_CONFIG.followUpDays[nextIndex] * DAY) : undefined
  prospect.lastError = undefined
  await prospect.save()
  return { ok: true as const }
}

/** Approve the draft and send it now (or queue it when today's limit is reached). */
export async function approveAndSend(prospect: any) {
  if (!prospect.draft?.subject || !prospect.draft?.body) return { ok: false, error: 'No draft to send' }
  prospect.status = 'approved'
  await prospect.save()
  const result = await sendProspectEmail(prospect, 'initial', prospect.draft)
  if (result.ok) {
    await sendTelegramMessage(`📤 Sent to <b>${escapeHtml(prospect.company)}</b> (${escapeHtml(prospect.email)})\n“${escapeHtml(prospect.draft.subject)}”`, [
      [
        { text: '💬 They replied', callback_data: `prospect:replied:${prospect._id}` },
        { text: '🛑 Stop follow-ups', callback_data: `prospect:stop:${prospect._id}` },
      ],
    ])
  }
  return result
}

/** Researches the company and drafts the first email; sends me a Telegram card to approve. */
export async function researchProspect(prospect: any) {
  const draft = await researchAndDraft(prospect)
  if (!draft) {
    prospect.lastError = 'Could not research this company'
    prospect.status = 'failed'
    await prospect.save()
    return null
  }
  prospect.summary = draft.summary
  prospect.likelyNeeds = draft.likely_needs.slice(0, 8)
  prospect.fit = draft.fit
  if (draft.contact_name && !prospect.contactName) prospect.contactName = draft.contact_name
  if (!isValidEmail(prospect.email) && isValidEmail(draft.better_email)) prospect.email = String(draft.better_email).toLowerCase()
  prospect.draft = { subject: draft.subject.slice(0, 150), body: draft.body.slice(0, 3000) }
  prospect.status = isValidEmail(prospect.email) ? 'draft' : 'needs_email'
  ensureCodes(prospect)
  await prospect.save()
  await sendDraftCard(prospect)
  return prospect
}

export async function sendDraftCard(prospect: any) {
  const fitIcon = prospect.fit === 'good' ? '🟢' : prospect.fit === 'poor' ? '🔴' : '🟡'
  const text =
    `✉️ <b>Outreach draft</b> ${fitIcon} — <b>${escapeHtml(prospect.company)}</b>\n` +
    `${escapeHtml(prospect.website || '')}\nTo: ${escapeHtml(prospect.email || '⚠️ no email found — add one in Admin → Outreach')}\n\n` +
    `<i>${escapeHtml(prospect.summary || '')}</i>\n\n<b>Subject:</b> ${escapeHtml(prospect.draft?.subject || '')}\n\n${escapeHtml(prospect.draft?.body || '')}` +
    `\n\n<i>Reply to this message to change the email.</i>`
  const buttons =
    prospect.status === 'draft'
      ? [[{ text: '✅ Send', callback_data: `prospect:send:${prospect._id}` }, { text: '❌ Skip', callback_data: `prospect:skip:${prospect._id}` }]]
      : [[{ text: '❌ Skip', callback_data: `prospect:skip:${prospect._id}` }]]
  const messageId = await sendTelegramMessage(text, buttons)
  if (messageId) {
    prospect.telegramMessageId = messageId
    await prospect.save()
  }
}

/**
 * Daily run (Vercel Cron): due follow-ups, queued approved emails, then
 * research a few new prospects. Stops drafting when time runs short.
 */
export async function runDailyOutreach(timeBudgetMs = 45_000) {
  const started = Date.now()
  const summary = { followUps: 0, queuedSent: 0, drafted: 0, errors: [] as string[] }

  // 1. Follow-ups that are due (the sequence was approved with the first email)
  const due = await Prospect.find({ status: { $in: ACTIVE_SEQUENCE }, nextSendAt: { $lte: new Date() } }).limit(OUTREACH_CONFIG.dailySendLimit)
  for (const p of due) {
    if (Date.now() - started > timeBudgetMs) break
    const number = p.status === 'sent' ? 1 : 2
    const email = await draftFollowUp(p, p.emails.map((e: any) => ({ subject: e.subject, body: e.body })), number)
    if (!email) continue
    const result = await sendProspectEmail(p, number === 1 ? 'followup_1' : 'followup_2', email)
    if (result.ok) summary.followUps++
    else if ((result as any).limited) break
    else summary.errors.push(`${p.company}: ${(result as any).error}`)
  }

  // 2. Approved emails waiting because of an earlier daily limit
  const queued = await Prospect.find({ status: 'approved' }).sort({ updatedAt: 1 }).limit(OUTREACH_CONFIG.dailySendLimit)
  for (const p of queued) {
    const result = await sendProspectEmail(p, 'initial', p.draft)
    if (result.ok) summary.queuedSent++
    else if ((result as any).limited) break
  }

  // 3. Research and draft a few new prospects (good fits first: those with an email)
  const fresh = await Prospect.find({ status: 'new' }).sort({ email: -1, createdAt: 1 }).limit(OUTREACH_CONFIG.dailyAutoDrafts)
  for (const p of fresh) {
    if (Date.now() - started > timeBudgetMs) break
    try {
      if (await researchProspect(p)) summary.drafted++
    } catch (error: any) {
      summary.errors.push(`${p.company}: ${error?.message || error}`)
    }
  }

  if (summary.followUps || summary.queuedSent || summary.drafted || summary.errors.length) {
    await sendTelegram(
      `📬 <b>Outreach today</b>\nFollow-ups sent: ${summary.followUps} · Queued emails sent: ${summary.queuedSent} · New drafts: ${summary.drafted}` +
        (summary.errors.length ? `\n⚠️ ${escapeHtml(summary.errors.slice(0, 5).join('\n'))}` : '')
    )
  }
  return summary
}
