import mongoose from 'mongoose'
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { runSalesAgent, type LeadDoc } from '@/lib/salesAgent'
import { escapeHtml, telegramApi, type InlineButton } from '@/lib/telegram'
import Lead from '@/models/Lead'
import Proposal from '@/models/Proposal'
import Prospect from '@/models/Prospect'
import { approveAndSend, sendDraftCard } from '@/lib/outreach'
import { reviseDraft } from '@/lib/outreachAgent'
import { createProposal, formatUsd } from '@/lib/proposals'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

// Telegram retries a webhook that is slow or fails; remember handled updates so nothing runs twice
const TelegramUpdate =
  mongoose.models.TelegramUpdate ||
  mongoose.model(
    'TelegramUpdate',
    new mongoose.Schema({ updateId: { type: Number, unique: true }, createdAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 7 } })
  )

const ok = () => NextResponse.json({ ok: true })

function formatTiers(lead: any) {
  return (lead.proposedTiers || [])
    .map((t: any) => `${t.name}: $${Number(t.priceUsd).toLocaleString('en-US')} (${t.timeline}) — ${(t.includes || []).join('; ')}`)
    .join('\n')
}

const DECISIONS: Record<string, { status: string; label: string; text: (lead: any, proposalUrl?: string) => string }> = {
  approve: {
    status: 'approved',
    label: '✅ Approved',
    text: (lead, proposalUrl) =>
      `Approved exactly as proposed. The proposal page is ready: ${proposalUrl}\nShare this link, briefly present the packages, recommend the one that fits their budget, and explain that they can accept it on that page and pay the advance to start:\n${formatTiers(lead)}`,
  },
  call: {
    status: 'call_requested',
    label: '📞 Call requested',
    text: () =>
      'Before confirming the final price, Shafiqul would like a short call to understand the project better. Invite the client to book a call or share their WhatsApp number. Do not state final prices yet.',
  },
  reject: {
    status: 'rejected',
    label: '❌ Not a fit',
    text: () =>
      "This project is not a good fit for Shafiqul right now. Politely thank the client, don't give prices, and wish them luck; they are welcome to get in touch again in future.",
  },
}

/** Runs the assistant with my decision, then reports back in Telegram with a WhatsApp shortcut. */
async function applyDecision(lead: any, decision: string, status: string, label: string) {
  lead.status = status
  lead.ownerNotes.push({ at: new Date(), text: decision.slice(0, 1000) })
  const reply = await runSalesAgent(lead as LeadDoc, { owner: decision })
  lead.transcript.push({ role: 'assistant', text: reply, at: new Date() })
  await lead.save()

  const buttons: InlineButton[][] = []
  const phone = String(lead.phone || '').replace(/\D/g, '')
  if (phone.length >= 8) {
    buttons.push([{ text: '📲 Send on WhatsApp too', url: `https://wa.me/${phone}?text=${encodeURIComponent(reply.slice(0, 1500))}` }])
  }
  await telegramApi('sendMessage', {
    chat_id: process.env.TELEGRAM_CHAT_ID,
    text:
      `${label} — message sent to ${escapeHtml(lead.name || 'the client')} in the website chat:\n\n<i>${escapeHtml(reply.slice(0, 3000))}</i>` +
      (lead.email ? `\n\n✉️ ${escapeHtml(lead.email)}` : '') +
      '\n\n<i>They see it next time they open the chat — use WhatsApp/email if they have left.</i>',
    parse_mode: 'HTML',
    disable_web_page_preview: true,
    ...(buttons.length ? { reply_markup: { inline_keyboard: buttons } } : {}),
  })
}

/** Buttons on outreach messages: send / skip a draft, mark replied, stop follow-ups. */
async function handleProspectAction(callback: any, ownerChat: string) {
  const [, action, id] = String(callback.data).split(':')
  const prospect = mongoose.Types.ObjectId.isValid(id) ? await Prospect.findById(id) : null
  if (!prospect) {
    await telegramApi('answerCallbackQuery', { callback_query_id: callback.id, text: 'Prospect not found' })
    return
  }

  let label = ''
  if (action === 'send') {
    if (!['draft', 'approved'].includes(prospect.status)) {
      label = `Already ${prospect.status}`
    } else {
      const result: any = await approveAndSend(prospect)
      label = result.ok ? '✅ Sent' : result.limited ? '⏳ Queued — daily limit reached' : `⚠️ ${String(result.error).slice(0, 60)}`
    }
  } else if (action === 'skip' || action === 'replied' || action === 'stop') {
    prospect.status = action === 'skip' ? 'skipped' : action === 'replied' ? 'replied' : 'stopped'
    prospect.nextSendAt = undefined
    await prospect.save()
    label = action === 'skip' ? '❌ Skipped' : action === 'replied' ? '💬 Replied — follow-ups stopped' : '🛑 Follow-ups stopped'
  } else {
    await telegramApi('answerCallbackQuery', { callback_query_id: callback.id })
    return
  }

  await telegramApi('answerCallbackQuery', { callback_query_id: callback.id, text: label })
  await telegramApi('editMessageReplyMarkup', {
    chat_id: ownerChat,
    message_id: callback.message.message_id,
    reply_markup: { inline_keyboard: [[{ text: label, callback_data: 'noop' }]] },
  })
}

