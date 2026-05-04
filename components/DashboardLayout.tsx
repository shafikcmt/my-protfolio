'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

interface DashboardLayoutProps {
  children: React.ReactNode
  title: string
  breadcrumbs?: Array<{ label: string; href: string }>
}

export default function DashboardLayout({
  children,
  title,
  breadcrumbs = [],
}: DashboardLayoutProps) {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  const menuItems = [
    { label: 'Dashboard', icon: '📊', href: `/dashboard/${user?.role}` },
    { label: 'Profile', icon: '👤', href: `/dashboard/${user?.role}/profile` },
    ...(user?.role === 'admin'
      ? [
          { label: '--- Content Management ---', icon: '', href: '#', disabled: true },
          { label: 'Projects', icon: '🚀', href: '/dashboard/admin/projects' },
          { label: 'Services', icon: '⚙️', href: '/dashboard/admin/services' },
          { label: 'Skills', icon: '🧠', href: '/dashboard/admin/skills' },
          { label: 'Courses', icon: '📚', href: '/dashboard/admin/courses' },
          { label: 'Lessons', icon: '📝', href: '/dashboard/admin/lessons' },
          { label: 'Live Classes', icon: '🎥', href: '/dashboard/admin/live-classes' },
          { label: 'Students', icon: '🎓', href: '/dashboard/admin/students' },
          { label: 'Certificates', icon: '🏆', href: '/dashboard/admin/certificates' },
          { label: 'Testimonials', icon: '⭐', href: '/dashboard/admin/testimonials' },
          { label: 'Blogs', icon: '📰', href: '/dashboard/admin/blogs' },
          { label: 'Users', icon: '👥', href: '/dashboard/admin/users' },
          { label: 'Orders', icon: '🛒', href: '/dashboard/admin/orders' },
          { label: 'Bookings', icon: '📅', href: '/dashboard/admin/bookings' },
          { label: 'Settings', icon: '🔧', href: '/dashboard/admin/settings' },
          { label: '--- Messages ---', icon: '', href: '#', disabled: true },
          { label: 'Contact Messages', icon: '💬', href: '/dashboard/admin/contact-messages' },
        ]
      : []),
    ...(user?.role === 'client'
      ? [
          { label: 'Orders', icon: '🛒', href: '/dashboard/client/orders' },
          { label: 'Bookings', icon: '📅', href: '/dashboard/client/bookings' },
        ]
      : []),
    ...(user?.role === 'student'
      ? [
          { label: 'Courses', icon: '📚', href: '/dashboard/student/courses' },
          { label: 'Live Classes', icon: '🎥', href: '/dashboard/student/live-classes' },
        ]
      : []),
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      {/* Header */}
      <header className="bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              aria-label="Toggle sidebar"
            >
              ☰
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user?.name}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                {user?.role}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'w-64' : 'w-0'
          } bg-white dark:bg-dark-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 overflow-hidden`}
        >
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => (
              item.disabled ? (
                <div
                  key={item.href}
                  className="px-4 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  {item.label}
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Breadcrumbs */}
          {breadcrumbs.length > 0 && (
            <div className="mb-6 flex gap-2 text-sm text-gray-600 dark:text-gray-400">
              {breadcrumbs.map((crumb, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Link href={crumb.href} className="hover:text-primary-600">
                    {crumb.label}
                  </Link>
                  {index < breadcrumbs.length - 1 && <span>/</span>}
                </div>
              ))}
            </div>
          )}

          {children}
        </main>
      </div>
    </div>
  )
}
