import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import ContactMessage from '@/models/ContactMessage'
import { escapeHtml, sendTelegram } from '@/lib/telegram'

// Best-effort per-IP throttle (per serverless instance): 5 submissions / 10 minutes.
const hits = new Map<string, number[]>()
function tooMany(ip: string) {
  const now = Date.now()
  const recent = (hits.get(ip) || []).filter((t) => now - t < 10 * 60 * 1000)
  recent.push(now)
  hits.set(ip, recent)
  return recent.length > 5
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown'
    if (tooMany(ip)) {
      return NextResponse.json({ success: false, message: 'Too many requests. Please try again later.' }, { status: 429 })
    }

    await connectDB()

    const body = await request.json()
    const {
      name,
      email,
      phone,
      inquiryType,
      serviceNeeded,
      budget,
      timeline,
      subject,
      message,
      preferredContact,
      website, // honeypot: real users never fill this
    } = body

    if (website) {
      return NextResponse.json({ success: true, message: 'Thank you! Your inquiry has been submitted.' }, { status: 201 })
    }

    if (!name?.trim()) {
      return NextResponse.json({ success: false, message: 'Full name is required' }, { status: 400 })
    }

    if (!email?.trim() && !phone?.trim()) {
      return NextResponse.json(
        { success: false, message: 'Please provide an email address or phone number' },
        { status: 400 }
      )
    }

    if (email?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json({ success: false, message: 'Invalid email address' }, { status: 400 })
    }

    if (!inquiryType) {
      return NextResponse.json(
        { success: false, message: 'Please select an inquiry type' },
        { status: 400 }
      )
    }

    if (!subject?.trim()) {
      return NextResponse.json({ success: false, message: 'Subject is required' }, { status: 400 })
    }

    if (!message?.trim()) {
      return NextResponse.json({ success: false, message: 'Message is required' }, { status: 400 })
    }

    const contactMessage = new ContactMessage({
      name: name.trim(),
      email: email?.trim() || undefined,
      phone: phone?.trim() || undefined,
      inquiryType,
      serviceNeeded: serviceNeeded || undefined,
      budget: budget || undefined,
      timeline: timeline || undefined,
      subject: subject.trim(),
      message: message.trim(),
      preferredContact: preferredContact || undefined,
      status: 'new',
    })

    await contactMessage.save()

    // Instant alert so inquiries are answered fast (no-op if Telegram isn't configured)
    await sendTelegram(
      [
        `${/hire|job|remote|full[- ]?time|contract/i.test(`${inquiryType} ${subject}`) ? '🔥 HIGH PRIORITY' : '📩'} <b>New inquiry</b> (${escapeHtml(inquiryType)})`,
        `<b>${escapeHtml(name.trim())}</b> — ${escapeHtml(email?.trim() || phone?.trim() || '')}`,
        budget ? `Budget: ${escapeHtml(String(budget))}` : '',
        `Subject: ${escapeHtml(subject.trim())}`,
        escapeHtml(message.trim().slice(0, 400)),
      ]
        .filter(Boolean)
        .join('\n')
    )

    return NextResponse.json(
      {
        success: true,
        message: "Thank you! Your inquiry has been submitted. I'll get back to you within 24 hours.",
        data: contactMessage,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to send message. Please try again.' },
      { status: 500 }
    )
  }
}
