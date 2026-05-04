'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import ProtectedRoute from '@/components/ProtectedRoute'
import DashboardLayout from '@/components/DashboardLayout'
import LoadingSpinner from '@/components/LoadingSpinner'
import EmptyState from '@/components/EmptyState'
import DashboardStatsCard from '@/components/DashboardStatsCard'

export default function StudentDashboard() {
  const [enrollments, setEnrollments] = useState<any[]>([])
  const [liveClasses, setLiveClasses] = useState<any[]>([])
  const [certificates, setCertificates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [enrollmentRes, liveClassRes, certificateRes] = await Promise.all([
          axios.get('/api/student/enrollments'),
          axios.get('/api/student/live-classes'),
          axios.get('/api/student/certificates'),
        ])

        setEnrollments(enrollmentRes.data.data || [])
        setLiveClasses(liveClassRes.data.data || [])
        setCertificates(certificateRes.data.data || [])
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  const stats = useMemo(() => {
    const completed = enrollments.filter((item) => item.status === 'completed').length
    const avgProgress = enrollments.length
      ? Math.round(enrollments.reduce((sum, item) => sum + (item.progress || 0), 0) / enrollments.length)
      : 0

    return { completed, avgProgress }
  }, [enrollments])

  return (
    <ProtectedRoute requiredRoles={['student']}>
      <DashboardLayout title="Student Dashboard">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
              <DashboardStatsCard title="Enrolled Courses" value={enrollments.length} icon="📚" />
              <DashboardStatsCard title="Completed Courses" value={stats.completed} icon="✅" />
              <DashboardStatsCard title="Average Progress" value={`${stats.avgProgress}%`} icon="📊" />
              <DashboardStatsCard title="Certificates" value={certificates.length} icon="🏆" />
            </div>

            <section className="rounded-2xl bg-white p-6 shadow dark:bg-dark-800">
              <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Courses</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Continue lessons, track progress, and generate certificates.</p>
                </div>
                <Link href="/dashboard/student/courses" className="btn-primary">
                  View All Courses
                </Link>
              </div>

              {enrollments.length ? (
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                  {enrollments.slice(0, 6).map((enrollment) => {
                    const course = enrollment.courseId || {}
                    return (
                      <div key={enrollment._id} className="rounded-2xl border border-gray-200 p-5 dark:border-gray-700">
                        <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">{course.title}</h3>
                        <p className="mb-4 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">{course.shortDescription || course.description}</p>
                        <ProgressBar value={enrollment.progress || 0} />
                        <div className="mt-4 flex items-center justify-between gap-3">
                          <span className="text-xs font-semibold capitalize text-gray-500 dark:text-gray-400">{enrollment.status}</span>
                          <Link href={`/dashboard/student/courses/${course._id}`} className="text-sm font-semibold text-primary-600 dark:text-primary-300">
                            Continue →
                          </Link>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <EmptyState title="No enrolled courses" description="Enroll in a course to start watching lessons." />
              )}
            </section>

            <div className="grid gap-8 lg:grid-cols-2">
              <section className="rounded-2xl bg-white p-6 shadow dark:bg-dark-800">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Upcoming Live Classes</h2>
                  <Link href="/dashboard/student/live-classes" className="text-sm font-semibold text-primary-600 dark:text-primary-300">View all</Link>
                </div>
                {liveClasses.length ? (
                  <div className="space-y-4">
                    {liveClasses.slice(0, 4).map((liveClass) => (
                      <div key={liveClass._id} className="rounded-2xl border border-gray-200 p-4 dark:border-gray-700">
                        <p className="font-semibold text-gray-900 dark:text-white">{liveClass.title}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{liveClass.courseId?.title}</p>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                          {liveClass.scheduledDate ? new Date(liveClass.scheduledDate).toLocaleString() : 'Schedule coming soon'}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState title="No live classes" description="Live classes for enrolled courses will appear here." />
                )}
              </section>

              <section className="rounded-2xl bg-white p-6 shadow dark:bg-dark-800">
                <h2 className="mb-5 text-xl font-bold text-gray-900 dark:text-white">Certificates</h2>
                {certificates.length ? (
                  <div className="space-y-4">
                    {certificates.slice(0, 4).map((certificate) => (
                      <div key={certificate._id} className="rounded-2xl border border-gray-200 p-4 dark:border-gray-700">
                        <p className="font-semibold text-gray-900 dark:text-white">{certificate.courseName}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Certificate ID: {certificate.certificateId}</p>
                        <button onClick={() => window.print()} className="mt-3 text-sm font-semibold text-primary-600 dark:text-primary-300">
                          Print / Save PDF
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState title="No certificates yet" description="Complete a course 100% to generate a certificate." />
                )}
              </section>
            </div>
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  )
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div>
      <div className="mb-2 flex justify-between text-xs text-gray-600 dark:text-gray-400">
        <span>Progress</span>
        <span>{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700">
        <div className="h-2 rounded-full bg-primary-600 transition-all" style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}
