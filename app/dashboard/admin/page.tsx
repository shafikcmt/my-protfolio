'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import ProtectedRoute from '@/components/ProtectedRoute'
import DashboardLayout from '@/components/DashboardLayout'
import DashboardStatsCard from '@/components/DashboardStatsCard'
import LoadingSpinner from '@/components/LoadingSpinner'

const statResources = [
  { key: 'projects', label: 'Projects', icon: '🚀', path: '/dashboard/admin/projects', api: '/api/admin/projects' },
  { key: 'services', label: 'Services', icon: '⚙️', path: '/dashboard/admin/services', api: '/api/admin/services' },
  { key: 'courses', label: 'Courses', icon: '📚', path: '/dashboard/admin/courses', api: '/api/admin/courses' },
  { key: 'students', label: 'Students', icon: '🎓', path: '/dashboard/admin/students', api: '/api/admin/students' },
  { key: 'orders', label: 'Orders', icon: '🛒', path: '/dashboard/admin/orders', api: '/api/admin/orders' },
  { key: 'bookings', label: 'Bookings', icon: '📅', path: '/dashboard/admin/bookings', api: '/api/admin/bookings' },
  { key: 'blogs', label: 'Blogs', icon: '📰', path: '/dashboard/admin/blogs', api: '/api/admin/blogs' },
  { key: 'messages', label: 'Messages', icon: '💬', path: '/dashboard/admin/contact-messages', api: '/api/admin/contact-messages' },
]

const managementGroups = [
  {
    title: 'Content Management',
    description: 'Update the public portfolio, services, course catalog and learning content.',
    links: [
      { label: 'Projects', href: '/dashboard/admin/projects', icon: '🚀' },
      { label: 'Services', href: '/dashboard/admin/services', icon: '⚙️' },
      { label: 'Skills', href: '/dashboard/admin/skills', icon: '🧠' },
      { label: 'Courses', href: '/dashboard/admin/courses', icon: '📚' },
      { label: 'Lessons', href: '/dashboard/admin/lessons', icon: '📝' },
      { label: 'Live Classes', href: '/dashboard/admin/live-classes', icon: '🎥' },
    ],
  },
  {
    title: 'Users & Learning',
    description: 'Manage users, students, testimonials and course certificates.',
    links: [
      { label: 'Students', href: '/dashboard/admin/students', icon: '🎓' },
      { label: 'Users', href: '/dashboard/admin/users', icon: '👥' },
      { label: 'Certificates', href: '/dashboard/admin/certificates', icon: '🏆' },
      { label: 'Testimonials', href: '/dashboard/admin/testimonials', icon: '⭐' },
    ],
  },
  {
    title: 'Business Operations',
    description: 'Review client requests, project orders, consultation bookings and website settings.',
    links: [
      { label: 'Orders', href: '/dashboard/admin/orders', icon: '🛒' },
      { label: 'Bookings', href: '/dashboard/admin/bookings', icon: '📅' },
      { label: 'Contact Messages', href: '/dashboard/admin/contact-messages', icon: '💬' },
      { label: 'Settings', href: '/dashboard/admin/settings', icon: '🔧' },
    ],
  },
]

export default function AdminDashboardPage() {
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true)
        const responses = await Promise.allSettled(
          statResources.map((resource) => axios.get(resource.api))
        )

        const nextCounts: Record<string, number> = {}
        responses.forEach((response, index) => {
          const key = statResources[index].key
          if (response.status === 'fulfilled') {
            const data = response.value.data?.data
            nextCounts[key] = Array.isArray(data) ? data.length : 0
          } else {
            nextCounts[key] = 0
          }
        })
        setCounts(nextCounts)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  const totalActivity = useMemo(() => {
    return (counts.orders || 0) + (counts.bookings || 0) + (counts.messages || 0)
  }, [counts])

  return (
    <ProtectedRoute requiredRoles={['admin']}>
      <DashboardLayout title="Admin Dashboard">
        <div className="space-y-8">
          <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-primary-600 to-blue-700 p-8 text-white shadow-lg">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.25em] text-white/70">Admin Control Center</p>
                <h1 className="mt-3 text-3xl font-black md:text-4xl">Manage your complete portfolio LMS platform</h1>
                <p className="mt-3 max-w-3xl text-white/80">
                  All admin routes are now connected from one dashboard: content, courses, users, orders, bookings, messages and settings.
                </p>
              </div>
              <div className="rounded-3xl bg-white/10 p-6 text-center backdrop-blur">
                <p className="text-sm font-semibold text-white/70">Business Activity</p>
                <p className="mt-2 text-4xl font-black">{loading ? '...' : totalActivity}</p>
                <p className="mt-1 text-xs text-white/70">orders + bookings + messages</p>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {loading ? (
              <div className="col-span-full rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-sm dark:border-gray-700 dark:bg-dark-800">
                <LoadingSpinner />
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">Loading admin stats...</p>
              </div>
            ) : (
              statResources.map((resource) => (
                <Link key={resource.key} href={resource.path}>
                  <DashboardStatsCard title={resource.label} value={counts[resource.key] || 0} icon={resource.icon} />
                </Link>
              ))
            )}
          </section>

          <section className="grid gap-6 xl:grid-cols-3">
            {managementGroups.map((group) => (
              <div key={group.title} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-dark-800">
                <h2 className="text-xl font-black text-gray-900 dark:text-white">{group.title}</h2>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{group.description}</p>
                <div className="mt-6 grid gap-3">
                  {group.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center justify-between rounded-2xl border border-gray-100 px-4 py-3 text-sm font-bold text-gray-700 transition hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700 dark:border-gray-700 dark:text-gray-200 dark:hover:border-primary-900 dark:hover:bg-primary-950/30 dark:hover:text-primary-300"
                    >
                      <span className="flex items-center gap-3"><span className="text-lg">{link.icon}</span>{link.label}</span>
                      <span>→</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </section>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
