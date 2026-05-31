'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import {
  ArrowRight,
  Award,
  BookOpen,
  Briefcase,
  CalendarDays,
  ClipboardList,
  FileText,
  FolderKanban,
  GraduationCap,
  MessageSquare,
  ScrollText,
  Settings,
  ShoppingBag,
  Star,
  Users,
  Wrench,
} from 'lucide-react'
import ProtectedRoute from '@/components/ProtectedRoute'
import DashboardLayout from '@/components/DashboardLayout'
import DashboardStatsCard from '@/components/DashboardStatsCard'
import LoadingSpinner from '@/components/LoadingSpinner'
import StatusBadge from '@/components/StatusBadge'

// ─── Stats config ─────────────────────────────────────────────────────────────
const statResources = [
  { key: 'projects',    label: 'Projects',     path: '/dashboard/admin/projects',     api: '/api/admin/projects',         icon: FolderKanban, helper: 'Portfolio works' },
  { key: 'services',    label: 'Services',     path: '/dashboard/admin/services',     api: '/api/admin/services',         icon: Briefcase,    helper: 'Service packages' },
  { key: 'skills',      label: 'Skills',       path: '/dashboard/admin/skills',       api: '/api/admin/skills',           icon: Wrench,       helper: 'Skill entries' },
  { key: 'courses',     label: 'Courses',      path: '/dashboard/admin/courses',      api: '/api/admin/courses',          icon: BookOpen,     helper: 'LMS courses' },
  { key: 'lessons',     label: 'Lessons',      path: '/dashboard/admin/lessons',      api: '/api/admin/lessons',          icon: ScrollText,   helper: 'Course lessons' },
  { key: 'liveclasses', label: 'Live Classes', path: '/dashboard/admin/live-classes', api: '/api/admin/live-classes',     icon: CalendarDays, helper: 'Scheduled sessions' },
  { key: 'students',    label: 'Students',     path: '/dashboard/admin/students',     api: '/api/admin/students',         icon: GraduationCap, helper: 'Enrolled learners' },
  { key: 'blogs',       label: 'Blogs',        path: '/dashboard/admin/blogs',        api: '/api/admin/blogs',            icon: FileText,     helper: 'Blog posts' },
  { key: 'testimonials',label: 'Testimonials', path: '/dashboard/admin/testimonials', api: '/api/admin/testimonials',     icon: Star,         helper: 'Client reviews' },
  { key: 'users',       label: 'Users',        path: '/dashboard/admin/users',        api: '/api/admin/users',            icon: Users,        helper: 'Registered accounts' },
  { key: 'orders',      label: 'Orders',       path: '/dashboard/admin/orders',       api: '/api/admin/orders',           icon: ShoppingBag,  helper: 'Project enquiries' },
  { key: 'bookings',    label: 'Bookings',     path: '/dashboard/admin/bookings',     api: '/api/admin/bookings',         icon: CalendarDays, helper: 'Consultations' },
  { key: 'messages',    label: 'Messages',     path: '/dashboard/admin/contact-messages', api: '/api/admin/contact-messages', icon: MessageSquare, helper: 'Unread enquiries' },
  { key: 'certificates',label: 'Certificates', path: '/dashboard/admin/certificates', api: '/api/admin/certificates',     icon: Award,        helper: 'Issued certs' },
  { key: 'enrollments', label: 'Enrollments',  path: '/dashboard/admin/enrollments',  api: '/api/admin/enrollments',      icon: ClipboardList, helper: 'Active enrollments' },
]

// ─── Quick action cards ───────────────────────────────────────────────────────
const quickActions = [
  { title: 'Manage Projects',  description: 'Add, edit or publish portfolio projects.',  href: '/dashboard/admin/projects',  icon: FolderKanban },
  { title: 'Manage Courses',   description: 'Create course content, lessons and classes.', href: '/dashboard/admin/courses',   icon: BookOpen },
  { title: 'Review Orders',    description: 'Update status, add notes, track progress.',  href: '/dashboard/admin/orders',    icon: ShoppingBag },
  { title: 'Open Settings',    description: 'Configure website, SEO and contact info.',   href: '/dashboard/admin/settings',  icon: Settings },
]

