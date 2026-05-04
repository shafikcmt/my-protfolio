import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

export async function withAdminAuth(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value

    if (!token) {
      return null
    }

    const decoded = verifyToken(token)

    if (!decoded || decoded.role !== 'admin') {
      return null
    }

    return decoded
  } catch (error) {
    return null
  }
}

export async function handleCRUDRequest(
  request: NextRequest,
  model: any,
  entityName: string
) {
  try {
    await connectDB()

    // Verify admin authentication
    const admin = await withAdminAuth(request)
    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Admin access required' },
        { status: 401 }
      )
    }

    if (request.method === 'GET') {
      const url = new URL(request.url)
      const id = url.searchParams.get('id')

      if (id) {
        const item = await model.findById(id)
        if (!item) {
          return NextResponse.json(
            { success: false, message: `${entityName} not found` },
            { status: 404 }
          )
        }
        return NextResponse.json({ success: true, data: item })
      } else {
        const items = await model.find({}).sort({ createdAt: -1 })
        return NextResponse.json({ success: true, data: items })
      }
    }

    if (request.method === 'POST') {
      const body = await request.json()
      const item = await model.create(body)
      return NextResponse.json(
        { success: true, message: `${entityName} created successfully`, data: item },
        { status: 201 }
      )
    }

    if (request.method === 'PUT') {
      const body = await request.json()
      const { id, ...updateData } = body

      if (!id) {
        return NextResponse.json(
          { success: false, message: 'ID is required for update' },
          { status: 400 }
        )
      }

      const item = await model.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      })

      if (!item) {
        return NextResponse.json(
          { success: false, message: `${entityName} not found` },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        message: `${entityName} updated successfully`,
        data: item,
      })
    }

    if (request.method === 'DELETE') {
      const body = await request.json()
      const { id } = body

      if (!id) {
        return NextResponse.json(
          { success: false, message: 'ID is required for deletion' },
          { status: 400 }
        )
      }

      const item = await model.findByIdAndDelete(id)

      if (!item) {
        return NextResponse.json(
          { success: false, message: `${entityName} not found` },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        message: `${entityName} deleted successfully`,
      })
    }

    return NextResponse.json(
      { success: false, message: 'Method not allowed' },
      { status: 405 }
    )
  } catch (error: any) {
    console.error(`CRUD error for ${entityName}:`, error)
    return NextResponse.json(
      { success: false, message: error.message || `Failed to handle ${entityName}` },
      { status: 500 }
    )
  }
}
