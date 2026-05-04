'use client'

import Link from 'next/link'
import { UserRole } from '@/types/auth'

interface SidebarItem {
  label: string
  href: string
  icon?: string
  disabled?: boolean
}

const adminItems: SidebarItem[] = [
  { label: 'Dashboard', href: '/dashboard/admin', icon: '📊' },
  { label: 'Profile', href: '/dashboard/admin/profile', icon: '👤' },
  { label: 'Projects', href: '/dashboard/admin/projects', icon: '🚀' },
  { label: 'Services', href: '/dashboard/admin/services', icon: '⚙️' },
  { label: 'Skills', href: '/dashboard/admin/skills', icon: '🧠' },
  { label: 'Courses', href: '/dashboard/admin/courses', icon: '📚' },
  { label: 'Lessons', href: '/dashboard/admin/lessons', icon: '📝' },
  { label: 'Live Classes', href: '/dashboard/admin/live-classes', icon: '🎥' },
  { label: 'Students', href: '/dashboard/admin/students', icon: '🎓' },
  { label: 'Certificates', href: '/dashboard/admin/certificates', icon: '🏆' },
  { label: 'Users', href: '/dashboard/admin/users', icon: '👥' },
  { label: 'Orders', href: '/dashboard/admin/orders', icon: '🛒' },
  { label: 'Bookings', href: '/dashboard/admin/bookings', icon: '📅' },
  { label: 'Blogs', href: '/dashboard/admin/blogs', icon: '📰' },
  { label: 'Testimonials', href: '/dashboard/admin/testimonials', icon: '⭐' },
  { label: 'Messages', href: '/dashboard/admin/contact-messages', icon: '💬' },
  { label: 'Settings', href: '/dashboard/admin/settings', icon: '⚙️' },
]

const roleItems: Record<UserRole, SidebarItem[]> = {
  admin: adminItems,
  client: [
    { label: 'Dashboard', href: '/dashboard/client', icon: '📊' },
    { label: 'Profile', href: '/dashboard/client/profile', icon: '👤' },
    { label: 'Orders', href: '/dashboard/client/orders', icon: '🛒' },
    { label: 'Bookings', href: '/dashboard/client/bookings', icon: '📅' },
  ],
  student: [
    { label: 'Dashboard', href: '/dashboard/student', icon: '📊' },
    { label: 'Profile', href: '/dashboard/student/profile', icon: '👤' },
    { label: 'Courses', href: '/dashboard/student/courses', icon: '📚' },
    { label: 'Live Classes', href: '/dashboard/student/live-classes', icon: '🎥' },
  ],
}

export default function DashboardSidebar({ role = 'student' }: { role?: UserRole }) {
  const items = roleItems[role] || roleItems.student

  return (
    <nav className="space-y-2 p-4">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <span className="text-lg">{item.icon}</span>
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  )
}
