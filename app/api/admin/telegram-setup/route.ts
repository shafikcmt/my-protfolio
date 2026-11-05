import { NextRequest, NextResponse } from 'next/server'
import { withAdminAuth } from '@/lib/crud'
import { SITE_URL } from '@/lib/constants'
import { telegramApi } from '@/lib/telegram'

export const dynamic = 'force-dynamic'

/**
 * One-time setup: tells Telegram to send bot updates (button taps, replies)
 * to this site. Needs TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID and TELEGRAM_WEBHOOK_SECRET.
 */
export async function POST(request: NextRequest) {
  if (!(await withAdminAuth(request))) {
    return NextResponse.json({ success: false, message: 'Unauthorized: Admin access required' }, { status: 401 })
  }

  const missing = ['TELEGRAM_BOT_TOKEN', 'TELEGRAM_CHAT_ID', 'TELEGRAM_WEBHOOK_SECRET'].filter((key) => !process.env[key])
  if (missing.length) {
    return NextResponse.json({ success: false, message: `Add these in Vercel first: ${missing.join(', ')}` }, { status: 400 })
  }

  const url = `${SITE_URL}/api/telegram/webhook`
  const result = await telegramApi('setWebhook', {
    url,
    secret_token: process.env.TELEGRAM_WEBHOOK_SECRET,
    allowed_updates: ['message', 'callback_query'],
    drop_pending_updates: true,
  })
  return result
    ? NextResponse.json({ success: true, message: `Telegram buttons connected to ${url}` })
    : NextResponse.json({ success: false, message: 'Telegram rejected the setup. Check the bot token.' }, { status: 502 })
}
