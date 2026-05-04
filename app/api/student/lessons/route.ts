import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Course from '@/models/Course'
import Lesson from '@/models/Lesson'
import Enrollment from '@/models/Enrollment'
import { withStudentAuth } from '@/lib/clientAuth'

const toId = (value: any) => value?._id?.toString?.() || value?.toString?.() || String(value)

const calculateProgress = (completedLessons: any[], totalLessons: number) => {
  if (!totalLessons) return 0
  return Math.min(100, Math.round((completedLessons.length / totalLessons) * 100))
}

async function getLessonAccess(studentId: string, lessonId: string) {
  const lesson = await Lesson.findById(lessonId).lean()
  if (!lesson) return null

  const course = await Course.findById(lesson.courseId).lean()
  if (!course || !course.published) return null

  const enrollment = await Enrollment.findOne({ studentId, courseId: lesson.courseId })
  const locked = lesson.isLocked || lesson.locked
  const accessible = lesson.isPreview || !locked || Boolean(enrollment)

  return { lesson, course, enrollment, locked, accessible }
}

export async function GET(request: NextRequest) {
  try {
    const student = withStudentAuth(request)
    if (!student) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    const url = new URL(request.url)
    const lessonId = url.searchParams.get('id')

    if (!lessonId) {
      return NextResponse.json({ success: false, message: 'Lesson ID is required' }, { status: 400 })
    }

    const access = await getLessonAccess(student.id, lessonId)
    if (!access) {
      return NextResponse.json({ success: false, message: 'Lesson not found' }, { status: 404 })
    }

    const { lesson, course, enrollment, locked, accessible } = access
    if (!accessible) {
      return NextResponse.json(
        {
          success: false,
          message: 'Enroll in this course to unlock this lesson',
          data: { lesson: { ...lesson, videoUrl: undefined }, course, locked, accessible: false },
        },
        { status: 403 }
      )
    }

    return NextResponse.json({
      success: true,
      data: { lesson: { ...lesson, locked, accessible }, course, enrollment },
    })
  } catch (error: any) {
    console.error('Student lesson fetch error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch lesson' },
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
    const { lessonId, action = 'complete' } = await request.json()

    if (!lessonId) {
      return NextResponse.json({ success: false, message: 'Lesson ID is required' }, { status: 400 })
    }

    const lesson = await Lesson.findById(lessonId)
    if (!lesson) {
      return NextResponse.json({ success: false, message: 'Lesson not found' }, { status: 404 })
    }

    const enrollment = await Enrollment.findOne({ studentId: student.id, courseId: lesson.courseId })
    if (!enrollment) {
      return NextResponse.json(
        { success: false, message: 'Enroll in this course before tracking progress' },
        { status: 403 }
      )
    }

    const completedIds = enrollment.completedLessons.map((item: any) => toId(item))
    const alreadyCompleted = completedIds.includes(lessonId)

    if (action === 'uncomplete') {
      enrollment.completedLessons = enrollment.completedLessons.filter((item: any) => toId(item) !== lessonId)
    } else if (!alreadyCompleted) {
      enrollment.completedLessons.push(lesson._id)
    }

    const totalLessons = await Lesson.countDocuments({ courseId: lesson.courseId })
    enrollment.progress = calculateProgress(enrollment.completedLessons, totalLessons)
    enrollment.status = enrollment.progress >= 100 ? 'completed' : 'active'
    enrollment.completedAt = enrollment.progress >= 100 ? enrollment.completedAt || new Date() : undefined

    await enrollment.save()

    return NextResponse.json({ success: true, message: 'Lesson progress updated', data: enrollment })
  } catch (error: any) {
    console.error('Student lesson progress error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update lesson progress' },
      { status: 500 }
    )
  }
}
