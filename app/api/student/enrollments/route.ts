import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Enrollment from '@/models/Enrollment'
import Course from '@/models/Course'
import Lesson from '@/models/Lesson'
import Certificate from '@/models/Certificate'
import { withStudentAuth } from '@/lib/clientAuth'

const toId = (value: any) => value?._id?.toString?.() || value?.toString?.() || String(value)

const calculateProgress = (completedLessons: any[], totalLessons: number) => {
  if (!totalLessons) return 0
  return Math.min(100, Math.round((completedLessons.length / totalLessons) * 100))
}

async function populateEnrollment(enrollment: any) {
  const fresh = await Enrollment.findById(enrollment._id).populate('courseId').lean()
  if (!fresh) return null

  const lessons = await Lesson.find({ courseId: fresh.courseId?._id || fresh.courseId })
    .sort({ order: 1 })
    .lean()

  const certificate = await Certificate.findOne({ enrollmentId: fresh._id }).lean()

  return {
    ...fresh,
    lessons,
    certificate,
  }
}

export async function GET(request: NextRequest) {
  try {
    const student = withStudentAuth(request)
    if (!student) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    const url = new URL(request.url)
    const id = url.searchParams.get('id')
    const courseId = url.searchParams.get('courseId')

    if (id) {
      const enrollment = await Enrollment.findById(id)
      if (!enrollment || toId(enrollment.studentId) !== student.id) {
        return NextResponse.json({ success: false, message: 'Enrollment not found' }, { status: 404 })
      }

      const data = await populateEnrollment(enrollment)
      return NextResponse.json({ success: true, data })
    }

    if (courseId) {
      const enrollment = await Enrollment.findOne({ studentId: student.id, courseId })
      if (!enrollment) {
        return NextResponse.json({ success: true, data: null })
      }

      const data = await populateEnrollment(enrollment)
      return NextResponse.json({ success: true, data })
    }

    const enrollments = await Enrollment.find({ studentId: student.id })
      .populate('courseId')
      .sort({ createdAt: -1 })
      .lean()

    const enriched = await Promise.all(
      enrollments.map(async (enrollment: any) => {
        const courseIdValue = enrollment.courseId?._id || enrollment.courseId
        const totalLessons = await Lesson.countDocuments({ courseId: courseIdValue })
        const certificate = await Certificate.findOne({ enrollmentId: enrollment._id }).lean()
        return {
          ...enrollment,
          totalLessons,
          certificate,
        }
      })
    )

    return NextResponse.json({ success: true, data: enriched })
  } catch (error: any) {
    console.error('Student enrollment fetch error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch enrollments' },
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
    const courseId = body.courseId

    if (!courseId) {
      return NextResponse.json({ success: false, message: 'Course ID is required' }, { status: 400 })
    }

    const course = await Course.findById(courseId)
    if (!course || !course.published) {
      return NextResponse.json({ success: false, message: 'Course not found' }, { status: 404 })
    }

    const existing = await Enrollment.findOne({ studentId: student.id, courseId })
    if (existing) {
      const data = await populateEnrollment(existing)
      return NextResponse.json({ success: true, message: 'Already enrolled', data })
    }

    const enrollment = await Enrollment.create({
      studentId: student.id,
      courseId,
      progress: 0,
      completedLessons: [],
      status: 'active',
      certificateIssued: false,
    })

    await Course.findByIdAndUpdate(courseId, { $inc: { students: 1 } })

    const data = await populateEnrollment(enrollment)
    return NextResponse.json({ success: true, message: 'Enrolled successfully', data }, { status: 201 })
  } catch (error: any) {
    console.error('Student enrollment error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to enroll' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const student = withStudentAuth(request)
    if (!student) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    const body = await request.json()
    const { id, lessonId, action = 'complete' } = body

    if (!id && !lessonId) {
      return NextResponse.json(
        { success: false, message: 'Enrollment ID or lesson ID is required' },
        { status: 400 }
      )
    }

    let enrollment = id ? await Enrollment.findById(id) : null
    const lesson = lessonId ? await Lesson.findById(lessonId) : null

    if (!enrollment && lesson) {
      enrollment = await Enrollment.findOne({ studentId: student.id, courseId: lesson.courseId })
    }

    if (!enrollment || toId(enrollment.studentId) !== student.id) {
      return NextResponse.json({ success: false, message: 'Enrollment not found' }, { status: 404 })
    }

    if (lessonId) {
      if (!lesson || toId(lesson.courseId) !== toId(enrollment.courseId)) {
        return NextResponse.json({ success: false, message: 'Lesson not found for this enrollment' }, { status: 404 })
      }

      const completedIds = enrollment.completedLessons.map((item: any) => toId(item))
      const alreadyCompleted = completedIds.includes(lessonId)

      if (action === 'uncomplete') {
        enrollment.completedLessons = enrollment.completedLessons.filter((item: any) => toId(item) !== lessonId)
      } else if (action === 'toggle') {
        enrollment.completedLessons = alreadyCompleted
          ? enrollment.completedLessons.filter((item: any) => toId(item) !== lessonId)
          : [...enrollment.completedLessons, lesson._id]
      } else if (!alreadyCompleted) {
        enrollment.completedLessons.push(lesson._id)
      }

      const totalLessons = await Lesson.countDocuments({ courseId: enrollment.courseId })
      enrollment.progress = calculateProgress(enrollment.completedLessons, totalLessons)
      enrollment.status = enrollment.progress >= 100 ? 'completed' : 'active'
      enrollment.completedAt = enrollment.progress >= 100 ? enrollment.completedAt || new Date() : undefined
    }

    await enrollment.save()

    const data = await populateEnrollment(enrollment)
    return NextResponse.json({ success: true, message: 'Progress updated', data })
  } catch (error: any) {
    console.error('Student enrollment update error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update enrollment' },
      { status: 500 }
    )
  }
}
