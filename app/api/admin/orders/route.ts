import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { withAdminAuth } from '@/lib/crud'
import ProjectOrder from '@/models/ProjectOrder'

const validStatuses = ['pending', 'discussing', 'accepted', 'in_progress', 'testing', 'delivered', 'completed', 'cancelled']
const progressByStatus: Record<string, number> = {
  pending: 0,
  discussing: 15,
  accepted: 25,
  in_progress: 55,
  testing: 80,
  delivered: 95,
  completed: 100,
  cancelled: 0,
}

function clampProgress(value: any) {
  const numeric = Number(value)
  if (Number.isNaN(numeric)) return undefined
  return Math.max(0, Math.min(100, numeric))
}

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
      const order = await ProjectOrder.findById(id).populate('clientId', 'name email role')
      if (!order) {
        return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 })
      }
      return NextResponse.json({ success: true, data: order })
    }

    const query = status && validStatuses.includes(status) ? { status } : {}
    const orders = await ProjectOrder.find(query).populate('clientId', 'name email role').sort({ createdAt: -1 })
    return NextResponse.json({ success: true, data: orders })
  } catch (error: any) {
    console.error('Admin order fetch error:', error)
    return NextResponse.json({ success: false, message: error.message || 'Failed to fetch orders' }, { status: 500 })
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
    const projectType = body.projectType || body.serviceTitle || body.title

    if (!body.clientName || !body.clientEmail || !projectType) {
      return NextResponse.json({ success: false, message: 'Client name, email and project type are required' }, { status: 400 })
    }

    const status = validStatuses.includes(body.status) ? body.status : 'pending'
    const order = await ProjectOrder.create({
      ...body,
      projectType,
      serviceTitle: body.serviceTitle || projectType,
      title: body.title || projectType,
      status,
      progress: clampProgress(body.progress) ?? progressByStatus[status],
      statusHistory: [
        {
          status,
          note: body.adminNote || 'Order created by admin',
          changedBy: admin.id,
          changedAt: new Date(),
        },
      ],
    })

    return NextResponse.json({ success: true, message: 'Order created successfully', data: order }, { status: 201 })
  } catch (error: any) {
    console.error('Admin order creation error:', error)
    return NextResponse.json({ success: false, message: error.message || 'Failed to create order' }, { status: 500 })
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

    const order = await ProjectOrder.findById(id)
    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 })
    }

    const oldStatus = order.status
    const updatableFields = [
      'clientName',
      'clientEmail',
      'clientPhone',
      'companyName',
      'projectType',
      'serviceTitle',
      'title',
      'budgetRange',
      'budget',
      'deadline',
      'timeline',
      'preferredTechnology',
      'description',
      'referenceLinks',
      'attachmentUrl',
      'meetingPreference',
      'meetingLink',
      'proposalUrl',
      'deliveryUrl',
      'adminNote',
      'clientNote',
    ]

    updatableFields.forEach((field) => {
      if (body[field] !== undefined) {
        order[field] = body[field]
      }
    })

    if (body.status !== undefined) {
      if (!validStatuses.includes(body.status)) {
        return NextResponse.json({ success: false, message: 'Invalid order status' }, { status: 400 })
      }
      order.status = body.status
    }

    const manualProgress = clampProgress(body.progress)
    if (manualProgress !== undefined) {
      order.progress = manualProgress
    } else if (oldStatus !== order.status) {
      order.progress = progressByStatus[order.status] ?? order.progress
    }

    if (oldStatus !== order.status) {
      order.statusHistory.push({
        status: order.status,
        note: body.statusNote || body.adminNote || `Status changed from ${oldStatus} to ${order.status}`,
        changedBy: admin.id,
        changedAt: new Date(),
      })
    }

    await order.save()
    const populated = await ProjectOrder.findById(order._id).populate('clientId', 'name email role')
    return NextResponse.json({ success: true, message: 'Order updated successfully', data: populated })
  } catch (error: any) {
    console.error('Admin order update error:', error)
    return NextResponse.json({ success: false, message: error.message || 'Failed to update order' }, { status: 500 })
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

    const item = await ProjectOrder.findByIdAndDelete(id)
    if (!item) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'Order deleted successfully' })
  } catch (error: any) {
    console.error('Admin order delete error:', error)
    return NextResponse.json({ success: false, message: error.message || 'Failed to delete order' }, { status: 500 })
  }
}
