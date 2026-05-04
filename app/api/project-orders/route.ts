import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import ProjectOrder from '@/models/ProjectOrder'
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
    const requiredFields = ['clientName', 'clientEmail', 'clientPhone', 'projectType', 'description']

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
      const matchedClient = await User.findOne({ email: String(body.clientEmail).toLowerCase(), role: 'client' })
      clientId = matchedClient?._id
    }

    const order = await ProjectOrder.create({
      clientId,
      clientName: body.clientName,
      clientEmail: body.clientEmail,
      clientPhone: body.clientPhone,
      companyName: body.companyName,
      projectType: body.projectType,
      serviceTitle: body.projectType,
      title: body.projectType,
      budgetRange: body.budgetRange,
      deadline: body.deadline,
      preferredTechnology: body.preferredTechnology,
      description: body.description,
      referenceLinks: body.referenceLinks || [],
      attachmentUrl: body.attachmentUrl,
      meetingPreference: body.meetingPreference,
      status: 'pending',
      progress: 0,
      statusHistory: [
        {
          status: 'pending',
          note: 'Public project request submitted',
          changedBy: clientId,
          changedAt: new Date(),
        },
      ],
    })

    return NextResponse.json({ success: true, message: 'Project order request submitted', data: order }, { status: 201 })
  } catch (error: any) {
    console.error('Project order submission error:', error)
    return NextResponse.json({ success: false, message: error.message || 'Failed to submit project order' }, { status: 500 })
  }
}
