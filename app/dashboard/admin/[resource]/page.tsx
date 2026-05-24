'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  CalendarDays,
  FolderKanban,
  GraduationCap,
  LayoutGrid,
  MessageSquare,
  Newspaper,
  Settings,
  ShoppingBag,
  Star,
  Users,
} from 'lucide-react'
import ProtectedRoute from '@/components/ProtectedRoute'
import DashboardLayout from '@/components/DashboardLayout'
import DashboardStatsCard from '@/components/DashboardStatsCard'
import LoadingSpinner from '@/components/LoadingSpinner'

const statResources = [
  { key: 'projects', label: 'Projects', path: '/dashboard/admin/projects', api: '/api/admin/projects', icon: FolderKanban, helper: 'Published portfolio works' },
  { key: 'services', label: 'Services', path: '/dashboard/admin/services', api: '/api/admin/services', icon: Briefcase, helper: 'Service packages listed' },
  { key: 'courses', label: 'Courses', path: '/dashboard/admin/courses', api: '/api/admin/courses', icon: BookOpen, helper: 'Courses in the LMS' },
  { key: 'students', label: 'Students', path: '/dashboard/admin/students', api: '/api/admin/students', icon: GraduationCap, helper: 'Registered learners' },
  { key: 'orders', label: 'Orders', path: '/dashboard/admin/orders', api: '/api/admin/orders', icon: ShoppingBag, helper: 'Project requests' },
  { key: 'bookings', label: 'Bookings', path: '/dashboard/admin/bookings', api: '/api/admin/bookings', icon: CalendarDays, helper: 'Consultation requests' },
  { key: 'blogs', label: 'Blogs', path: '/dashboard/admin/blogs', api: '/api/admin/blogs', icon: Newspaper, helper: 'Blog posts added' },
  { key: 'messages', label: 'Messages', path: '/dashboard/admin/contact-messages', api: '/api/admin/contact-messages', icon: MessageSquare, helper: 'Incoming contact messages' },
]

const quickActions = [
  { title: 'Manage Projects', description: 'Update portfolio case studies and featured work.', href: '/dashboard/admin/projects', icon: FolderKanban },
  { title: 'Manage Courses', description: 'Create or edit course content, lessons and classes.', href: '/dashboard/admin/courses', icon: BookOpen },
  { title: 'Review Orders', description: 'Track client orders, requirements and project flow.', href: '/dashboard/admin/orders', icon: ShoppingBag },
  { title: 'Open Settings', description: 'Configure website settings and platform preferences.', href: '/dashboard/admin/settings', icon: Settings },
]

