'use client'

import { useState } from 'react'
import axios from 'axios'

export default function OrderForm() {
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    companyName: '',
    projectType: '',
    budgetRange: '',
    deadline: '',
    preferredTechnology: '',
    description: '',
    referenceLinks: '',
    attachmentUrl: '',
    meetingPreference: '',
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
      await axios.post('/api/project-orders', {
        ...formData,
        referenceLinks: formData.referenceLinks
          .split(',')
          .map((link) => link.trim())
          .filter(Boolean),
      })
      setStatus({ message: 'Project request submitted successfully.', type: 'success' })
      setFormData({
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        companyName: '',
        projectType: '',
        budgetRange: '',
        deadline: '',
        preferredTechnology: '',
        description: '',
        referenceLinks: '',
        attachmentUrl: '',
        meetingPreference: '',
      })
    } catch (error: any) {
      setStatus({ message: error?.response?.data?.message || 'Submission failed.', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass-card border-slate-700/70">
      <h2 className="text-2xl font-semibold text-white mb-4">Book Your Project</h2>
      <p className="text-slate-400 mb-6">Share your requirements and get a detailed proposal within 24 hours.</p>
      {status.message && (
        <div className={`rounded-2xl p-4 mb-6 ${status.type === 'success' ? 'bg-emerald-500/10 text-emerald-200 border border-emerald-500/20' : 'bg-red-500/10 text-red-200 border border-red-500/20'}`}>
          {status.message}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <input
            name="clientName"
            value={formData.clientName}
            onChange={handleChange}
            required
            placeholder="Name"
            className="w-full rounded-3xl border border-slate-700/80 bg-slate-950/80 px-4 py-3 text-slate-100"
          />
          <input
            name="clientEmail"
            type="email"
            value={formData.clientEmail}
            onChange={handleChange}
            required
            placeholder="Email"
            className="w-full rounded-3xl border border-slate-700/80 bg-slate-950/80 px-4 py-3 text-slate-100"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <input
            name="clientPhone"
            value={formData.clientPhone}
            onChange={handleChange}
            required
            placeholder="Phone / WhatsApp"
            className="w-full rounded-3xl border border-slate-700/80 bg-slate-950/80 px-4 py-3 text-slate-100"
          />
          <input
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="Company"
            className="w-full rounded-3xl border border-slate-700/80 bg-slate-950/80 px-4 py-3 text-slate-100"
          />
        </div>
        <input
          name="projectType"
          value={formData.projectType}
          onChange={handleChange}
          required
          placeholder="Project type"
          className="w-full rounded-3xl border border-slate-700/80 bg-slate-950/80 px-4 py-3 text-slate-100"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <input
            name="budgetRange"
            value={formData.budgetRange}
            onChange={handleChange}
            placeholder="Budget range"
            className="w-full rounded-3xl border border-slate-700/80 bg-slate-950/80 px-4 py-3 text-slate-100"
          />
          <input
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            placeholder="Deadline"
            className="w-full rounded-3xl border border-slate-700/80 bg-slate-950/80 px-4 py-3 text-slate-100"
          />
        </div>
        <input
          name="preferredTechnology"
          value={formData.preferredTechnology}
          onChange={handleChange}
          placeholder="Preferred technology"
          className="w-full rounded-3xl border border-slate-700/80 bg-slate-950/80 px-4 py-3 text-slate-100"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={4}
          placeholder="Project description"
          className="w-full rounded-3xl border border-slate-700/80 bg-slate-950/80 px-4 py-3 text-slate-100"
        />
        <input
          name="referenceLinks"
          value={formData.referenceLinks}
          onChange={handleChange}
          placeholder="Reference links (comma separated)"
          className="w-full rounded-3xl border border-slate-700/80 bg-slate-950/80 px-4 py-3 text-slate-100"
        />
        <input
          name="attachmentUrl"
          value={formData.attachmentUrl}
          onChange={handleChange}
          placeholder="Attachment or design link"
          className="w-full rounded-3xl border border-slate-700/80 bg-slate-950/80 px-4 py-3 text-slate-100"
        />
        <input
          name="meetingPreference"
          value={formData.meetingPreference}
          onChange={handleChange}
          placeholder="Meeting preference"
          className="w-full rounded-3xl border border-slate-700/80 bg-slate-950/80 px-4 py-3 text-slate-100"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-primary-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-400 disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Request'}
        </button>
      </form>
    </div>
  )
}
