import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import ConsultationBooking from '@/models/ConsultationBooking'
import User from '@/models/User'
import { verifyToken } from '@/lib/auth'

function getOptionalUser(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  if (!token) return null
  return verifyToken(token)
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const body = await request.json()
    const requiredFields = ['topic', 'scheduledAt', 'name', 'email', 'phone']

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, message: `${field} is required` },
          { status: 400 }
        )
      }
    }

    const loggedInUser = getOptionalUser(request)
    let clientId = loggedInUser?.role === 'client' ? loggedInUser.id : undefined

    if (!clientId) {
      const matchedClient = await User.findOne({ email: String(body.email).toLowerCase(), role: 'client' })
      clientId = matchedClient?._id
    }

    const booking = await ConsultationBooking.create({
      clientId,
      name: body.name,
      email: body.email,
      phone: body.phone,
      topic: body.topic,
      notes: body.notes || '',
      scheduledAt: new Date(body.scheduledAt),
      duration: Number(body.duration) || 60,
      meetingLink: '',
      status: 'pending',
      statusHistory: [
        {
          status: 'pending',
          note: 'Public consultation request submitted',
          changedBy: clientId,
          changedAt: new Date(),
        },
      ],
    })

    return NextResponse.json({ success: true, message: 'Booking request created', data: booking }, { status: 201 })
  } catch (error: any) {
    console.error('Booking request error:', error)
    return NextResponse.json({ success: false, message: error.message || 'Failed to create booking' }, { status: 500 })
  }
}
