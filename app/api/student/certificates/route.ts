import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Certificate from '@/models/Certificate'
import Course from '@/models/Course'
import Enrollment from '@/models/Enrollment'
import Lesson from '@/models/Lesson'
import User from '@/models/User'
import { withStudentAuth } from '@/lib/clientAuth'

const toId = (value: any) => value?._id?.toString?.() || value?.toString?.() || String(value)

function makeCertificateId(studentId: string, courseId: string) {
  const left = studentId.slice(-6).toUpperCase()
  const right = courseId.slice(-6).toUpperCase()
  const stamp = Date.now().toString().slice(-6)
  return `MSI-${left}-${right}-${stamp}`
}

export async function GET(request: NextRequest) {
  try {
    const student = withStudentAuth(request)
    if (!student) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    const url = new URL(request.url)
    const enrollmentId = url.searchParams.get('enrollmentId')

    const filter: any = { studentId: student.id }
    if (enrollmentId) filter.enrollmentId = enrollmentId

    const certificates = await Certificate.find(filter)
      .populate('courseId')
      .populate('enrollmentId')
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json({
      success: true,
      data: enrollmentId ? certificates[0] || null : certificates,
    })
  } catch (error: any) {
    console.error('Student certificates fetch error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch certificates' },
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
    const { enrollmentId } = await request.json()

    if (!enrollmentId) {
      return NextResponse.json({ success: false, message: 'Enrollment ID is required' }, { status: 400 })
    }

    const enrollment = await Enrollment.findById(enrollmentId)
    if (!enrollment || toId(enrollment.studentId) !== student.id) {
      return NextResponse.json({ success: false, message: 'Enrollment not found' }, { status: 404 })
    }

    const course = await Course.findById(enrollment.courseId)
    if (!course) {
      return NextResponse.json({ success: false, message: 'Course not found' }, { status: 404 })
    }

    const totalLessons = await Lesson.countDocuments({ courseId: course._id })
    const progress = totalLessons ? Math.round((enrollment.completedLessons.length / totalLessons) * 100) : enrollment.progress

    if (progress < 100 || enrollment.status !== 'completed') {
      return NextResponse.json(
        { success: false, message: 'Complete all lessons before generating certificate' },
        { status: 400 }
      )
    }

    if (course.certificateEnabled === false) {
      return NextResponse.json(
        { success: false, message: 'Certificate is not enabled for this course' },
        { status: 400 }
      )
    }

    const existing = await Certificate.findOne({ enrollmentId: enrollment._id })
    if (existing) {
      return NextResponse.json({ success: true, message: 'Certificate already generated', data: existing })
    }

    const user = await User.findById(student.id).lean()
    const certificateId = makeCertificateId(student.id, toId(course._id))

    const certificate = await Certificate.create({
      studentId: student.id,
      courseId: course._id,
      enrollmentId: enrollment._id,
      certificateId,
      studentName: user?.name || student.email,
      courseName: course.title,
      instructorName: course.instructor || 'Md Shafiqul Islam',
      completionDate: enrollment.completedAt || new Date(),
      certificateUrl: `/dashboard/student/certificates/${certificateId}`,
    })

    enrollment.certificateIssued = true
    enrollment.completedAt = enrollment.completedAt || new Date()
    await enrollment.save()

    return NextResponse.json({ success: true, message: 'Certificate generated successfully', data: certificate }, { status: 201 })
  } catch (error: any) {
    console.error('Student certificate generation error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to generate certificate' },
      { status: 500 }
    )
  }
}
