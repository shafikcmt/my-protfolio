import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import LiveClass from '@/models/LiveClass'
import Enrollment from '@/models/Enrollment'
import { withStudentAuth } from '@/lib/clientAuth'

const toId = (value: any) => value?._id?.toString?.() || value?.toString?.() || String(value)

export async function GET(request: NextRequest) {
  try {
    const student = withStudentAuth(request)
    if (!student) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    const enrollments = await Enrollment.find({ studentId: student.id }).lean()
    const courseIds = enrollments.map((item: any) => item.courseId)

    if (!courseIds.length) {
      return NextResponse.json({ success: true, data: [] })
    }

    const classes = await LiveClass.find({
      courseId: { $in: courseIds },
      status: { $ne: 'cancelled' },
    })
      .populate('courseId')
      .sort({ scheduledDate: 1 })
      .lean()

    return NextResponse.json({ success: true, data: classes })
  } catch (error: any) {
    console.error('Student live classes fetch error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch live classes' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const student = withStudentAuth(request)
    if (!student) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    const body = await request.json()
    const classId = body.classId

    if (!classId) {
      return NextResponse.json({ success: false, message: 'Class ID is required' }, { status: 400 })
    }

    const liveClass = await LiveClass.findById(classId).populate('courseId')
    if (!liveClass || liveClass.status === 'cancelled') {
      return NextResponse.json({ success: false, message: 'Live class not found' }, { status: 404 })
    }

    const enrollment = await Enrollment.findOne({ studentId: student.id, courseId: liveClass.courseId?._id || liveClass.courseId })
    if (!enrollment) {
      return NextResponse.json(
        { success: false, message: 'Only enrolled students can join this live class' },
        { status: 403 }
      )
    }

    if (!liveClass.meetingLink) {
      return NextResponse.json(
        { success: false, message: 'Meeting link is not available yet' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Live class access granted',
      data: {
        classId: toId(liveClass._id),
        title: liveClass.title,
        course: liveClass.courseId,
        meetingLink: liveClass.meetingLink,
        status: liveClass.status,
      },
    })
  } catch (error: any) {
    console.error('Student live class join error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to join live class' },
      { status: 500 }
    )
  }
}
