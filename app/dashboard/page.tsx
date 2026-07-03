'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && user) {
      // Redirect to role-specific dashboard
      router.push(`/dashboard/${user.role}`)
    }
  }, [user, loading, router])

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-teal-500"></div>
          <p className="mt-4 text-sm text-slate-500">Redirecting to your dashboard...</p>
        </div>
      </div>
    </ProtectedRoute>
  )
}
