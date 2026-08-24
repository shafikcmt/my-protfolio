'use client'

import { useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  CheckCircle,
  Clock,
  Github,
  Linkedin,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Send,
  Users,
} from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'

// ─── Options ──────────────────────────────────────────────────────────────────

const INQUIRY_TYPES = [
  { value: '', label: 'Select inquiry type...' },
  { value: 'hire_me', label: 'Hire Me' },
  { value: 'project_inquiry', label: 'Project Inquiry' },
  { value: 'course_training', label: 'Course / Training' },
  { value: 'consultation', label: 'Consultation' },
  { value: 'other', label: 'Other' },
]

const SERVICES = [
  { value: '', label: 'Select service...' },
  { value: 'Website Development', label: 'Website Development' },
  { value: 'Laravel Project', label: 'Laravel Project' },
  { value: 'React / Next.js', label: 'React / Next.js' },
  { value: 'Dashboard/Admin Panel', label: 'Dashboard / Admin Panel' },
  { value: 'Bug Fixing', label: 'Bug Fixing' },
  { value: 'Deployment', label: 'Deployment' },
  { value: 'Other', label: 'Other' },
]

const BUDGETS = [
  { value: '', label: 'Select budget range...' },
  { value: 'Need Discussion', label: 'Need Discussion' },
  { value: 'Under $100', label: 'Under $100' },
  { value: '$100 - $300', label: '$100 – $300' },
  { value: '$300 - $700', label: '$300 – $700' },
  { value: '$700+', label: '$700+' },
]

