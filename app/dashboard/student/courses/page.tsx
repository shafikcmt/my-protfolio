'use client'

import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import Link from 'next/link'
import axios from 'axios'
import toast from 'react-hot-toast'
import ProtectedRoute from '@/components/ProtectedRoute'
import DashboardLayout from '@/components/DashboardLayout'
import LoadingSpinner from '@/components/LoadingSpinner'
import EmptyState from '@/components/EmptyState'

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

  const enrolledCourses = courses.filter((course) => course.isEnrolled || enrollmentMap.has(String(course._id)))
  const availableCourses = courses.filter((course) => !course.isEnrolled && !enrollmentMap.has(String(course._id)))

  const enroll = async (courseId: string) => {
    try {
      setBusyCourseId(courseId)
      const { data } = await axios.post('/api/student/enrollments', { courseId })
      toast.success(data.message || 'Enrolled successfully')
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
            <section className="rounded-2xl bg-white p-6 shadow dark:bg-dark-800">
              <h2 className="mb-5 text-xl font-bold text-gray-900 dark:text-white">Enrolled Courses</h2>
              {enrolledCourses.length ? (
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                  {enrolledCourses.map((course) => {
                    const enrollment = course.enrollment || enrollmentMap.get(String(course._id)) || {}
                    return (
                      <CourseBox key={course._id} course={course} enrollment={enrollment}>
                        <Link href={`/dashboard/student/courses/${course._id}`} className="btn-primary w-full">
                          Continue Learning
                        </Link>
                      </CourseBox>
                    )
                  })}
                </div>
              ) : (
                <EmptyState title="No enrolled courses" description="Choose a course from the available list below." />
              )}
            </section>

            <section className="rounded-2xl bg-white p-6 shadow dark:bg-dark-800">
              <h2 className="mb-5 text-xl font-bold text-gray-900 dark:text-white">Available Courses</h2>
              {availableCourses.length ? (
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                  {availableCourses.map((course) => (
                    <CourseBox key={course._id} course={course}>
                      <button
                        onClick={() => enroll(course._id)}
                        disabled={busyCourseId === course._id}
                        className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {busyCourseId === course._id ? 'Enrolling...' : 'Enroll Now'}
                      </button>
                    </CourseBox>
                  ))}
                </div>
              ) : (
                <EmptyState title="No new courses" description="You are enrolled in all currently published courses." />
              )}
            </section>
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  )
}

function CourseBox({ course, enrollment, children }: { course: any; enrollment?: any; children: ReactNode }) {
  const progress = enrollment?.progress || course.enrollment?.progress || 0

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-dark-900">
      {course.image && <div className="h-40 bg-cover bg-center" style={{ backgroundImage: `url(${course.image})` }} />}
      <div className="p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="rounded-full bg-primary-500/10 px-3 py-1 text-xs font-semibold text-primary-700 dark:text-primary-200">{course.category || 'Course'}</span>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-300">
            {course.isFree || !course.price ? 'Free' : `$${course.price}`}
          </span>
        </div>
        <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">{course.title}</h3>
        <p className="mb-4 line-clamp-3 text-sm text-gray-600 dark:text-gray-400">{course.shortDescription || course.description}</p>
        {enrollment && (
          <div className="mb-4">
            <div className="mb-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700">
              <div className="h-2 rounded-full bg-primary-600" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
