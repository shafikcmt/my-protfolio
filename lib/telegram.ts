/**
 * Sends a Telegram message to my own chat. No-op (returns false) when
 * TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID are not configured.
 */
export async function sendTelegram(html: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) return false

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: html, parse_mode: 'HTML', disable_web_page_preview: true }),
      signal: AbortSignal.timeout(8000),
    })
    return res.ok
  } catch (error) {
    console.error('Telegram send error:', error)
    return false
  }
}

export function escapeHtml(value = '') {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
