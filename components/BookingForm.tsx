'use client'

import { useState } from 'react'
import axios from 'axios'
import { CheckCircle, AlertCircle } from 'lucide-react'

const TOPIC_OPTIONS = [
  'Project Development',
  'Course Enrollment',
  'Live Training Program',
  'LMS Implementation',
  'Team Training',
  'Bug Fixing / Support',
  'Other',
]

const DURATION_OPTIONS = [
  { label: '30 minutes', value: '30' },
  { label: '60 minutes', value: '60' },
  { label: '90 minutes', value: '90' },
  { label: '2 hours', value: '120' },
]

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
  const [status, setStatus] = useState<{ message: string; type: 'success' | 'error' | '' }>({
    message: '',
    type: '',
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setStatus({ message: '', type: '' })

    try {
      await axios.post('/api/bookings', formData)
      setStatus({
        message: 'Your consultation request has been submitted. I will get back to you within 24 hours.',
        type: 'success',
      })
      setFormData({ name: '', email: '', phone: '', topic: '', scheduledAt: '', duration: '60', notes: '' })
    } catch (error: any) {
      setStatus({
        message: error?.response?.data?.message || 'Failed to submit. Please try again.',
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="mb-1 text-xl font-bold text-slate-900">Book a Consultation</h2>
      <p className="mb-6 text-sm text-slate-500">
        Fill in the details below and I&apos;ll confirm a time that works for both of us.
      </p>

      {status.message && (
        <div
          className={`mb-6 flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${
            status.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
              : 'border-red-200 bg-red-50 text-red-700'
          }`}
        >
          {status.type === 'success' ? (
            <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          )}
          <span>{status.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name + Email */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-slate-700">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Your full name"
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-slate-700">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="input-field"
            />
          </div>
        </div>

        {/* Phone + Topic */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="phone" className="mb-1.5 block text-sm font-semibold text-slate-700">
              Phone / WhatsApp <span className="text-red-500">*</span>
            </label>
            <input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="+880 1700 000000"
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor="topic" className="mb-1.5 block text-sm font-semibold text-slate-700">
              Topic <span className="text-red-500">*</span>
            </label>
            <select
              id="topic"
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              required
              className="input-field"
            >
              <option value="">Select a topic</option>
              {TOPIC_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date + Duration */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="scheduledAt" className="mb-1.5 block text-sm font-semibold text-slate-700">
              Preferred Date &amp; Time <span className="text-red-500">*</span>
            </label>
            <input
              id="scheduledAt"
              name="scheduledAt"
              type="datetime-local"
              value={formData.scheduledAt}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor="duration" className="mb-1.5 block text-sm font-semibold text-slate-700">
              Session Duration
            </label>
            <select
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="input-field"
            >
              {DURATION_OPTIONS.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Message */}
        <div>
          <label htmlFor="notes" className="mb-1.5 block text-sm font-semibold text-slate-700">
            Message / Agenda
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            placeholder="Briefly describe your goals, questions, or what you'd like to discuss..."
            className="input-field resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Request Consultation'}
        </button>
      </form>
    </div>
  )
}
