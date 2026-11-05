import mongoose from 'mongoose'
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { ownerDecisionMessages, runSalesAgent, type LeadDoc } from '@/lib/salesAgent'
import { escapeHtml, telegramApi, type InlineButton } from '@/lib/telegram'
import Lead from '@/models/Lead'

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

const DECISIONS: Record<string, { status: string; label: string; text: (lead: any) => string }> = {
  approve: {
    status: 'approved',
    label: '✅ Approved',
    text: (lead) =>
      `Approved exactly as proposed. Present these packages to the client as the confirmed proposal, recommend the one that fits their budget, and explain how to start (advance payment, then milestones):\n${formatTiers(lead)}`,
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
  const reply = await runSalesAgent(lead as LeadDoc, ownerDecisionMessages(decision))
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
      await applyDecision(lead, rule.text(lead), rule.status, rule.label)
      return ok()
    }

    // Text reply to a lead card = my custom instructions (new prices, extra scope, a note)
    const message = update.message
    const repliedTo = message?.reply_to_message?.message_id
    if (message?.text && repliedTo) {
      const lead = await Lead.findOne({ telegramMessageId: repliedTo })
      if (!lead) {
        await telegramApi('sendMessage', { chat_id: ownerChat, text: 'Reply to an AI lead card to change its proposal.' })
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
