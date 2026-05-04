import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import ProjectOrder from '@/models/ProjectOrder'
import User from '@/models/User'
import { withClientAuth } from '@/lib/clientAuth'

type ClientOrderStatus = 'pending' | 'discussing' | 'accepted' | 'in_progress' | 'testing' | 'delivered' | 'completed' | 'cancelled'

const allowedClientUpdateStatuses = ['cancelled']

function orderQueryForClient(client: { id: string; email: string }) {
  return {
    $or: [{ clientId: client.id }, { clientEmail: client.email?.toLowerCase() }],
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
      const order = await ProjectOrder.findOne({ _id: id, ...orderQueryForClient(client) })
      if (!order) {
        return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 })
      }
      return NextResponse.json({ success: true, data: order })
    }

    const orders = await ProjectOrder.find(orderQueryForClient(client)).sort({ createdAt: -1 })
    return NextResponse.json({ success: true, data: orders })
  } catch (error: any) {
    console.error('Client order fetch error:', error)
    return NextResponse.json({ success: false, message: error.message || 'Failed to fetch orders' }, { status: 500 })
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

    const projectType = body.projectType || body.serviceTitle || body.title
    if (!projectType || !body.description) {
      return NextResponse.json({ success: false, message: 'Project type and description are required' }, { status: 400 })
    }

    const order = await ProjectOrder.create({
      clientId: client.id,
      clientName: body.clientName || user?.name || 'Client',
      clientEmail: body.clientEmail || user?.email || client.email,
      clientPhone: body.clientPhone || body.phone || '',
      companyName: body.companyName || '',
      projectType,
      serviceTitle: body.serviceTitle || projectType,
      title: body.title || projectType,
      budgetRange: body.budgetRange || (body.budget ? `$${body.budget}` : ''),
      budget: Number(body.budget) || undefined,
      deadline: body.deadline || body.timeline || '',
      timeline: body.timeline || body.deadline || '',
      preferredTechnology: body.preferredTechnology || '',
      description: body.description,
      referenceLinks: Array.isArray(body.referenceLinks)
        ? body.referenceLinks
        : String(body.referenceLinks || '')
            .split(',')
            .map((link) => link.trim())
            .filter(Boolean),
      attachmentUrl: body.attachmentUrl || '',
      meetingPreference: body.meetingPreference || '',
      status: 'pending' as ClientOrderStatus,
      progress: 0,
      statusHistory: [
        {
          status: 'pending',
          note: 'Project order submitted by client',
          changedBy: client.id,
          changedAt: new Date(),
        },
      ],
    })

    return NextResponse.json({ success: true, message: 'Order created successfully', data: order }, { status: 201 })
  } catch (error: any) {
    console.error('Client order creation error:', error)
    return NextResponse.json({ success: false, message: error.message || 'Failed to create order' }, { status: 500 })
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
    const { id, status, clientNote } = body

    if (!id) {
      return NextResponse.json({ success: false, message: 'Order ID is required' }, { status: 400 })
    }

    const order = await ProjectOrder.findOne({ _id: id, ...orderQueryForClient(client) })
    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 })
    }

    if (status && !allowedClientUpdateStatuses.includes(status)) {
      return NextResponse.json({ success: false, message: 'Client can only cancel an order. Admin manages other statuses.' }, { status: 403 })
    }

    if (status === 'cancelled' && !['completed', 'delivered'].includes(order.status)) {
      order.status = 'cancelled'
      order.progress = 0
      order.statusHistory.push({
        status: 'cancelled',
        note: clientNote || 'Order cancelled by client',
        changedBy: client.id,
        changedAt: new Date(),
      })
    }

    if (clientNote !== undefined) {
      order.clientNote = clientNote
    }

    await order.save()
    return NextResponse.json({ success: true, message: 'Order updated successfully', data: order })
  } catch (error: any) {
    console.error('Client order update error:', error)
    return NextResponse.json({ success: false, message: error.message || 'Failed to update order' }, { status: 500 })
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
      return NextResponse.json({ success: false, message: 'Order ID is required' }, { status: 400 })
    }

    const order = await ProjectOrder.findOne({ _id: id, ...orderQueryForClient(client) })
    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 })
    }

    if (!['pending', 'discussing', 'cancelled'].includes(order.status)) {
      return NextResponse.json({ success: false, message: 'Only pending, discussing or cancelled orders can be removed.' }, { status: 400 })
    }

    await ProjectOrder.findByIdAndDelete(id)
    return NextResponse.json({ success: true, message: 'Order deleted successfully' })
  } catch (error: any) {
    console.error('Client order deletion error:', error)
    return NextResponse.json({ success: false, message: error.message || 'Failed to delete order' }, { status: 500 })
  }
}