// ─── Management groups ────────────────────────────────────────────────────────
const managementGroups = [
  {
    title: 'Content & Portfolio',
    description: 'Keep the public website fresh with projects, services, skills, blogs and testimonials.',
    items: [
      { label: 'Projects',     href: '/dashboard/admin/projects',     icon: FolderKanban },
      { label: 'Services',     href: '/dashboard/admin/services',     icon: Briefcase },
      { label: 'Skills',       href: '/dashboard/admin/skills',       icon: Wrench },
      { label: 'Blogs',        href: '/dashboard/admin/blogs',        icon: FileText },
      { label: 'Testimonials', href: '/dashboard/admin/testimonials', icon: Star },
    ],
  },
  {
    title: 'Learning Platform',
    description: 'Manage the full student experience from courses to certificates.',
    items: [
      { label: 'Courses',      href: '/dashboard/admin/courses',      icon: BookOpen },
      { label: 'Lessons',      href: '/dashboard/admin/lessons',      icon: ScrollText },
      { label: 'Live Classes', href: '/dashboard/admin/live-classes', icon: CalendarDays },
      { label: 'Students',     href: '/dashboard/admin/students',     icon: GraduationCap },
      { label: 'Enrollments',  href: '/dashboard/admin/enrollments',  icon: ClipboardList },
      { label: 'Certificates', href: '/dashboard/admin/certificates', icon: Award },
    ],
  },
  {
    title: 'Operations & System',
    description: 'Handle client requests, support, users and website configuration.',
    items: [
      { label: 'Orders',   href: '/dashboard/admin/orders',           icon: ShoppingBag },
      { label: 'Bookings', href: '/dashboard/admin/bookings',         icon: CalendarDays },
      { label: 'Messages', href: '/dashboard/admin/contact-messages', icon: MessageSquare },
      { label: 'Users',    href: '/dashboard/admin/users',            icon: Users },
      { label: 'Settings', href: '/dashboard/admin/settings',         icon: Settings },
    ],
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
function shortDate(value: string | undefined) {
  if (!value) return '—'
  try {
    return new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch { return '—' }
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [recentBookings, setRecentBookings] = useState<any[]>([])
  const [recentMessages, setRecentMessages] = useState<any[]>([])
  const [activityLoading, setActivityLoading] = useState(true)

  // Load stat counts
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const responses = await Promise.allSettled(
          statResources.map((r) => axios.get(r.api))
        )
        const next: Record<string, number> = {}
        responses.forEach((res, i) => {
          const key = statResources[i].key
          if (res.status === 'fulfilled') {
            const d = res.value.data?.data
            next[key] = Array.isArray(d) ? d.length : 0
          } else {
            next[key] = 0
          }
        })
        setCounts(next)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Load recent activity (latest 4 of each)
  useEffect(() => {
    const loadActivity = async () => {
      try {
        setActivityLoading(true)
        const [ordRes, bokRes, msgRes] = await Promise.allSettled([
          axios.get('/api/admin/orders'),
          axios.get('/api/admin/bookings'),
          axios.get('/api/admin/contact-messages'),
        ])
        if (ordRes.status === 'fulfilled') {
          setRecentOrders((ordRes.value.data?.data ?? []).slice(0, 4))
        }
        if (bokRes.status === 'fulfilled') {
          setRecentBookings((bokRes.value.data?.data ?? []).slice(0, 4))
        }
        if (msgRes.status === 'fulfilled') {
          setRecentMessages((msgRes.value.data?.data ?? []).slice(0, 4))
        }
      } finally {
        setActivityLoading(false)
      }
    }
    loadActivity()
  }, [])

  const totalActivity = useMemo(
    () => (counts.orders ?? 0) + (counts.bookings ?? 0) + (counts.messages ?? 0),
    [counts]
  )
  const learningTotal = useMemo(
    () => (counts.courses ?? 0) + (counts.students ?? 0) + (counts.lessons ?? 0),
    [counts]
  )
  const contentTotal = useMemo(
    () => (counts.projects ?? 0) + (counts.services ?? 0) + (counts.blogs ?? 0),
    [counts]
  )

  // Primary stats shown prominently (8 cards)
  const primaryStats = statResources.slice(0, 8)

  return (
    <ProtectedRoute requiredRoles={['admin']}>
      <DashboardLayout title="Admin Dashboard">
        <div className="space-y-8">

          {/* ── Hero banner ── */}
          <section className="overflow-hidden rounded-[2rem] border border-slate-800 bg-[linear-gradient(135deg,#0f172a_0%,#115e59_100%)] p-7 text-white sm:p-8">
            <div className="grid gap-6 xl:grid-cols-[1fr_auto] xl:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/60">
                  Overview — Admin Control Center
                </p>
                <h1 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">
                  Manage your complete portfolio &amp; LMS platform
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/75">
                  Content, courses, students, orders, bookings, messages and settings — all in one place.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href="/dashboard/admin/projects"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-slate-900 transition hover:bg-slate-100"
                  >
                    Manage Content <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/dashboard/admin/settings"
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-white/10"
                  >
                    Update Settings
                  </Link>
                </div>
              </div>

              {/* Summary mini-cards */}
              <div className="grid grid-cols-3 gap-3 xl:grid-cols-1 xl:min-w-[180px]">
                {[
                  { label: 'Business Activity', value: loading ? '…' : totalActivity, note: 'orders + bookings + messages' },
                  { label: 'Learning Space',    value: loading ? '…' : learningTotal, note: 'courses + students + lessons' },
                  { label: 'Content Items',     value: loading ? '…' : contentTotal,  note: 'projects + services + blogs' },
                ].map((s) => (
                  <div key={s.label} className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                    <p className="text-xs font-semibold text-white/60">{s.label}</p>
                    <p className="mt-2 text-3xl font-black">{s.value}</p>
                    <p className="mt-1 text-[11px] text-white/50">{s.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Stat cards — 4-col grid ── */}
          <section>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
              Platform Stats
            </p>
            {loading ? (
              <div className="rounded-[1.75rem] border border-slate-200 bg-white p-12 text-center shadow-sm">
                <LoadingSpinner />
                <p className="mt-4 text-sm text-slate-500">Loading stats…</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
                {primaryStats.map((r) => (
                  <Link key={r.key} href={r.path}>
                    <DashboardStatsCard
                      title={r.label}
                      value={counts[r.key] ?? 0}
                      icon={r.icon}
                      helperText={r.helper}
                      trend="updated"
                    />
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* ── Quick actions + secondary stats ── */}
          <section className="grid gap-6 xl:grid-cols-[1fr_auto]">
            {/* Quick actions */}
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Quick Access</p>
              <h2 className="mb-5 text-xl font-black text-slate-950">Popular admin tasks</h2>
              <div className="space-y-3">
                {quickActions.map(({ title, description, href, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center justify-between gap-4 rounded-[1.25rem] border border-slate-200 p-4 transition hover:border-teal-200 hover:bg-teal-50/50"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-slate-50 text-teal-700">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-black text-slate-900">{title}</p>
                        <p className="mt-0.5 text-sm text-slate-500">{description}</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 flex-shrink-0 text-slate-400" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Secondary stats (remaining) */}
            <div className="grid grid-cols-2 gap-4 content-start xl:w-[320px]">
              {statResources.slice(8).map((r) => (
                <Link key={r.key} href={r.path}>
                  <DashboardStatsCard
                    title={r.label}
                    value={counts[r.key] ?? 0}
                    icon={r.icon}
                    helperText={r.helper}
                  />
                </Link>
              ))}
            </div>
          </section>

          {/* ── Recent activity ── */}
          <section className="grid gap-6 xl:grid-cols-3">
            {/* Recent orders */}
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Recent</p>
                  <h2 className="text-lg font-black text-slate-950">Project Orders</h2>
                </div>
                <Link href="/dashboard/admin/orders" className="text-xs font-bold text-teal-600 hover:underline">
                  View all →
                </Link>
              </div>
              {activityLoading ? (
                <div className="py-6 text-center"><LoadingSpinner /></div>
              ) : recentOrders.length === 0 ? (
                <p className="py-6 text-center text-sm text-slate-400">No orders yet</p>
              ) : (
                <div className="space-y-3">
                  {recentOrders.map((order) => (
                    <div key={order._id} className="flex items-start justify-between gap-3 rounded-2xl border border-slate-100 p-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-900">
                          {order.projectType ?? order.title ?? 'Order'}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-slate-500">
                          {order.clientName ?? order.clientEmail ?? '—'} · {shortDate(order.createdAt)}
                        </p>
                      </div>
                      <StatusBadge status={order.status} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent bookings */}
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Recent</p>
                  <h2 className="text-lg font-black text-slate-950">Bookings</h2>
                </div>
                <Link href="/dashboard/admin/bookings" className="text-xs font-bold text-teal-600 hover:underline">
                  View all →
                </Link>
              </div>
              {activityLoading ? (
                <div className="py-6 text-center"><LoadingSpinner /></div>
              ) : recentBookings.length === 0 ? (
                <p className="py-6 text-center text-sm text-slate-400">No bookings yet</p>
              ) : (
                <div className="space-y-3">
                  {recentBookings.map((b) => (
                    <div key={b._id} className="flex items-start justify-between gap-3 rounded-2xl border border-slate-100 p-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-900">{b.topic ?? 'Booking'}</p>
                        <p className="mt-0.5 truncate text-xs text-slate-500">
                          {b.name ?? b.email ?? '—'} · {shortDate(b.scheduledAt ?? b.createdAt)}
                        </p>
                      </div>
                      <StatusBadge status={b.status} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent messages */}
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Recent</p>
                  <h2 className="text-lg font-black text-slate-950">Messages</h2>
                </div>
                <Link href="/dashboard/admin/contact-messages" className="text-xs font-bold text-teal-600 hover:underline">
                  View all →
                </Link>
              </div>
              {activityLoading ? (
                <div className="py-6 text-center"><LoadingSpinner /></div>
              ) : recentMessages.length === 0 ? (
                <p className="py-6 text-center text-sm text-slate-400">No messages yet</p>
              ) : (
                <div className="space-y-3">
                  {recentMessages.map((m) => (
                    <div key={m._id} className="flex items-start justify-between gap-3 rounded-2xl border border-slate-100 p-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-900">{m.subject ?? 'Message'}</p>
                        <p className="mt-0.5 truncate text-xs text-slate-500">
                          {m.name ?? '—'} · {shortDate(m.createdAt)}
                        </p>
                      </div>
                      <StatusBadge status={m.status ?? 'new'} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* ── Management groups ── */}
          <section className="grid gap-6 xl:grid-cols-3">
            {managementGroups.map((group) => (
              <div
                key={group.title}
                className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h2 className="text-lg font-black text-slate-950">{group.title}</h2>
                <p className="mt-1.5 text-sm leading-6 text-slate-500">{group.description}</p>
                <div className="mt-5 grid gap-2.5">
                  {group.items.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center justify-between rounded-[1.25rem] border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
                      >
                        <span className="flex items-center gap-3">
                          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
                            <Icon className="h-4 w-4" />
                          </span>
                          {item.label}
                        </span>
                        <ArrowRight className="h-4 w-4 text-slate-400" />
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
