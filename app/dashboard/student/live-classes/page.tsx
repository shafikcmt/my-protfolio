'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Video } from 'lucide-react'
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
              <div key={liveClass._id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(liveClass.status)}`}>
                      {liveClass.status || 'scheduled'}
                    </span>
                    <h2 className="mt-3 text-xl font-bold text-slate-900">{liveClass.title}</h2>
                    <p className="mt-1 text-sm text-slate-500">{liveClass.courseId?.title || 'Course live class'}</p>
                  </div>
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-50">
                    <Video className="h-6 w-6 text-teal-600" />
                  </div>
                </div>

                <p className="mb-5 text-sm text-slate-500">{liveClass.description || 'Join this live training class from your enrolled course dashboard.'}</p>

                <div className="mb-5 grid gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
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
      return 'bg-red-100 text-red-700'
    case 'ended':
      return 'bg-slate-100 text-slate-600'
    case 'cancelled':
      return 'bg-yellow-100 text-yellow-700'
    default:
      return 'bg-emerald-100 text-emerald-700'
  }
}
