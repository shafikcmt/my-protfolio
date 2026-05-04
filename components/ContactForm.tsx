'use client'

import { useState } from 'react'
import axios from 'axios'

interface ContactFormState {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

const initialState: ContactFormState = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
}

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormState>(initialState)
  const [loading, setLoading] = useState(false)
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleChange = (field: keyof ContactFormState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setNotice(null)

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setNotice({ type: 'error', text: 'Please fill all required fields.' })
      return
    }

    try {
      setLoading(true)
      await axios.post('/api/contact', formData)
      setFormData(initialState)
      setNotice({ type: 'success', text: 'Message sent successfully. I will contact you soon.' })
    } catch (error: any) {
      setNotice({
        type: 'error',
        text: error.response?.data?.message || 'Failed to send message. Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-700/70 bg-slate-900/80 p-6 shadow-2xl backdrop-blur md:p-8">
      {notice && (
        <div
          className={`mb-6 rounded-2xl px-4 py-3 text-sm font-semibold ${
            notice.type === 'success'
              ? 'bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/30'
              : 'bg-red-500/10 text-red-300 ring-1 ring-red-500/30'
          }`}
        >
          {notice.text}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-200">Name *</label>
          <input
            value={formData.name}
            onChange={(event) => handleChange('name', event.target.value)}
            className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white outline-none transition focus:border-primary-400"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-200">Email *</label>
          <input
            type="email"
            value={formData.email}
            onChange={(event) => handleChange('email', event.target.value)}
            className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white outline-none transition focus:border-primary-400"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-200">Phone / WhatsApp</label>
          <input
            value={formData.phone}
            onChange={(event) => handleChange('phone', event.target.value)}
            className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white outline-none transition focus:border-primary-400"
            placeholder="+880..."
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-200">Subject *</label>
          <input
            value={formData.subject}
            onChange={(event) => handleChange('subject', event.target.value)}
            className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white outline-none transition focus:border-primary-400"
            placeholder="Project / training / support"
          />
        </div>
      </div>

      <div className="mt-5">
        <label className="mb-2 block text-sm font-semibold text-slate-200">Message *</label>
        <textarea
          value={formData.message}
          onChange={(event) => handleChange('message', event.target.value)}
          rows={6}
          className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white outline-none transition focus:border-primary-400"
          placeholder="Tell me about your project, course, or consultation request..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full rounded-full bg-primary-500 px-6 py-3 font-bold text-white transition hover:bg-primary-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  )
}
