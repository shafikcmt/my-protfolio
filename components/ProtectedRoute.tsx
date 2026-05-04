'use client'

import { ReactNode, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { UserRole } from '@/types/auth'

interface ProtectedRouteProps {
  children: ReactNode
  requiredRoles?: UserRole[]
}

export default function ProtectedRoute({ children, requiredRoles }: ProtectedRouteProps) {
  const router = useRouter()
  const { isAuthenticated, loading, user } = useAuth()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    if (loading) return

    if (!isAuthenticated) {
      setIsAuthorized(false)
      router.replace('/auth/login')
      return
    }

    if (requiredRoles && user && !requiredRoles.includes(user.role as UserRole)) {
      setIsAuthorized(false)
      router.replace('/dashboard')
      return
    }

    setIsAuthorized(true)
  }, [isAuthenticated, loading, user, requiredRoles, router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-dark-900">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-primary-500" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-dark-900">
        <p className="text-gray-600 dark:text-gray-400">Redirecting...</p>
      </div>
    )
  }

  return <>{children}</>
}
