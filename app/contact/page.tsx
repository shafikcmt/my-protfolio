'use client'

import { useState } from 'react'
import axios from 'axios'
import Link from 'next/link'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    try {
      const { data } = await axios.post('/api/contact', formData)
      if (data.success) {
        setMessage(data.message)
        setFormData({ name: '', email: '', subject: '', message: '' })
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to send message')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 text-white">
      {/* Navbar placeholder - you can reuse your Navbar component */}
      <nav className="border-b border-gray-700 bg-dark-800/50 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-xl font-bold text-primary-400 hover:text-primary-300">
            ← Back to Home
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold sm:text-5xl">Get In Touch</h1>
          <p className="text-lg text-gray-400">
            Have a project in mind? Let&apos;s discuss how I can help bring your ideas to life.
          </p>
        </div>

        {/* Contact Form */}
        <div className="rounded-xl border border-gray-700 bg-dark-800/50 p-8 backdrop-blur sm:p-12">
          {message && (
            <div className="mb-6 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-green-400">
              ✓ {message}
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-400">
              ✗ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-600 bg-dark-700 px-4 py-3 text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="Your name"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-600 bg-dark-700 px-4 py-3 text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="your.email@example.com"
              />
            </div>

            {/* Subject */}
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                id="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-600 bg-dark-700 px-4 py-3 text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="What is this about?"
              />
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                Message
              </label>
              <textarea
                name="message"
                id="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full rounded-lg border border-gray-600 bg-dark-700 px-4 py-3 text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="Tell me about your project or inquiry..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-primary-600 px-6 py-3 font-medium text-white hover:bg-primary-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>

          {/* Additional Contact Info */}
          <div className="mt-12 border-t border-gray-700 pt-8">
            <h3 className="mb-6 text-lg font-semibold">Other Ways to Connect</h3>
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="rounded-lg border border-gray-700 bg-dark-700/50 p-4">
                <p className="text-sm text-gray-400 mb-2">Email</p>
                <a href="mailto:your-email@example.com" className="text-primary-400 hover:text-primary-300">
                  your-email@example.com
                </a>
              </div>
              <div className="rounded-lg border border-gray-700 bg-dark-700/50 p-4">
                <p className="text-sm text-gray-400 mb-2">WhatsApp</p>
                <a href="https://wa.me/1234567890" className="text-primary-400 hover:text-primary-300">
                  +1 (234) 567-890
                </a>
              </div>
              <div className="rounded-lg border border-gray-700 bg-dark-700/50 p-4">
                <p className="text-sm text-gray-400 mb-2">LinkedIn</p>
                <a href="https://linkedin.com" className="text-primary-400 hover:text-primary-300">
                  View Profile
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
