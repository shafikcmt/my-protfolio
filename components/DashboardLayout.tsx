'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Bell, ChevronRight, LogOut, Menu, PanelLeftClose, Search } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import DashboardSidebar from '@/components/DashboardSidebar'

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

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen((prev) => !prev)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <PanelLeftClose className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Dashboard</p>
              <h1 className="text-2xl font-black tracking-tight text-slate-950">{title}</h1>
            </div>
          </div>

          <div className="hidden flex-1 max-w-xl xl:block">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search anything here..."
                className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="hidden h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm sm:inline-flex">
              <Bell className="h-4 w-4" />
            </button>
            <div className="hidden text-right sm:block">
              <p className="text-sm font-bold text-slate-900">{user?.name || 'Dashboard User'}</p>
              <p className="text-xs capitalize text-slate-500">{user?.role || 'member'}</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-600 to-cyan-500 text-sm font-black text-white shadow-[0_10px_25px_rgba(13,148,136,0.28)]">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-100"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1600px] gap-6 px-4 py-6 sm:px-6 lg:px-8">
        {sidebarOpen && (
          <aside className="hidden w-[290px] shrink-0 xl:block">
            <DashboardSidebar role={(user?.role as 'admin' | 'client' | 'student') || 'student'} />
          </aside>
        )}

        <main className="min-w-0 flex-1">
          {breadcrumbs.length > 0 && (
            <div className="mb-5 flex flex-wrap items-center gap-2 text-sm text-slate-500">
              {breadcrumbs.map((crumb, index) => (
                <div key={`${crumb.href}-${index}`} className="flex items-center gap-2">
                  <Link href={crumb.href} className="font-medium transition hover:text-teal-600">
                    {crumb.label}
                  </Link>
                  {index < breadcrumbs.length - 1 && <ChevronRight className="h-4 w-4" />}
                </div>
              ))}
            </div>
          )}

          <div className="rounded-[2rem] border border-slate-200 bg-white/70 p-4 shadow-[0_10px_40px_rgba(15,23,42,0.05)] backdrop-blur-sm sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
