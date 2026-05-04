'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import ProtectedRoute from '@/components/ProtectedRoute'
import DashboardLayout from '@/components/DashboardLayout'
import LoadingSpinner from '@/components/LoadingSpinner'
import EmptyState from '@/components/EmptyState'

export default function StudentLiveClassesPage() {
  const [classes, setClasses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [joiningId, setJoiningId] = useState<string | null>(null)

  useEffect(() => {
    const loadClasses = async () => {
      try {
        const { data } = await axios.get('/api/student/live-classes')
        setClasses(data.data || [])
      } finally {
        setLoading(false)
      }
    }

    loadClasses()
  }, [])

  const joinClass = async (classId: string) => {
    try {
      setJoiningId(classId)
      const { data } = await axios.post('/api/student/live-classes', { classId })
      toast.success(data.message || 'Live class access granted')
      if (data.data?.meetingLink) {
        window.open(data.data.meetingLink, '_blank', 'noopener,noreferrer')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Could not join live class')
    } finally {
      setJoiningId(null)
    }
  }

  return (
    <ProtectedRoute requiredRoles={['student']}>
      <DashboardLayout title="Live Classes">
        {loading ? (
          <LoadingSpinner />
        ) : classes.length ? (
          <div className="grid gap-5 lg:grid-cols-2">
            {classes.map((liveClass) => (
              <div key={liveClass._id} className="rounded-2xl bg-white p-6 shadow dark:bg-dark-800">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(liveClass.status)}`}>
                      {liveClass.status || 'scheduled'}
                    </span>
                    <h2 className="mt-3 text-xl font-bold text-gray-900 dark:text-white">{liveClass.title}</h2>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{liveClass.courseId?.title || 'Course live class'}</p>
                  </div>
                  <span className="text-4xl">🎥</span>
                </div>

                <p className="mb-5 text-gray-600 dark:text-gray-400">{liveClass.description || 'Join this live training class from your enrolled course dashboard.'}</p>

                <div className="mb-5 grid gap-3 rounded-2xl bg-gray-50 p-4 text-sm text-gray-700 dark:bg-dark-900 dark:text-gray-300">
                  <p><strong>Date:</strong> {liveClass.scheduledDate ? new Date(liveClass.scheduledDate).toLocaleString() : 'Coming soon'}</p>
                  <p><strong>Instructor:</strong> {liveClass.instructor || 'Md Shafiqul Islam'}</p>
                  <p><strong>Duration:</strong> {liveClass.duration ? `${liveClass.duration} minutes` : 'Flexible'}</p>
                  <p><strong>Capacity:</strong> {liveClass.capacity || 'Open'}</p>
                </div>

                <button
                  onClick={() => joinClass(liveClass._id)}
                  disabled={joiningId === liveClass._id || liveClass.status === 'ended'}
                  className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {joiningId === liveClass._id ? 'Opening...' : liveClass.status === 'ended' ? 'Class Ended' : 'Join Live Class'}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No live classes found"
            description="Live classes for your enrolled courses will appear here after admin schedules them."
          />
        )}
      </DashboardLayout>
    </ProtectedRoute>
  )
}

function statusClass(status?: string) {
  switch (status) {
    case 'live':
      return 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-200'
    case 'ended':
      return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
    case 'cancelled':
      return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-200'
    default:
      return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200'
  }
}
