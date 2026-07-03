'use client'

import { useState } from 'react'
import axios from 'axios'
import { CheckCircle, AlertCircle } from 'lucide-react'

export default function OrderForm({ initialProject }: { initialProject?: string }) {
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    companyName: '',
    projectType: initialProject || '',
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      setStatus({ message: 'Project request submitted successfully. I\'ll get back to you within 24 hours.', type: 'success' })
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
      setStatus({ message: error?.response?.data?.message || 'Submission failed. Please try again.', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="mb-1 text-xl font-bold text-slate-900">Book Your Project</h2>
      <p className="mb-6 text-sm text-slate-500">
        Share your requirements and get a detailed proposal within 24 hours.
      </p>

      {status.message && (
        <div
          className={`mb-6 flex items-start gap-3 rounded-xl border p-4 ${
            status.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
              : 'border-red-200 bg-red-50 text-red-700'
          }`}
        >
          {status.type === 'success' ? (
            <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
          ) : (
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
          )}
          <p className="text-sm">{status.message}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              required
              placeholder="Your name"
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              name="clientEmail"
              type="email"
              value={formData.clientEmail}
              onChange={handleChange}
              required
              placeholder="your@email.com"
              className="input-field"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
              Phone / WhatsApp <span className="text-red-500">*</span>
            </label>
            <input
              name="clientPhone"
              value={formData.clientPhone}
              onChange={handleChange}
              required
              placeholder="+880 1700 000000"
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">Company</label>
            <input
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Your company (optional)"
              className="input-field"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-700">
            Project Type / Reference <span className="text-red-500">*</span>
          </label>
          <input
            name="projectType"
            value={formData.projectType}
            onChange={handleChange}
            required
            placeholder="e.g. Laravel LMS, eCommerce store..."
            className="input-field"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">Budget Range</label>
            <select name="budgetRange" value={formData.budgetRange} onChange={handleChange} className="input-field">
              <option value="">Select budget...</option>
              <option value="Under $500">Under $500</option>
              <option value="$500 – $1,000">$500 – $1,000</option>
              <option value="$1,000 – $3,000">$1,000 – $3,000</option>
              <option value="$3,000+">$3,000+</option>
              <option value="To be discussed">To be discussed</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">Deadline</label>
            <input
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              placeholder="e.g. 4 weeks, ASAP"
              className="input-field"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-700">Preferred Technology</label>
          <input
            name="preferredTechnology"
            value={formData.preferredTechnology}
            onChange={handleChange}
            placeholder="e.g. Laravel, Next.js, React..."
            className="input-field"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-700">
            Project Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            placeholder="Describe your project goals, key features, and any special requirements..."
            className="input-field resize-none"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-700">
            Reference Links
          </label>
          <input
            name="referenceLinks"
            value={formData.referenceLinks}
            onChange={handleChange}
            placeholder="Comma-separated URLs of similar projects or designs"
            className="input-field"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-700">Attachment / Design Link</label>
          <input
            name="attachmentUrl"
            value={formData.attachmentUrl}
            onChange={handleChange}
            placeholder="Google Drive, Figma, or any file link"
            className="input-field"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-700">Meeting Preference</label>
          <select name="meetingPreference" value={formData.meetingPreference} onChange={handleChange} className="input-field">
            <option value="">Select preference...</option>
            <option value="Google Meet">Google Meet</option>
            <option value="Zoom">Zoom</option>
            <option value="WhatsApp Call">WhatsApp Call</option>
            <option value="No meeting needed">No meeting needed</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-teal-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-teal-500 disabled:opacity-50"
        >
          {loading ? 'Submitting…' : 'Submit Request'}
        </button>
      </form>
    </div>
  )
}
