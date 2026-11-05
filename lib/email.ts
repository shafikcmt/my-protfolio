export async function sendEmailNotification(to: string, subject: string, body: string) {
  console.log('Email notification queued:', {
    to,
    subject,
    body,
    provider: process.env.EMAIL_PROVIDER || 'placeholder',
  })

  return {
    success: true,
    message: 'Email notification simulated in console. Replace with a real email provider implementation when ready.',
  }
}

/**
 * Sends a real email through Resend (https://resend.com). Needs RESEND_API_KEY
 * and a sender address on a domain verified in Resend.
 */
export async function sendEmail(input: {
  from: string
  to: string
  subject: string
  text: string
  html?: string
  replyTo?: string
  headers?: Record<string, string>
}): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return { ok: false, error: 'RESEND_API_KEY is not set' }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: input.from,
        to: [input.to],
        subject: input.subject,
        text: input.text,
        ...(input.html ? { html: input.html } : {}),
        ...(input.replyTo ? { reply_to: input.replyTo } : {}),
        ...(input.headers ? { headers: input.headers } : {}),
      }),
      signal: AbortSignal.timeout(15000),
    })
    const json = await res.json().catch(() => ({}))
    if (!res.ok) return { ok: false, error: json?.message || `Resend error ${res.status}` }
    return { ok: true, id: String(json.id || '') }
  } catch (error: any) {
    return { ok: false, error: error?.message || 'Email request failed' }
  }
}

export async function sendCourseNotification(email: string, courseTitle: string, type: 'enrollment' | 'completion') {
  const subject = type === 'completion' ? `Congratulations on completing ${courseTitle}` : `Enrollment confirmed: ${courseTitle}`
  const body = type === 'completion'
    ? `Great news! You have successfully completed ${courseTitle}. Your certificate is now available.`
    : `You are now enrolled in ${courseTitle}. Start learning at your convenience.`

  return sendEmailNotification(email, subject, body)
}
