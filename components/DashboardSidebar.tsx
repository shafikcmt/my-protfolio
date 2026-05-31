'use client'

import Link from 'next/link'
import type { ComponentType } from 'react'
import { usePathname } from 'next/navigation'
import {
  Award,
  BookOpen,
  Briefcase,
  CalendarDays,
  ClipboardList,
  FileText,
  FolderKanban,
  GraduationCap,
  Home,
  LayoutDashboard,
  MessageSquare,
  ScrollText,
  Settings,
  ShoppingBag,
  Star,
  UserCircle,
  Users,
  Wrench,
} from 'lucide-react'

type UserRole = 'admin' | 'client' | 'student'

type SidebarItem = {
  label: string
  href: string
  icon: ComponentType<{ className?: string }>
}

type SidebarSection = {
  title: string
  items: SidebarItem[]
}

const roleSections: Record<UserRole, SidebarSection[]> = {
  admin: [
    {
      title: 'Overview',
      items: [
        { label: 'Dashboard', href: '/dashboard/admin', icon: LayoutDashboard },
        { label: 'Profile',   href: '/dashboard/profile', icon: UserCircle },
      ],
    },
    {
      title: 'Content',
      items: [
        { label: 'Projects',     href: '/dashboard/admin/projects',     icon: FolderKanban },
        { label: 'Services',     href: '/dashboard/admin/services',     icon: Briefcase },
        { label: 'Skills',       href: '/dashboard/admin/skills',       icon: Wrench },
        { label: 'Blogs',        href: '/dashboard/admin/blogs',        icon: FileText },
        { label: 'Testimonials', href: '/dashboard/admin/testimonials', icon: Star },
      ],
    },
    {
      title: 'Learning',
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
      title: 'Business',
      items: [
        { label: 'Orders',   href: '/dashboard/admin/orders',          icon: ShoppingBag },
        { label: 'Bookings', href: '/dashboard/admin/bookings',        icon: CalendarDays },
        { label: 'Messages', href: '/dashboard/admin/contact-messages', icon: MessageSquare },
      ],
    },
    {
      title: 'System',
      items: [
        { label: 'Users',    href: '/dashboard/admin/users',    icon: Users },
        { label: 'Settings', href: '/dashboard/admin/settings', icon: Settings },
      ],
    },
  ],
  client: [
    {
      title: 'Workspace',
      items: [
        { label: 'Dashboard', href: '/dashboard/client',          icon: Home },
        { label: 'Profile',   href: '/dashboard/profile',         icon: UserCircle },
        { label: 'Orders',    href: '/dashboard/client/orders',   icon: ShoppingBag },
        { label: 'Bookings',  href: '/dashboard/client/bookings', icon: CalendarDays },
      ],
    },
  ],
  student: [
    {
      title: 'Learning',
      items: [
        { label: 'Dashboard',    href: '/dashboard/student',                icon: Home },
        { label: 'Profile',      href: '/dashboard/profile',                icon: UserCircle },
        { label: 'Courses',      href: '/dashboard/student/courses',        icon: BookOpen },
        { label: 'Live Classes', href: '/dashboard/student/live-classes',   icon: CalendarDays },
      ],
    },
  ],
}

export default function DashboardSidebar({ role = 'student' }: { role?: UserRole }) {
  const pathname = usePathname()
  const sections = roleSections[role] ?? roleSections.student

  return (
    <div className="flex h-full flex-col rounded-[2rem] border border-slate-200 bg-white p-4 shadow-[0_10px_40px_rgba(15,23,42,0.06)]">
      {/* Logo / brand */}
      <div className="mb-6 flex items-center gap-3 px-3 pt-2">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-600 to-cyan-500 font-black text-white">
          SI
        </div>
        <div>
          <p className="text-base font-black text-slate-900">Workspace</p>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Dashboard panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-5 overflow-y-auto pr-1">
        {sections.map((section) => (
          <div key={section.title}>
            <p className="px-3 text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
              {section.title}
            </p>
            <div className="mt-2 space-y-1">
              {section.items.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== '/dashboard/admin' &&
                    item.href !== '/dashboard/client' &&
                    item.href !== '/dashboard/student' &&
                    pathname.startsWith(`${item.href}/`))
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition ${
                      active
                        ? 'bg-teal-600 text-white shadow-[0_8px_20px_rgba(13,148,136,0.25)]'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl ${
                        active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom card */}
      <div className="mt-5 rounded-[1.5rem] bg-gradient-to-br from-teal-600 to-cyan-500 p-4 text-white">
        <p className="text-sm font-bold">All resources in one place</p>
        <p className="mt-1.5 text-xs leading-5 text-white/80">
          Portfolio, orders, learning, and settings — managed from a single dashboard.
        </p>
      </div>
    </div>
  )
}
