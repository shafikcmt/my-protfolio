'use client'

import { useEffect, useMemo, useState } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import DashboardLayout from '@/components/DashboardLayout'
import EmptyState from '@/components/EmptyState'
import OrderStatusTimeline from '@/components/OrderStatusTimeline'
import StatusBadge from '@/components/StatusBadge'
import axios from 'axios'
import { IConsultationBooking } from '@/types/models'

const bookingStatuses = ['pending', 'approved', 'completed', 'rejected', 'cancelled']

function statusLabel(value?: string) {
  return (value || 'pending').replace(/[-_]/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}

export default function ClientBookingsPage() {
  const [bookings, setBookings] = useState<IConsultationBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [filter, setFilter] = useState('all')
  const [formData, setFormData] = useState({
    topic: '',
    phone: '',
    notes: '',
    scheduledAt: '',
    duration: '60',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get('/api/client/bookings')
      setBookings(data.data || [])
    } catch (err) {
      console.error('Fetch bookings failed:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredBookings = useMemo(() => {
    if (filter === 'all') return bookings
    return bookings.filter((booking) => (booking.status || 'pending') === filter)
  }, [bookings, filter])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSubmitting(true)

    if (!formData.topic || !formData.scheduledAt) {
      setSubmitting(false)
      return setError('Please enter topic and preferred schedule date.')
    }

    try {
      const response = await axios.post('/api/client/bookings', {
        ...formData,
        duration: Number(formData.duration) || 60,
      })
      setBookings((prev) => [response.data.data, ...prev])
      setSuccess('Consultation request submitted successfully.')
      setFormData({ topic: '', phone: '', notes: '', scheduledAt: '', duration: '60' })
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to submit booking')
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancel = async (id: string) => {
    if (!confirm('Cancel this consultation booking?')) return
    try {
      const { data } = await axios.put('/api/client/bookings', { id, status: 'cancelled' })
      setBookings((prev) => prev.map((booking) => (booking._id === id ? data.data : booking)))
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Cancel booking failed')
    }
  }

  return (
    <ProtectedRoute requiredRoles={['client']}>
      <DashboardLayout
        title="Consultation Bookings"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard/client' },
          { label: 'Bookings', href: '/dashboard/client/bookings' },
        ]}
      >
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <section className="space-y-6">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-dark-800">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white">Consultation Tracking</h2>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">See approval status, schedule, meeting link and notes.</p>
                </div>
                <select value={filter} onChange={(e) => setFilter(e.target.value)} className="input-field max-w-xs">
                  <option value="all">All Bookings</option>
                  {bookingStatuses.map((status) => (
                    <option key={status} value={status}>{statusLabel(status)}</option>
                  ))}
                </select>
              </div>
            </div>

            {loading ? (
              <div className="rounded-3xl border border-gray-200 bg-white p-12 text-center dark:border-gray-700 dark:bg-dark-800">
                <div className="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-primary-500" />
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">Loading your bookings...</p>
              </div>
            ) : filteredBookings.length === 0 ? (
              <EmptyState title="No bookings found" message="Request a consultation to discuss your project requirement live." />
            ) : (
              <div className="space-y-5">
                {filteredBookings.map((booking) => (
                  <article key={booking._id} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-dark-800">
                    <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <h3 className="text-xl font-black text-gray-900 dark:text-white">{booking.topic}</h3>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                          {booking.scheduledAt ? new Date(booking.scheduledAt).toLocaleString() : 'Schedule pending'} • {booking.duration || 60} minutes
                        </p>
                      </div>
                      <StatusBadge status={booking.status} />
                    </div>

                    <p className="mb-5 rounded-2xl bg-gray-50 p-4 text-sm text-gray-600 dark:bg-dark-900 dark:text-gray-400">
                      {booking.notes || 'No additional notes provided.'}
                    </p>

                    <OrderStatusTimeline status={booking.status} type="booking" />

                    <div className="mt-5 flex flex-wrap gap-3">
                      {booking.meetingLink && ['approved', 'confirmed'].includes(booking.status || '') && (
                        <a href={booking.meetingLink} target="_blank" rel="noreferrer" className="rounded-full bg-blue-600 px-5 py-2 text-sm font-bold text-white transition hover:bg-blue-700">
                          Join Meeting
                        </a>
                      )}
                      {!['completed', 'cancelled', 'rejected'].includes(booking.status || 'pending') && (
                        <button onClick={() => handleCancel(booking._id!)} className="rounded-full bg-red-600 px-5 py-2 text-sm font-bold text-white transition hover:bg-red-700">
                          Cancel Booking
                        </button>
                      )}
                    </div>

                    {(booking as any).adminNote && (
                      <div className="mt-5 rounded-2xl border border-primary-500/20 bg-primary-500/10 p-4 text-sm text-gray-700 dark:text-gray-200">
                        <strong>Admin Note:</strong> {(booking as any).adminNote}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-dark-800">
              <h2 className="text-xl font-black text-gray-900 dark:text-white">Request Consultation</h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Choose a preferred time. Admin will approve and share meeting link.</p>
              <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                <input name="topic" value={formData.topic} onChange={handleChange} required placeholder="Consultation topic" className="input-field" />
                <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone / WhatsApp" className="input-field" />
                <input name="scheduledAt" type="datetime-local" value={formData.scheduledAt} onChange={handleChange} required className="input-field" />
                <input name="duration" type="number" min={30} step={15} value={formData.duration} onChange={handleChange} className="input-field" />
                <textarea name="notes" value={formData.notes} onChange={handleChange} rows={5} placeholder="Message or agenda" className="input-field" />

                {error && <p className="rounded-2xl bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-300">{error}</p>}
                {success && <p className="rounded-2xl bg-emerald-500/10 p-3 text-sm text-emerald-600 dark:text-emerald-300">{success}</p>}

                <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
                  {submitting ? 'Submitting...' : 'Submit Booking'}
                </button>
              </form>
            </div>
          </aside>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
