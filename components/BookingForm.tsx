'use client'

import { useState } from 'react'
import axios from 'axios'

export default function BookingForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    topic: '',
    scheduledAt: '',
    duration: '60',
    notes: '',
  })
  const [status, setStatus] = useState({ message: '', type: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setStatus({ message: '', type: '' })

    try {
      await axios.post('/api/bookings', formData)
      setStatus({ message: 'Consultation request submitted successfully.', type: 'success' })
      setFormData({ name: '', email: '', phone: '', topic: '', scheduledAt: '', duration: '60', notes: '' })
    } catch (error: any) {
      setStatus({ message: error?.response?.data?.message || 'Failed to submit booking', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass-card border-slate-700/70">
      <h2 className="text-2xl font-semibold text-white mb-4">Book a Consultation</h2>
      <p className="text-slate-400 mb-6">Discuss your project goals, training needs, or LMS requirements with a live session.</p>
      {status.message && (
        <div className={`rounded-2xl p-4 mb-6 ${status.type === 'success' ? 'bg-emerald-500/10 text-emerald-200 border border-emerald-500/20' : 'bg-red-500/10 text-red-200 border border-red-500/20'}`}>
          {status.message}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Full name"
            className="w-full rounded-3xl border border-slate-700/80 bg-slate-950/80 px-4 py-3 text-slate-100"
          />
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Email address"
            className="w-full rounded-3xl border border-slate-700/80 bg-slate-950/80 px-4 py-3 text-slate-100"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="Phone / WhatsApp"
            className="w-full rounded-3xl border border-slate-700/80 bg-slate-950/80 px-4 py-3 text-slate-100"
          />
          <input
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            required
            placeholder="Topic"
            className="w-full rounded-3xl border border-slate-700/80 bg-slate-950/80 px-4 py-3 text-slate-100"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <input
            name="scheduledAt"
            type="datetime-local"
            value={formData.scheduledAt}
            onChange={handleChange}
            required
            className="w-full rounded-3xl border border-slate-700/80 bg-slate-950/80 px-4 py-3 text-slate-100"
          />
          <input
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            placeholder="Duration (minutes)"
            className="w-full rounded-3xl border border-slate-700/80 bg-slate-950/80 px-4 py-3 text-slate-100"
          />
        </div>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={4}
          placeholder="Message or agenda"
          className="w-full rounded-3xl border border-slate-700/80 bg-slate-950/80 px-4 py-3 text-slate-100"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-primary-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-400 disabled:opacity-50"
        >
          {loading ? 'Booking...' : 'Request Consultation'}
        </button>
      </form>
    </div>
  )
}