const INITIAL_FORM = {
  name: '',
  email: '',
  phone: '',
  inquiryType: '',
  serviceNeeded: '',
  budget: '',
  timeline: '',
  subject: '',
  message: '',
  preferredContact: '',
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ContactPage() {
  const [formData, setFormData] = useState(INITIAL_FORM)
  const [errors, setErrors]     = useState<Record<string, string>>({})
  const [loading, setLoading]   = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[name]
        if (name === 'email' || name === 'phone') delete next.contactRequired
        return next
      })
    }
  }

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!formData.name.trim()) errs.name = 'Full name is required'
    if (!formData.email.trim() && !formData.phone.trim()) {
      errs.contactRequired = 'Please provide an email address or phone number'
    }
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Enter a valid email address'
    }
    if (!formData.inquiryType) errs.inquiryType = 'Please select an inquiry type'
    if (!formData.subject.trim()) errs.subject = 'Subject is required'
    if (!formData.message.trim()) errs.message = 'Message is required'
    return errs
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      toast.error('Please fix the errors below before submitting.')
      return
    }
    setLoading(true)
    try {
      const { data } = await axios.post('/api/contact', formData)
      if (data.success) {
        setSubmitted(true)
        toast.success('Inquiry sent successfully!')
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to send. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputBase =
    'w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:ring-2 focus:ring-teal-100'
  const inputCls = (field: string) =>
    `${inputBase} ${
      errors[field] ||
      (field === 'email' && errors.contactRequired) ||
      (field === 'phone' && errors.contactRequired)
        ? 'border-red-300 focus:border-red-400'
        : 'border-slate-200 focus:border-teal-400'
    }`
  const selectCls = (field: string) =>
    `w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:ring-2 focus:ring-teal-100 ${
      errors[field]
        ? 'border-red-300 focus:border-red-400'
        : 'border-slate-200 focus:border-teal-400'
    }`

  // ── Success screen ──
  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4 py-20">
        <Toaster position="top-right" />
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-teal-50">
            <CheckCircle className="h-8 w-8 text-teal-500" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-slate-900">Message Sent!</h2>
          <p className="mb-1 font-medium text-slate-700">Thank you, {formData.name}!</p>
          <p className="mb-8 text-sm text-slate-500">
            I&apos;ve received your inquiry and will get back to you within 24 hours.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={() => {
                setSubmitted(false)
                setFormData(INITIAL_FORM)
                setErrors({})
              }}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Send Another
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-teal-500"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Toaster position="top-right" />

      {/* ═══════════════════════════════════════
          HERO
      ═══════════════════════════════════════ */}
      <section className="border-b border-slate-100 bg-white">
        <div className="container-custom py-16 lg:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-teal-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-teal-700">
              <BadgeCheck className="h-3.5 w-3.5" /> Contact &amp; Hire Me
            </span>
            <h1 className="mb-5 text-4xl font-black leading-tight tracking-tight text-slate-900 sm:text-5xl">
              Let&apos;s Build Something{' '}
              <span className="text-teal-600">Great Together</span>
            </h1>
            <p className="mb-8 text-base leading-relaxed text-slate-500 sm:text-lg">
              Have a project idea, need a developer, or want to explore training? Fill in the
              form below and I&apos;ll get back to you within 24 hours.
            </p>
          </div>

          {/* Trust bar */}
          <div className="mt-2 flex flex-wrap justify-center gap-x-8 gap-y-3">
            {[
              { icon: <Briefcase className="h-4 w-4" />, label: '100+ Projects Delivered' },
              { icon: <Users     className="h-4 w-4" />, label: '50+ Happy Clients'        },
              { icon: <Clock     className="h-4 w-4" />, label: 'Response within 24 hours' },
              { icon: <BadgeCheck className="h-4 w-4" />,label: '5+ Years Experience'      },
            ].map((item) => (
              <span
                key={item.label}
                className="flex items-center gap-2 text-sm font-medium text-slate-500"
              >
                <span className="text-teal-500">{item.icon}</span>
                {item.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FORM + INFO
      ═══════════════════════════════════════ */}
      <section className="container-custom py-14 lg:py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">

          {/* ── LEFT: Contact info ── */}
          <aside className="lg:col-span-2 space-y-5">

            {/* Availability card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-teal-400" />
                </span>
                <span className="text-sm font-semibold text-teal-600">
                  Available for Freelance Work
                </span>
              </div>

              <p className="mb-6 text-sm leading-relaxed text-slate-500">
                Open to new freelance projects, long-term collaborations, and training
                partnerships. Let&apos;s discuss what you need.
              </p>

              <div className="space-y-4">
                <a
                  href="mailto:mdshafiqulislam822@gmail.com"
                  className="group flex items-center gap-3 transition hover:text-teal-600"
                >
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 transition group-hover:border-teal-200 group-hover:bg-teal-50 text-slate-500 group-hover:text-teal-600">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-400">Email</p>
                    <p className="truncate text-sm font-medium text-slate-700 group-hover:text-teal-600">
                      mdshafiqulislam822@gmail.com
                    </p>
                  </div>
                </a>

                <a
                  href="https://wa.me/8801234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 transition"
                >
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 transition group-hover:border-teal-200 group-hover:bg-teal-50 text-slate-500 group-hover:text-teal-600">
                    <MessageCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">WhatsApp</p>
                    <p className="text-sm font-medium text-slate-700 group-hover:text-teal-600">
                      +880 1234 567890
                    </p>
                  </div>
                </a>

                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-teal-500">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Response Time</p>
                    <p className="text-sm font-medium text-slate-700">Within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-teal-500">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Location</p>
                    <p className="text-sm font-medium text-slate-700">Bangladesh · Remote OK</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick links */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="mb-3 text-sm font-semibold text-slate-700">Find me online</p>
              <div className="flex gap-3">
                <a
                  href="https://github.com/shafikcmt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-600"
                >
                  <Github className="h-4 w-4" />
                </a>
                <a
                  href="https://linkedin.com/in/shafikcmt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-600"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* What to expect */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="mb-3 text-sm font-semibold text-slate-700">What happens next?</p>
              <ol className="space-y-3">
                {[
                  'You submit the form with your project details.',
                  'I review your inquiry and reply within 24 hours.',
                  'We discuss scope, timeline, and pricing.',
                  'Work begins after agreement.',
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-xs text-slate-500">
                    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-teal-50 text-[10px] font-bold text-teal-700">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </aside>

          {/* ── RIGHT: Contact form ── */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="mb-1 text-xl font-bold text-slate-900">Send Your Inquiry</h2>
              <p className="mb-6 text-sm text-slate-500">
                Fields marked <span className="text-red-500">*</span> are required.
              </p>

              <form onSubmit={handleSubmit} noValidate className="space-y-5">

                {/* Full Name */}
                <div>
                  <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-slate-700">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className={inputCls('name')}
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                </div>

                {/* Email + Phone */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className={inputCls('email')}
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                  </div>
                  <div>
                    <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-slate-700">
                      Phone / WhatsApp
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+880 1234 567890"
                      className={inputCls('phone')}
                    />
                  </div>
                </div>
                {errors.contactRequired && (
                  <p className="-mt-3 text-xs text-red-500">{errors.contactRequired}</p>
                )}
                <p className="-mt-3 text-xs text-slate-400">
                  Provide at least one contact method.
                </p>

                {/* Inquiry Type */}
                <div>
                  <label htmlFor="inquiryType" className="mb-1.5 block text-sm font-medium text-slate-700">
                    Inquiry Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="inquiryType"
                    name="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleChange}
                    className={selectCls('inquiryType')}
                  >
                    {INQUIRY_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                  {errors.inquiryType && (
                    <p className="mt-1 text-xs text-red-500">{errors.inquiryType}</p>
                  )}
                </div>

                {/* Service + Budget */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="serviceNeeded" className="mb-1.5 block text-sm font-medium text-slate-700">
                      Service Needed
                    </label>
                    <select
                      id="serviceNeeded"
                      name="serviceNeeded"
                      value={formData.serviceNeeded}
                      onChange={handleChange}
                      className={selectCls('serviceNeeded')}
                    >
                      {SERVICES.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="budget" className="mb-1.5 block text-sm font-medium text-slate-700">
                      Budget Range
                    </label>
                    <select
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className={selectCls('budget')}
                    >
                      {BUDGETS.map((b) => (
                        <option key={b.value} value={b.value}>{b.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="mb-1.5 block text-sm font-medium text-slate-700">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g. Need a Laravel LMS for my school"
                    className={inputCls('subject')}
                  />
                  {errors.subject && <p className="mt-1 text-xs text-red-500">{errors.subject}</p>}
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-slate-700">
                    Message / Project Details <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Describe your project, requirements, or questions..."
                    className={inputCls('message')}
                  />
                  {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-teal-600 px-6 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-teal-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        Send Inquiry
                      </>
                    )}
                  </span>
                </button>

                <p className="text-center text-xs text-slate-400">
                  Your information is kept private and used only to respond to your inquiry.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CTA
      ═══════════════════════════════════════ */}
      <section className="container-custom pb-20">
        <div className="rounded-2xl bg-teal-600 px-8 py-14 text-center shadow-sm">
          <p className="mb-3 text-sm font-bold uppercase tracking-widest text-teal-200">
            Not Sure Where to Start?
          </p>
          <h2 className="mb-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
            Book a Free Consultation
          </h2>
          <p className="mx-auto mb-8 max-w-lg text-base text-teal-100">
            Not sure what you need? Let&apos;s talk for 30 minutes — I&apos;ll help you map out
            the right approach for your project, no obligation.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/book-consultation"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-teal-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              Book a Consultation <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="https://wa.me/8801234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-teal-400 px-6 py-3 text-sm font-bold text-white transition hover:bg-teal-500"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp Me
            </a>
          </div>
        </div>
      </section>

    </div>
  )
}
