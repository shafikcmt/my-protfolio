'use client'

import { useEffect, useMemo, useState } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import DashboardLayout from '@/components/DashboardLayout'
import EmptyState from '@/components/EmptyState'
import OrderStatusTimeline from '@/components/OrderStatusTimeline'
import StatusBadge from '@/components/StatusBadge'
import { IConsultationBooking } from '@/types/models'
import axios from 'axios'

const statusOptions = ['pending', 'approved', 'rejected', 'completed', 'cancelled']

function statusLabel(value: string) {
  return value.replace(/[-_]/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<IConsultationBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get('/api/admin/bookings')
      setBookings(data.data || [])
    } catch (error) {
      console.error('Failed to fetch bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredBookings = useMemo(() => {
    if (filter === 'all') return bookings
    return bookings.filter((booking) => (booking.status || 'pending') === filter)
  }, [bookings, filter])

  const updateBooking = async (id: string, updateData: Record<string, any>) => {
    try {
      setSavingId(id)
      const { data } = await axios.put('/api/admin/bookings', { id, ...updateData })
      setBookings((prev) => prev.map((booking) => (booking._id === id ? data.data : booking)))
    } catch (error: any) {
      alert(error?.response?.data?.message || 'Failed to update booking')
    } finally {
      setSavingId('')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this booking?')) return
    try {
      await axios.delete('/api/admin/bookings', { data: { id } })
      setBookings((prev) => prev.filter((booking) => booking._id !== id))
    } catch (error: any) {
      alert(error?.response?.data?.message || 'Failed to delete booking')
    }
  }

  return (
    <ProtectedRoute requiredRoles={['admin']}>
      <DashboardLayout title="Manage Bookings">
        <div className="mb-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-dark-800">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">Consultation Control</h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Approve/reject bookings, update schedule, add meeting link and admin notes.</p>
            </div>
            <select value={filter} onChange={(event) => setFilter(event.target.value)} className="input-field max-w-xs">
              <option value="all">All Bookings</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>{statusLabel(status)}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-gray-200 bg-white p-12 text-center dark:border-gray-700 dark:bg-dark-800">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-primary-500" />
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">Loading consultation bookings...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <EmptyState title="No consultation bookings found" message="Client consultation requests will appear here." />
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => {
              const id = booking._id || ''
              const client = (booking as any).clientId
              return (
                <article key={id} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-dark-800">
                  <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <h3 className="text-xl font-black text-gray-900 dark:text-white">{booking.topic}</h3>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {booking.scheduledAt ? new Date(booking.scheduledAt).toLocaleString() : 'Schedule pending'} • {booking.duration || 60} minutes
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <span className="rounded-full bg-gray-100 px-3 py-1 dark:bg-dark-900">{booking.name || client?.name || 'Client'}</span>
                        <span className="rounded-full bg-gray-100 px-3 py-1 dark:bg-dark-900">{booking.email || client?.email || 'No email'}</span>
                        {booking.phone && <span className="rounded-full bg-gray-100 px-3 py-1 dark:bg-dark-900">{booking.phone}</span>}
                      </div>
                    </div>
                    <StatusBadge status={booking.status} />
                  </div>

                  <p className="mb-5 rounded-2xl bg-gray-50 p-4 text-sm text-gray-600 dark:bg-dark-900 dark:text-gray-400">
                    {booking.notes || 'No additional notes provided.'}
                  </p>

                  <OrderStatusTimeline status={booking.status} type="booking" />

                  <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-300">Status</span>
                      <select
                        value={(booking.status || 'pending').replace('requested', 'pending').replace('confirmed', 'approved')}
                        disabled={savingId === id}
                        onChange={(event) => updateBooking(id, { status: event.target.value })}
                        className="input-field"
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>{statusLabel(status)}</option>
                        ))}
                      </select>
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-300">Schedule</span>
                      <input
                        type="datetime-local"
                        defaultValue={booking.scheduledAt ? new Date(booking.scheduledAt).toISOString().slice(0, 16) : ''}
                        disabled={savingId === id}
                        onBlur={(event) => event.target.value && updateBooking(id, { scheduledAt: event.target.value })}
                        className="input-field"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-300">Meeting Link</span>
                      <input defaultValue={booking.meetingLink || ''} disabled={savingId === id} onBlur={(event) => updateBooking(id, { meetingLink: event.target.value })} className="input-field" placeholder="https://meet.google.com/..." />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-300">Duration</span>
                      <input type="number" min={15} defaultValue={booking.duration || 60} disabled={savingId === id} onBlur={(event) => updateBooking(id, { duration: Number(event.target.value) || 60 })} className="input-field" />
                    </label>
                    <label className="block lg:col-span-2">
                      <span className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-300">Admin Note</span>
                      <input defaultValue={(booking as any).adminNote || ''} disabled={savingId === id} onBlur={(event) => updateBooking(id, { adminNote: event.target.value })} className="input-field" placeholder="Visible to client" />
                    </label>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    {savingId === id && <span className="rounded-full bg-primary-500/10 px-4 py-2 text-sm font-bold text-primary-600 dark:text-primary-300">Saving...</span>}
                    <button onClick={() => handleDelete(id)} className="rounded-full bg-red-600 px-5 py-2 text-sm font-bold text-white hover:bg-red-700">Delete</button>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  )
}
