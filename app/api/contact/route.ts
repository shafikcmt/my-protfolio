import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import ContactMessage from '@/models/ContactMessage'

export async function POST(request: NextRequest) {
  try {
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
    } = body

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

    // TODO: Send notification email to admin
    // await sendAdminNotification(contactMessage)

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
