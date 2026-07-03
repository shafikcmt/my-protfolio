'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { ArrowRight, CalendarDays, CheckCircle2, ShoppingBag } from 'lucide-react'
import ProtectedRoute from '@/components/ProtectedRoute'
import DashboardLayout from '@/components/DashboardLayout'
import DashboardStatsCard from '@/components/DashboardStatsCard'
import StatusBadge from '@/components/StatusBadge'
import { useAuth } from '@/contexts/AuthContext'
import { IConsultationBooking, IProjectOrder } from '@/types/models'

export default function ClientDashboard() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<IProjectOrder[]>([])
  const [bookings, setBookings] = useState<IConsultationBooking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSummary()
  }, [])

  const fetchSummary = async () => {
    try {
      setLoading(true)
      const [ordersRes, bookingsRes] = await Promise.all([
        axios.get('/api/client/orders'),
        axios.get('/api/client/bookings'),
      ])
      setOrders(ordersRes.data.data || [])
      setBookings(bookingsRes.data.data || [])
    } catch (error) {
      console.error('Failed to fetch client summary:', error)
    } finally {
      setLoading(false)
    }
  }

  const stats = useMemo(() => {
    const activeOrders = orders.filter(
      (order) => !['completed', 'cancelled'].includes(order.status || 'pending')
    ).length
    const completedOrders = orders.filter((order) => order.status === 'completed').length
    const upcomingBookings = bookings.filter(
      (booking) => !['completed', 'cancelled', 'rejected'].includes(booking.status || 'pending')
    ).length
    return { activeOrders, completedOrders, upcomingBookings }
  }, [orders, bookings])

  const latestOrders   = orders.slice(0, 3)
  const latestBookings = bookings.slice(0, 3)

  return (
    <ProtectedRoute requiredRoles={['client']}>
      <DashboardLayout title="Client Dashboard">

        {/* Welcome banner */}
        <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-teal-600">
                Client workspace
              </p>
              <h2 className="mt-2 text-3xl font-black text-slate-900">
                Welcome back, {user?.name || 'Client'}
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-500">
                Track project orders, consultation bookings, meeting links, proposals and delivery
                status from one dashboard.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/dashboard/client/orders" className="btn-primary">
                New Project Order
              </Link>
              <Link
                href="/dashboard/client/bookings"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-teal-200 hover:text-teal-700"
              >
                Book Consultation <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <DashboardStatsCard title="Active Orders"      value={loading ? '...' : stats.activeOrders}      icon={ShoppingBag}   helperText="Projects currently open" />
          <DashboardStatsCard title="Upcoming Bookings"  value={loading ? '...' : stats.upcomingBookings}   icon={CalendarDays}  helperText="Scheduled or pending sessions" />
          <DashboardStatsCard title="Completed Orders"   value={loading ? '...' : stats.completedOrders}    icon={CheckCircle2}  helperText="Finished project deliveries" />
        </div>

        {/* Latest orders + bookings */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

          {/* Orders */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-black text-slate-900">Latest Orders</h3>
                <p className="text-sm text-slate-500">Recent project request status.</p>
              </div>
              <Link href="/dashboard/client/orders" className="text-sm font-bold text-teal-600 hover:text-teal-500">
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {latestOrders.length === 0 ? (
                <p className="rounded-2xl bg-slate-50 p-5 text-sm text-slate-500">
                  No project orders yet.
                </p>
              ) : (
                latestOrders.map((order) => (
                  <div key={order._id} className="rounded-2xl border border-slate-200 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-400">
                          {(order as any).orderNumber || 'Project order'}
                        </p>
                        <h4 className="mt-1 font-bold text-slate-900">
                          {order.projectType || (order as any).title}
                        </h4>
                        <p className="mt-1 text-sm text-slate-500">
                          {order.budgetRange || 'Budget to be discussed'}
                        </p>
                      </div>
                      <StatusBadge status={order.status} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Bookings */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-black text-slate-900">Consultations</h3>
                <p className="text-sm text-slate-500">Meeting requests and approved calls.</p>
              </div>
              <Link href="/dashboard/client/bookings" className="text-sm font-bold text-teal-600 hover:text-teal-500">
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {latestBookings.length === 0 ? (
                <p className="rounded-2xl bg-slate-50 p-5 text-sm text-slate-500">
                  No consultation bookings yet.
                </p>
              ) : (
                latestBookings.map((booking) => (
                  <div key={booking._id} className="rounded-2xl border border-slate-200 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900">{booking.topic}</h4>
                        <p className="mt-1 text-sm text-slate-500">
                          {booking.scheduledAt
                            ? new Date(booking.scheduledAt).toLocaleString()
                            : 'Schedule pending'}
                        </p>
                      </div>
                      <StatusBadge status={booking.status} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

      </DashboardLayout>
    </ProtectedRoute>
  )
}
