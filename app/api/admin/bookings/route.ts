import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { withAdminAuth } from '@/lib/crud'
import ConsultationBooking from '@/models/ConsultationBooking'

const validStatuses = ['pending', 'requested', 'approved', 'confirmed', 'rejected', 'completed', 'cancelled']

export async function GET(request: NextRequest) {
  try {
    const admin = await withAdminAuth(request)
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized: Admin access required' }, { status: 401 })
    }

    await connectDB()
    const url = new URL(request.url)
    const id = url.searchParams.get('id')
    const status = url.searchParams.get('status')

    if (id) {
      const booking = await ConsultationBooking.findById(id).populate('clientId', 'name email role')
      if (!booking) {
        return NextResponse.json({ success: false, message: 'Booking not found' }, { status: 404 })
      }
      return NextResponse.json({ success: true, data: booking })
    }

    const query = status && validStatuses.includes(status) ? { status } : {}
    const bookings = await ConsultationBooking.find(query).populate('clientId', 'name email role').sort({ scheduledAt: 1 })
    return NextResponse.json({ success: true, data: bookings })
  } catch (error: any) {
    console.error('Admin booking fetch error:', error)
    return NextResponse.json({ success: false, message: error.message || 'Failed to fetch bookings' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await withAdminAuth(request)
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized: Admin access required' }, { status: 401 })
    }

    await connectDB()
    const body = await request.json()
    if (!body.topic || !body.scheduledAt) {
      return NextResponse.json({ success: false, message: 'Topic and scheduled date are required' }, { status: 400 })
    }

    const status = validStatuses.includes(body.status) ? body.status : 'pending'
    const booking = await ConsultationBooking.create({
      ...body,
      scheduledAt: new Date(body.scheduledAt),
      status,
      statusHistory: [
        {
          status,
          note: body.adminNote || 'Booking created by admin',
          changedBy: admin.id,
          changedAt: new Date(),
        },
      ],
    })

    return NextResponse.json({ success: true, message: 'Booking created successfully', data: booking }, { status: 201 })
  } catch (error: any) {
    console.error('Admin booking creation error:', error)
    return NextResponse.json({ success: false, message: error.message || 'Failed to create booking' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const admin = await withAdminAuth(request)
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized: Admin access required' }, { status: 401 })
    }

    await connectDB()
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID is required for update' }, { status: 400 })
    }

    const booking = await ConsultationBooking.findById(id)
    if (!booking) {
      return NextResponse.json({ success: false, message: 'Booking not found' }, { status: 404 })
    }

    const oldStatus = booking.status
    const updatableFields = ['name', 'email', 'phone', 'topic', 'notes', 'duration', 'meetingLink', 'adminNote']
    updatableFields.forEach((field) => {
      if (body[field] !== undefined) {
        booking[field] = body[field]
      }
    })

    if (body.scheduledAt !== undefined) {
      booking.scheduledAt = new Date(body.scheduledAt)
    }

    if (body.status !== undefined) {
      if (!validStatuses.includes(body.status)) {
        return NextResponse.json({ success: false, message: 'Invalid booking status' }, { status: 400 })
      }
      booking.status = body.status
    }

    if (oldStatus !== booking.status) {
      booking.statusHistory.push({
        status: booking.status,
        note: body.statusNote || body.adminNote || `Status changed from ${oldStatus} to ${booking.status}`,
        changedBy: admin.id,
        changedAt: new Date(),
      })
    }

    await booking.save()
    const populated = await ConsultationBooking.findById(booking._id).populate('clientId', 'name email role')
    return NextResponse.json({ success: true, message: 'Booking updated successfully', data: populated })
  } catch (error: any) {
    console.error('Admin booking update error:', error)
    return NextResponse.json({ success: false, message: error.message || 'Failed to update booking' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const admin = await withAdminAuth(request)
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized: Admin access required' }, { status: 401 })
    }

    await connectDB()
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID is required for deletion' }, { status: 400 })
    }

    const item = await ConsultationBooking.findByIdAndDelete(id)
    if (!item) {
      return NextResponse.json({ success: false, message: 'Booking not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'Booking deleted successfully' })
  } catch (error: any) {
    console.error('Admin booking delete error:', error)
    return NextResponse.json({ success: false, message: error.message || 'Failed to delete booking' }, { status: 500 })
  }
}
