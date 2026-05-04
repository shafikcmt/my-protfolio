import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Course from '@/models/Course'
import Lesson from '@/models/Lesson'
import Enrollment from '@/models/Enrollment'
import Certificate from '@/models/Certificate'
import { withStudentAuth } from '@/lib/clientAuth'

const toId = (value: any) => value?._id?.toString?.() || value?.toString?.() || String(value)

function sanitizeLesson(lesson: any, isEnrolled: boolean) {
  const locked = lesson.isLocked || lesson.locked
  const accessible = lesson.isPreview || !locked || isEnrolled

  return {
    ...lesson,
    accessible,
    locked,
    videoUrl: accessible ? lesson.videoUrl : undefined,
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
    const courseId = url.searchParams.get('id')

    if (courseId) {
      const course = await Course.findById(courseId).lean()
      if (!course || !course.published) {
        return NextResponse.json({ success: false, message: 'Course not found' }, { status: 404 })
      }

      const enrollment = await Enrollment.findOne({ studentId: student.id, courseId }).lean()
      const isEnrolled = Boolean(enrollment)
      const lessons = await Lesson.find({ courseId }).sort({ order: 1 }).lean()
      const certificate = enrollment
        ? await Certificate.findOne({ enrollmentId: enrollment._id }).lean()
        : null

      return NextResponse.json({
        success: true,
        data: {
          course,
          enrollment: enrollment ? { ...enrollment, certificate } : null,
          lessons: lessons.map((lesson: any) => sanitizeLesson(lesson, isEnrolled)),
        },
      })
    }

    const courses = await Course.find({ published: true }).sort({ createdAt: -1 }).lean()
    const enrollments = await Enrollment.find({ studentId: student.id }).lean()
    const enrollmentMap = new Map(enrollments.map((enrollment: any) => [toId(enrollment.courseId), enrollment]))

    const data = await Promise.all(
      courses.map(async (course: any) => {
        const enrollment = enrollmentMap.get(toId(course._id)) || null
        const totalLessons = await Lesson.countDocuments({ courseId: course._id })
        return {
          ...course,
          isEnrolled: Boolean(enrollment),
          enrollment,
          totalLessons: course.totalLessons || course.lessons || totalLessons,
        }
      })
    )

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error('Student courses fetch error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch courses' },
      { status: 500 }
    )
  }
}