const managementGroups = [
  {
    title: 'Content & Portfolio',
    description: 'Keep the public website fresh and polished with services, projects, and blogs.',
    items: [
      { label: 'Projects', href: '/dashboard/admin/projects', icon: FolderKanban },
      { label: 'Services', href: '/dashboard/admin/services', icon: Briefcase },
      { label: 'Skills', href: '/dashboard/admin/skills', icon: LayoutGrid },
      { label: 'Blogs', href: '/dashboard/admin/blogs', icon: Newspaper },
    ],
  },
  {
    title: 'Learning Platform',
    description: 'Manage the full student experience from courses to certificates.',
    items: [
      { label: 'Courses', href: '/dashboard/admin/courses', icon: BookOpen },
      { label: 'Lessons', href: '/dashboard/admin/lessons', icon: LayoutGrid },
      { label: 'Live Classes', href: '/dashboard/admin/live-classes', icon: CalendarDays },
      { label: 'Students', href: '/dashboard/admin/students', icon: GraduationCap },
      { label: 'Certificates', href: '/dashboard/admin/certificates', icon: Star },
    ],
  },
  {
    title: 'Operations',
    description: 'Handle clients, support, system setup, and daily admin activity from one place.',
    items: [
      { label: 'Orders', href: '/dashboard/admin/orders', icon: ShoppingBag },
      { label: 'Bookings', href: '/dashboard/admin/bookings', icon: CalendarDays },
      { label: 'Users', href: '/dashboard/admin/users', icon: Users },
      { label: 'Messages', href: '/dashboard/admin/contact-messages', icon: MessageSquare },
      { label: 'Settings', href: '/dashboard/admin/settings', icon: Settings },
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
        const responses = await Promise.allSettled(statResources.map((resource) => axios.get(resource.api)))

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

  const totalActivity = useMemo(() => (counts.orders || 0) + (counts.bookings || 0) + (counts.messages || 0), [counts])
  const contentTotal = useMemo(() => (counts.projects || 0) + (counts.services || 0) + (counts.blogs || 0), [counts])
  const learningTotal = useMemo(() => (counts.courses || 0) + (counts.students || 0), [counts])

  const barStats = useMemo(
    () => [
      { label: 'Content', value: contentTotal, color: 'bg-teal-500' },
      { label: 'Learning', value: learningTotal, color: 'bg-cyan-500' },
      { label: 'Activity', value: totalActivity, color: 'bg-slate-400' },
      { label: 'Orders', value: counts.orders || 0, color: 'bg-emerald-500' },
      { label: 'Messages', value: counts.messages || 0, color: 'bg-amber-500' },
    ],
    [contentTotal, learningTotal, totalActivity, counts.orders, counts.messages]
  )

  const maxBarValue = Math.max(...barStats.map((item) => item.value), 1)

  return (
    <ProtectedRoute requiredRoles={['admin']}>
      <DashboardLayout title="Admin Dashboard">
        <div className="space-y-8">
          <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-[linear-gradient(135deg,#0f172a_0%,#115e59_100%)] p-7 text-white sm:p-8 lg:p-10">
            <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr] xl:items-center">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.26em] text-white/70">Overview</p>
                <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">A cleaner and more user-friendly admin workspace.</h1>
                <p className="mt-4 max-w-3xl text-base leading-8 text-white/80">
                  Inspired by modern dashboard references, this updated admin page brings cleaner spacing, better hierarchy, softer cards, and clearer quick access to your key resources.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/dashboard/admin/projects" className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-bold text-slate-900 transition hover:bg-slate-100">
                    Manage Content
                  </Link>
                  <Link href="/dashboard/admin/settings" className="inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10">
                    Update Settings
                  </Link>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.5rem] bg-white/10 p-5 backdrop-blur">
                  <p className="text-sm font-semibold text-white/70">Business Activity</p>
                  <p className="mt-3 text-4xl font-black">{loading ? '...' : totalActivity}</p>
                  <p className="mt-2 text-sm text-white/70">orders + bookings + messages</p>
                </div>
                <div className="rounded-[1.5rem] bg-white/10 p-5 backdrop-blur">
                  <p className="text-sm font-semibold text-white/70">Learning Space</p>
                  <p className="mt-3 text-4xl font-black">{loading ? '...' : learningTotal}</p>
                  <p className="mt-2 text-sm text-white/70">courses + students</p>
                </div>
                <div className="rounded-[1.5rem] bg-white/10 p-5 backdrop-blur sm:col-span-2">
                  <p className="text-sm font-semibold text-white/70">Quick Actions</p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {quickActions.slice(0, 4).map(({ title, href }) => (
                      <Link key={href} href={href} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/15">
                        {title}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {loading ? (
              <div className="col-span-full rounded-[1.75rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
                <LoadingSpinner />
                <p className="mt-4 text-sm text-slate-500">Loading admin stats...</p>
              </div>
            ) : (
              statResources.map((resource) => (
                <Link key={resource.key} href={resource.path}>
                  <DashboardStatsCard
                    title={resource.label}
                    value={counts[resource.key] || 0}
                    icon={resource.icon}
                    helperText={resource.helper}
                    trend="updated"
                  />
                </Link>
              ))
            )}
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Analytics Snapshot</p>
                  <h2 className="mt-1 text-2xl font-black text-slate-950">Platform distribution</h2>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-600">Live overview</div>
              </div>
              <div className="grid items-end gap-4 sm:grid-cols-5">
                {barStats.map((item) => (
                  <div key={item.label} className="flex flex-col items-center gap-3">
                    <div className="flex h-56 w-full items-end rounded-[1.5rem] bg-slate-50 p-3">
                      <div className={`w-full rounded-[1rem] ${item.color}`} style={{ height: `${Math.max((item.value / maxBarValue) * 100, 14)}%` }} />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-slate-900">{item.value}</p>
                      <p className="text-xs font-medium text-slate-500">{item.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <div className="mb-6">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Quick Access</p>
                <h2 className="mt-1 text-2xl font-black text-slate-950">Popular admin tasks</h2>
              </div>
              <div className="space-y-3">
                {quickActions.map(({ title, description, href, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center justify-between gap-4 rounded-[1.25rem] border border-slate-200 p-4 transition hover:border-teal-200 hover:bg-teal-50/50"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-teal-700">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-black text-slate-900">{title}</p>
                        <p className="mt-1 text-sm text-slate-600">{description}</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" />
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-3">
            {managementGroups.map((group) => (
              <div key={group.title} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-black text-slate-950">{group.title}</h2>
                <p className="mt-2 text-sm leading-7 text-slate-600">{group.description}</p>
                <div className="mt-6 grid gap-3">
                  {group.items.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center justify-between rounded-[1.25rem] border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
                      >
                        <span className="flex items-center gap-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
                            <Icon className="h-4 w-4" />
                          </span>
                          {item.label}
                        </span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </section>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
