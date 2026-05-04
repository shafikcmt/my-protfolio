import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import ConsultationBooking from '@/models/ConsultationBooking'
import User from '@/models/User'
import { withClientAuth } from '@/lib/clientAuth'

function bookingQueryForClient(client: { id: string; email: string }) {
  return {
    $or: [{ clientId: client.id }, { email: client.email?.toLowerCase() }],
  }
}

export async function GET(request: NextRequest) {
  try {
    const client = withClientAuth(request)
    if (!client) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    const url = new URL(request.url)
    const id = url.searchParams.get('id')

    if (id) {
      const booking = await ConsultationBooking.findOne({ _id: id, ...bookingQueryForClient(client) })
      if (!booking) {
        return NextResponse.json({ success: false, message: 'Booking not found' }, { status: 404 })
      }
      return NextResponse.json({ success: true, data: booking })
    }

    const bookings = await ConsultationBooking.find(bookingQueryForClient(client)).sort({ scheduledAt: 1 })
    return NextResponse.json({ success: true, data: bookings })
  } catch (error: any) {
    console.error('Client booking fetch error:', error)
    return NextResponse.json({ success: false, message: error.message || 'Failed to fetch bookings' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = withClientAuth(request)
    if (!client) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    const body = await request.json()
    const user = await User.findById(client.id)

    if (!body.topic || !body.scheduledAt) {
      return NextResponse.json({ success: false, message: 'Topic and schedule date are required' }, { status: 400 })
    }

    const booking = await ConsultationBooking.create({
      clientId: client.id,
      name: body.name || user?.name || 'Client',
      email: body.email || user?.email || client.email,
      phone: body.phone || '',
      topic: body.topic,
      notes: body.notes || '',
      scheduledAt: new Date(body.scheduledAt),
      duration: Number(body.duration) || 60,
      status: 'pending',
      meetingLink: '',
      statusHistory: [
        {
          status: 'pending',
          note: 'Consultation requested by client',
          changedBy: client.id,
          changedAt: new Date(),
        },
      ],
    })

    return NextResponse.json({ success: true, message: 'Booking request submitted successfully', data: booking }, { status: 201 })
  } catch (error: any) {
    console.error('Client booking creation error:', error)
    return NextResponse.json({ success: false, message: error.message || 'Failed to create booking' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const client = withClientAuth(request)
    if (!client) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    const body = await request.json()
    const { id, status, notes } = body

    if (!id) {
      return NextResponse.json({ success: false, message: 'Booking ID is required' }, { status: 400 })
    }

    const booking = await ConsultationBooking.findOne({ _id: id, ...bookingQueryForClient(client) })
    if (!booking) {
      return NextResponse.json({ success: false, message: 'Booking not found' }, { status: 404 })
    }

    if (notes !== undefined) booking.notes = notes

    if (status === 'cancelled' && !['completed', 'cancelled'].includes(booking.status)) {
      booking.status = 'cancelled'
      booking.statusHistory.push({
        status: 'cancelled',
        note: 'Booking cancelled by client',
        changedBy: client.id,
        changedAt: new Date(),
      })
    } else if (status && status !== 'cancelled') {
      return NextResponse.json({ success: false, message: 'Client can only cancel a booking. Admin manages other statuses.' }, { status: 403 })
    }

    await booking.save()
    return NextResponse.json({ success: true, message: 'Booking updated successfully', data: booking })
  } catch (error: any) {
    console.error('Client booking update error:', error)
    return NextResponse.json({ success: false, message: error.message || 'Failed to update booking' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const client = withClientAuth(request)
    if (!client) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ success: false, message: 'Booking ID is required' }, { status: 400 })
    }

    const booking = await ConsultationBooking.findOne({ _id: id, ...bookingQueryForClient(client) })
    if (!booking) {
      return NextResponse.json({ success: false, message: 'Booking not found' }, { status: 404 })
    }

    if (!['pending', 'requested', 'cancelled'].includes(booking.status)) {
      return NextResponse.json({ success: false, message: 'Only pending or cancelled bookings can be removed.' }, { status: 400 })
    }

    await ConsultationBooking.findByIdAndDelete(id)
    return NextResponse.json({ success: true, message: 'Booking deleted successfully' })
  } catch (error: any) {
    console.error('Client booking deletion error:', error)
    return NextResponse.json({ success: false, message: error.message || 'Failed to delete booking' }, { status: 500 })
  }
}
