'use client'

import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import Link from 'next/link'
import axios from 'axios'
import toast from 'react-hot-toast'
import { BookOpen } from 'lucide-react'
import ProtectedRoute from '@/components/ProtectedRoute'
import DashboardLayout from '@/components/DashboardLayout'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function StudentCoursesPage() {
  const [courses, setCourses] = useState<any[]>([])
  const [enrollments, setEnrollments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [busyCourseId, setBusyCourseId] = useState<string | null>(null)

  const loadData = async () => {
    try {
      const [coursesRes, enrollmentsRes] = await Promise.all([
        axios.get('/api/student/courses'),
        axios.get('/api/student/enrollments'),
      ])
      setCourses(coursesRes.data.data || [])
      setEnrollments(enrollmentsRes.data.data || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const enrollmentMap = useMemo(() => {
    return new Map(enrollments.map((item) => [String(item.courseId?._id || item.courseId), item]))
  }, [enrollments])

  const enrolledCourses = courses.filter(
    (course) => course.isEnrolled || enrollmentMap.has(String(course._id))
  )
  const availableCourses = courses.filter(
    (course) => !course.isEnrolled && !enrollmentMap.has(String(course._id))
  )

  const enroll = async (courseId: string) => {
    try {
      setBusyCourseId(courseId)
      const { data } = await axios.post('/api/student/enrollments', { courseId })
      toast.success(data.message || 'Enrolled successfully!')
      await loadData()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Enrollment failed')
    } finally {
      setBusyCourseId(null)
    }
  }

  return (
    <ProtectedRoute requiredRoles={['student']}>
      <DashboardLayout title="My Courses">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="space-y-8">
            {/* Enrolled courses */}
            <section>
              <h2 className="mb-4 text-lg font-bold text-slate-900">Enrolled Courses</h2>
              {enrolledCourses.length ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {enrolledCourses.map((course) => {
                    const enrollment =
                      course.enrollment || enrollmentMap.get(String(course._id)) || {}
                    return (
                      <CourseCard key={course._id} course={course} enrollment={enrollment}>
                        <Link
                          href={`/dashboard/student/courses/${course._id}`}
                          className="btn-primary w-full text-center"
                        >
                          Continue Learning →
                        </Link>
                      </CourseCard>
                    )
                  })}
                </div>
              ) : (
                <EmptyCard
                  title="No enrolled courses yet"
                  description="Choose a course from the available list below to start learning."
                />
              )}
            </section>

            {/* Available courses */}
            <section>
              <h2 className="mb-4 text-lg font-bold text-slate-900">Available Courses</h2>
              {availableCourses.length ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {availableCourses.map((course) => (
                    <CourseCard key={course._id} course={course}>
                      <button
                        onClick={() => enroll(course._id)}
                        disabled={busyCourseId === course._id}
                        className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {busyCourseId === course._id ? 'Enrolling...' : 'Enroll Now'}
                      </button>
                    </CourseCard>
                  ))}
                </div>
              ) : (
                <EmptyCard
                  title="No new courses"
                  description="You are enrolled in all currently published courses."
                />
              )}
            </section>
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  )
}

function CourseCard({
  course,
  enrollment,
  children,
}: {
  course: any
  enrollment?: any
  children: ReactNode
}) {
  const progress = enrollment?.progress || course.enrollment?.progress || 0

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_2px_16px_rgba(15,23,42,0.07)]">
      {/* 16:9 image */}
      <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-slate-100">
        {course.image ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${course.image})` }}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <BookOpen className="h-10 w-10 text-slate-300" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-semibold text-primary-700">
            {course.category || 'Course'}
          </span>
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
            {course.isFree || !course.price ? 'Free' : `$${course.price}`}
          </span>
        </div>

        <h3 className="mb-1.5 text-sm font-bold text-slate-900">{course.title}</h3>
        <p className="mb-4 line-clamp-2 text-xs leading-5 text-slate-500">
          {course.shortDescription || course.description}
        </p>

        {enrollment && (
          <div className="mb-4">
            <div className="mb-1.5 flex justify-between text-xs text-slate-500">
              <span>Progress</span>
              <span className="font-semibold text-slate-700">{progress}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-1.5 rounded-full bg-primary-600 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="mt-auto">{children}</div>
      </div>
    </div>
  )
}

function EmptyCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-12 text-center">
      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary-50">
        <BookOpen className="h-6 w-6 text-primary-400" />
      </div>
      <p className="text-sm font-semibold text-slate-700">{title}</p>
      <p className="mt-1 max-w-xs text-xs text-slate-400">{description}</p>
    </div>
  )
}
