'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { Award, BarChart2, BookOpen, CalendarDays, CheckCircle2 } from 'lucide-react'
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
            {/* Stats row */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
              <DashboardStatsCard title="Enrolled Courses"  value={enrollments.length}        icon={BookOpen}     helperText="Active enrollments" />
              <DashboardStatsCard title="Completed Courses" value={stats.completed}            icon={CheckCircle2} helperText="Finished courses" />
              <DashboardStatsCard title="Average Progress"  value={`${stats.avgProgress}%`}   icon={BarChart2}    helperText="Across all courses" />
              <DashboardStatsCard title="Certificates"      value={certificates.length}        icon={Award}        helperText="Earned certificates" />
            </div>

            {/* Your Courses */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Your Courses</h2>
                  <p className="text-sm text-slate-500">Continue lessons, track progress, and generate certificates.</p>
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
                      <div key={enrollment._id} className="rounded-2xl border border-slate-200 p-5">
                        <h3 className="mb-2 font-semibold text-slate-900">{course.title}</h3>
                        <p className="mb-4 line-clamp-2 text-sm text-slate-500">
                          {course.shortDescription || course.description}
                        </p>
                        <ProgressBar value={enrollment.progress || 0} />
                        <div className="mt-4 flex items-center justify-between gap-3">
                          <span className="text-xs font-semibold capitalize text-slate-500">
                            {enrollment.status}
                          </span>
                          <Link
                            href={`/dashboard/student/courses/${course._id}`}
                            className="text-sm font-semibold text-teal-600 hover:text-teal-500"
                          >
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
              {/* Upcoming Live Classes */}
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Upcoming Live Classes</h2>
                    <p className="text-sm text-slate-500">Scheduled sessions for your courses.</p>
                  </div>
                  <Link href="/dashboard/student/live-classes" className="text-sm font-semibold text-teal-600 hover:text-teal-500">
                    View all
                  </Link>
                </div>
                {liveClasses.length ? (
                  <div className="space-y-3">
                    {liveClasses.slice(0, 4).map((liveClass) => (
                      <div key={liveClass._id} className="flex items-start gap-3 rounded-2xl border border-slate-200 p-4">
                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                          <CalendarDays className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900">{liveClass.title}</p>
                          <p className="text-xs text-slate-500">{liveClass.courseId?.title}</p>
                          <p className="mt-1 text-xs text-slate-400">
                            {liveClass.scheduledDate
                              ? new Date(liveClass.scheduledDate).toLocaleString()
                              : 'Schedule coming soon'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState title="No live classes" description="Live classes for enrolled courses will appear here." />
                )}
              </section>

              {/* Certificates */}
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-900">Certificates</h2>
                  <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700">
                    {certificates.length} earned
                  </span>
                </div>
                {certificates.length ? (
                  <div className="space-y-3">
                    {certificates.slice(0, 4).map((certificate) => (
                      <div key={certificate._id} className="flex items-start gap-3 rounded-2xl border border-slate-200 p-4">
                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                          <Award className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-slate-900">{certificate.courseName}</p>
                          <p className="text-xs text-slate-500">ID: {certificate.certificateId}</p>
                        </div>
                        <button
                          onClick={() => window.print()}
                          className="shrink-0 text-sm font-semibold text-teal-600 hover:text-teal-500"
                        >
                          Print
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
      <div className="mb-2 flex justify-between text-xs text-slate-500">
        <span>Progress</span>
        <span>{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-slate-100">
        <div className="h-2 rounded-full bg-teal-600 transition-all" style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}
