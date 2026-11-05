/**
 * Telegram bot helpers. Messages go to my own chat (TELEGRAM_CHAT_ID).
 * All helpers are no-ops (return null/false) when the bot is not configured.
 */

export type InlineButton = { text: string; callback_data: string } | { text: string; url: string }

/** Calls a Telegram Bot API method and returns its `result`, or null on any failure. */
export async function telegramApi(method: string, payload: Record<string, unknown>) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  if (!token) return null

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
    })
    const json = await res.json().catch(() => null)
    if (!res.ok || !json?.ok) {
      console.error(`Telegram ${method} failed:`, json?.description || res.status)
      return null
    }
    return json.result
  } catch (error) {
    console.error(`Telegram ${method} error:`, error)
    return null
  }
}

/** Sends an HTML message to my chat, optionally with inline buttons. Returns the sent message id. */
export async function sendTelegramMessage(html: string, buttons?: InlineButton[][]) {
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!chatId) return null
  const result = await telegramApi('sendMessage', {
    chat_id: chatId,
    text: html.slice(0, 4000),
    parse_mode: 'HTML',
    disable_web_page_preview: true,
    ...(buttons ? { reply_markup: { inline_keyboard: buttons } } : {}),
  })
  return result ? (result.message_id as number) : null
}

/** Sends a plain alert to my chat. */
export async function sendTelegram(html: string) {
  return (await sendTelegramMessage(html)) !== null
}

export function escapeHtml(value = '') {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