/** Buttons on proposal messages: withdraw, and confirming a reported payment. */
async function handleProposalAction(callback: any, ownerChat: string) {
  const [, action, id] = String(callback.data).split(':')
  const proposal = mongoose.Types.ObjectId.isValid(id) ? await Proposal.findById(id) : null
  if (!proposal) {
    await telegramApi('answerCallbackQuery', { callback_query_id: callback.id, text: 'Proposal not found' })
    return
  }
  const lead = proposal.leadId ? await Lead.findById(proposal.leadId) : null
  const tellClient = (text: string) => lead?.transcript.push({ role: 'assistant', text, at: new Date() })

  let label = ''
  if (action === 'withdraw') {
    proposal.status = 'withdrawn'
    label = '↩️ Withdrawn'
  } else if (action === 'paid') {
    proposal.status = 'paid'
    proposal.set('payment.confirmedAt', new Date())
    if (lead) lead.status = 'won'
    tellClient(`✅ Payment received — thank you! Shafiqul will contact you shortly to kick off "${proposal.title}".`)
    label = `💰 Paid · ${formatUsd(proposal.accepted?.priceUsd || 0)} project won 🎉`
  } else if (action === 'unpaid') {
    proposal.status = 'accepted'
    tellClient("We couldn't find your payment yet. Please check the transaction ID on the proposal page and submit it again, or message Shafiqul on WhatsApp.")
    label = '❌ Payment not found — client asked to re-check'
  } else {
    await telegramApi('answerCallbackQuery', { callback_query_id: callback.id })
    return
  }

  await proposal.save()
  if (lead) await lead.save()
  await telegramApi('answerCallbackQuery', { callback_query_id: callback.id, text: label })
  await telegramApi('editMessageReplyMarkup', {
    chat_id: ownerChat,
    message_id: callback.message.message_id,
    reply_markup: { inline_keyboard: [[{ text: label, callback_data: 'noop' }]] },
  })
}

export async function POST(request: NextRequest) {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET
  if (!secret || request.headers.get('x-telegram-bot-api-secret-token') !== secret) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }

  const update = await request.json().catch(() => null)
  if (!update || typeof update.update_id !== 'number') return ok()

  const ownerChat = String(process.env.TELEGRAM_CHAT_ID || '')
  const fromChat = String(update.callback_query?.message?.chat?.id ?? update.message?.chat?.id ?? '')
  if (!ownerChat || fromChat !== ownerChat) return ok() // ignore anyone else who finds the bot

  try {
    await connectDB()
    try {
      await TelegramUpdate.create({ updateId: update.update_id })
    } catch {
      return ok() // already handled (Telegram retry)
    }

    // Button tap on a lead card
    const callback = update.callback_query
    if (callback && String(callback.data || '').startsWith('proposal:')) {
      await handleProposalAction(callback, ownerChat)
      return ok()
    }
    if (callback && String(callback.data || '').startsWith('prospect:')) {
      await handleProspectAction(callback, ownerChat)
      return ok()
    }
    if (callback && !String(callback.data || '').startsWith('lead:')) {
      await telegramApi('answerCallbackQuery', { callback_query_id: callback.id })
      return ok()
    }
    if (callback) {
      const [, action, leadId] = String(callback.data).split(':')
      const rule = DECISIONS[action]
      const lead = rule && mongoose.Types.ObjectId.isValid(leadId) ? await Lead.findById(leadId) : null

      await telegramApi('answerCallbackQuery', { callback_query_id: callback.id, text: lead ? `${rule.label} — writing to the client…` : 'Lead not found' })
      if (!lead) return ok()

      // Remove the buttons so the same card can't be actioned twice
      await telegramApi('editMessageReplyMarkup', {
        chat_id: ownerChat,
        message_id: callback.message.message_id,
        reply_markup: { inline_keyboard: [[{ text: rule.label, callback_data: 'noop' }]] },
      })
      let proposalLink: string | undefined
      if (action === 'approve') {
        // The proposal page uses exactly the packages I approved, not a rewrite by the assistant
        const { url } = await createProposal(lead, {
          title: lead.projectType ? `${lead.projectType}${lead.company ? ` for ${lead.company}` : ''}` : 'Project proposal',
          summary: lead.summary,
          packages: (lead.proposedTiers || []).map((t: any) => ({ name: t.name, priceUsd: t.priceUsd, timeline: t.timeline, includes: t.includes })),
        })
        proposalLink = url
      }
      await applyDecision(lead, rule.text(lead, proposalLink), rule.status, rule.label)
      return ok()
    }

    // Text reply to a lead card = my custom instructions (new prices, extra scope, a note)
    const message = update.message
    const repliedTo = message?.reply_to_message?.message_id
    if (message?.text && repliedTo) {
      // Reply to an outreach draft card = rewrite the email with my instructions
      const prospect = await Prospect.findOne({ telegramMessageId: repliedTo })
      if (prospect) {
        const revised = prospect.draft?.body ? await reviseDraft(prospect.draft, String(message.text).slice(0, 1000)) : null
        if (!revised) {
          await telegramApi('sendMessage', { chat_id: ownerChat, text: 'Could not revise that draft — edit it in Admin → Outreach.' })
          return ok()
        }
        prospect.draft = { subject: revised.subject.slice(0, 150), body: revised.body.slice(0, 3000) }
        await prospect.save()
        await sendDraftCard(prospect) // new card with Send / Skip for the revised email
        return ok()
      }

      const lead = await Lead.findOne({ telegramMessageId: repliedTo })
      if (!lead) {
        await telegramApi('sendMessage', { chat_id: ownerChat, text: 'Reply to an AI lead card or outreach draft to change it.' })
        return ok()
      }
      const instructions = String(message.text).slice(0, 1500)
      await applyDecision(
        lead,
        `Shafiqul's instructions (they override the earlier draft): ${instructions}\nIf they include prices or packages, present them to the client as the confirmed proposal and explain how to start.`,
        'approved',
        '✏️ Updated'
      )
    }
  } catch (error) {
    console.error('Telegram webhook error:', error)
    await telegramApi('sendMessage', { chat_id: ownerChat, text: '⚠️ Could not process that action. Please try again.' })
  }
  return ok()
}
