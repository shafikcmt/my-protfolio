import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Course from '@/models/Course'
import Lesson from '@/models/Lesson'

function sanitizePublicLesson(lesson: any) {
  const locked = lesson.isLocked || lesson.locked
  const accessible = lesson.isPreview || !locked
  return {
    ...lesson,
    locked,
    accessible,
    videoUrl: accessible ? lesson.videoUrl : undefined,
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const url = new URL(request.url)
    const slug = url.searchParams.get('slug')
    const id = url.searchParams.get('id')

    if (slug || id) {
      const filter: any = { published: true }
      if (slug) filter.slug = slug
      if (id) filter._id = id

      const course = await Course.findOne(filter).lean()
      if (!course) {
        return NextResponse.json({ success: false, message: 'Course not found' }, { status: 404 })
      }

      const lessons = await Lesson.find({ courseId: course._id }).sort({ order: 1 }).lean()
      return NextResponse.json({
        success: true,
        data: {
          course,
          lessons: lessons.map(sanitizePublicLesson),
        },
      })
    }

    const courses = await Course.find({ published: true }).sort({ createdAt: -1 }).lean()
    const data = await Promise.all(
      courses.map(async (course: any) => {
        const totalLessons = await Lesson.countDocuments({ courseId: course._id })
        return {
          ...course,
          totalLessons: course.totalLessons || course.lessons || totalLessons,
        }
      })
    )

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error('Public course fetch error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch courses' },
      { status: 500 }
    )
  }
}
