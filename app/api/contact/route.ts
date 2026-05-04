import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import ContactMessage from '@/models/ContactMessage'

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const { name, email, subject, message } = await request.json()

    // Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      )
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email address' },
        { status: 400 }
      )
    }

    const contactMessage = new ContactMessage({
      name,
      email,
      subject,
      message,
      status: 'new',
      createdAt: new Date(),
    })

    await contactMessage.save()

    // TODO: Send notification email to admin
    // await sendAdminNotification(contactMessage)

    return NextResponse.json(
      {
        success: true,
        message: 'Your message has been sent successfully. I will get back to you soon!',
        data: contactMessage,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to send message' },
      { status: 500 }
    )
  }
}
