'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
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
    const activeOrders = orders.filter((order) => !['completed', 'cancelled'].includes(order.status || 'pending')).length
    const completedOrders = orders.filter((order) => order.status === 'completed').length
    const upcomingBookings = bookings.filter((booking) => !['completed', 'cancelled', 'rejected'].includes(booking.status || 'pending')).length
    return { activeOrders, completedOrders, upcomingBookings }
  }, [orders, bookings])

  const latestOrders = orders.slice(0, 3)
  const latestBookings = bookings.slice(0, 3)

  return (
    <ProtectedRoute requiredRoles={['client']}>
      <DashboardLayout title="Client Dashboard">
        <div className="mb-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-dark-800">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary-600 dark:text-primary-300">Client workspace</p>
              <h2 className="mt-2 text-3xl font-black text-gray-900 dark:text-white">Welcome back, {user?.name || 'Client'}</h2>
              <p className="mt-2 max-w-2xl text-sm text-gray-600 dark:text-gray-400">
                Track project orders, consultation bookings, meeting links, proposals and delivery status from one dashboard.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/dashboard/client/orders" className="btn-primary">New Project Order</Link>
              <Link href="/dashboard/client/bookings" className="rounded-full border border-gray-300 px-5 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700">
                Book Consultation
              </Link>
            </div>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <DashboardStatsCard title="Active Orders" value={loading ? '...' : stats.activeOrders} icon="🛒" helperText="Projects currently open" />
          <DashboardStatsCard title="Upcoming Bookings" value={loading ? '...' : stats.upcomingBookings} icon="📅" helperText="Scheduled or pending sessions" />
          <DashboardStatsCard title="Completed Orders" value={loading ? '...' : stats.completedOrders} icon="✅" helperText="Finished project deliveries" />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-dark-800">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white">Latest Orders</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Recent project request status.</p>
              </div>
              <Link href="/dashboard/client/orders" className="text-sm font-bold text-primary-600 dark:text-primary-300">View all</Link>
            </div>
            <div className="space-y-4">
              {latestOrders.length === 0 ? (
                <p className="rounded-2xl bg-gray-50 p-5 text-sm text-gray-600 dark:bg-dark-900 dark:text-gray-400">No project orders yet.</p>
              ) : latestOrders.map((order) => (
                <div key={order._id} className="rounded-2xl border border-gray-200 p-4 dark:border-gray-700">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-bold text-gray-500 dark:text-gray-400">{(order as any).orderNumber || 'Project order'}</p>
                      <h4 className="mt-1 font-bold text-gray-900 dark:text-white">{order.projectType || (order as any).title}</h4>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{order.budgetRange || 'Budget discussing'}</p>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-dark-800">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white">Consultations</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Meeting requests and approved calls.</p>
              </div>
              <Link href="/dashboard/client/bookings" className="text-sm font-bold text-primary-600 dark:text-primary-300">View all</Link>
            </div>
            <div className="space-y-4">
              {latestBookings.length === 0 ? (
                <p className="rounded-2xl bg-gray-50 p-5 text-sm text-gray-600 dark:bg-dark-900 dark:text-gray-400">No consultation bookings yet.</p>
              ) : latestBookings.map((booking) => (
                <div key={booking._id} className="rounded-2xl border border-gray-200 p-4 dark:border-gray-700">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">{booking.topic}</h4>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {booking.scheduledAt ? new Date(booking.scheduledAt).toLocaleString() : 'Schedule pending'}
                      </p>
                    </div>
                    <StatusBadge status={booking.status} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
