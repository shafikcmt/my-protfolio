'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Clock,
  DollarSign,
  MessageCircle,
  Wrench,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ServiceDetail {
  _id: string
  title: string
  slug: string
  description: string
  icon?: string
  price?: number
  startingPrice?: string
  duration?: string
  features?: string[]
  technologies?: string[]
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function DetailSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mb-4 h-3 w-20 rounded-full bg-slate-100" />
      <div className="mb-3 h-8 w-2/3 rounded-lg bg-slate-100" />
      <div className="mb-2 h-4 w-full rounded bg-slate-100" />
      <div className="mb-10 h-4 w-4/5 rounded bg-slate-100" />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 rounded-xl bg-slate-100" />
          ))}
        </div>
        <div className="space-y-4 rounded-2xl bg-slate-100 p-6 h-64" />
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ServiceDetailPage() {
  const params  = useParams()
  const router  = useRouter()
  const slug    = params.slug as string

  const [service, setService] = useState<ServiceDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  useEffect(() => {
    if (!slug) return
    ;(async () => {
      try {
        setLoading(true)
        setError('')
        const { data } = await axios.get(`/api/services?slug=${encodeURIComponent(slug)}`)
        if (data.success && data.data.length > 0) {
          setService(data.data[0])
        } else {
          setError('Service not found.')
        }
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Failed to load service.')
      } finally {
        setLoading(false)
      }
    })()
  }, [slug])

  // ── States ──
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <div className="border-b border-slate-100 bg-white">
          <div className="container-custom py-4">
            <div className="h-4 w-28 animate-pulse rounded bg-slate-100" />
          </div>
        </div>
        <div className="container-custom py-12">
          <DetailSkeleton />
        </div>
      </div>
    )
  }

  if (error || !service) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#F8FAFC] px-4 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
          <Wrench className="h-6 w-6 text-red-400" />
        </div>
        <h1 className="text-xl font-bold text-slate-800">{error || 'Service not found'}</h1>
        <p className="text-sm text-slate-500">
          This service may have been removed or the link is incorrect.
        </p>
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-sm font-semibold text-teal-600 hover:text-teal-500"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Services
        </Link>
      </div>
    )
  }

  const displayPrice = service.startingPrice ?? (service.price !== undefined ? `$${service.price}` : null)

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* Sticky top nav */}
      <div className="sticky top-0 z-10 border-b border-slate-100 bg-white/90 backdrop-blur">
        <div className="container-custom py-3.5">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-teal-600"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Services
          </Link>
        </div>
      </div>

      <div className="container-custom py-12 lg:py-16">

        {/* Page header */}
        <div className="mb-10">
          <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-teal-700">
            <BadgeCheck className="h-3.5 w-3.5" /> Service
          </span>
          <h1 className="mb-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            {service.title}
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-slate-600">
            {service.description}
          </p>
        </div>

        {/* Main grid */}
        <div className="grid gap-8 lg:grid-cols-3">

          {/* LEFT: features */}
          <div className="lg:col-span-2 space-y-6">

            {service.features && service.features.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-5 text-lg font-bold text-slate-900">What You Get</h2>
                <ul className="space-y-3">
                  {service.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-700"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-teal-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tech stack */}
            {service.technologies && service.technologies.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-bold text-slate-900">Technologies Used</h2>
                <div className="flex flex-wrap gap-2">
                  {service.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* What's included if no features */}
            {(!service.features || service.features.length === 0) && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-bold text-slate-900">This Service Includes</h2>
                <ul className="space-y-2.5">
                  {[
                    'Requirement analysis and project scoping',
                    'Clean, well-structured code following best practices',
                    'Responsive design for all screen sizes',
                    'Testing across browsers and devices',
                    'Documentation and deployment support',
                    'Post-delivery bug fixing support',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-slate-600">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-teal-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* RIGHT: info card */}
          <aside className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-5 text-base font-bold text-slate-900">Service Overview</h3>

              <div className="space-y-4">
                {displayPrice && (
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                      <DollarSign className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Starting Price
                      </p>
                      <p className="mt-0.5 text-xl font-black text-teal-700">{displayPrice}</p>
                    </div>
                  </div>
                )}

                {service.duration && (
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Typical Delivery
                      </p>
                      <p className="mt-0.5 text-sm font-semibold text-slate-800">
                        {service.duration}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <BadgeCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Support
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-slate-800">
                      Post-delivery support included
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3 border-t border-slate-100 pt-5">
                <Link
                  href="/contact"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-500"
                >
                  Start This Project <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="https://wa.me/8801234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
                >
                  <MessageCircle className="h-4 w-4" /> Ask on WhatsApp
                </a>
              </div>
            </div>

            {/* Other services hint */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="mb-3 text-sm font-semibold text-slate-700">
                Looking for something else?
              </p>
              <p className="mb-4 text-xs leading-relaxed text-slate-500">
                I offer a range of services from small websites to complex platforms. Browse
                all services or contact me with your specific needs.
              </p>
              <Link
                href="/services"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-teal-600 hover:text-teal-500"
              >
                All services <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </aside>
        </div>
      </div>

      {/* Bottom CTA */}
      <section className="bg-teal-600">
        <div className="container-custom py-14 text-center">
          <p className="mb-2 text-xs font-black uppercase tracking-[0.32em] text-teal-200">
            Ready to get started?
          </p>
          <h2 className="mb-4 text-2xl font-black tracking-tight text-white sm:text-3xl">
            Let&apos;s Build This Together
          </h2>
          <p className="mx-auto mb-8 max-w-md text-sm leading-7 text-teal-100">
            Contact me with your project idea and I&apos;ll send a detailed proposal within 24 hours.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-teal-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              Contact Me <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/order-project"
              className="inline-flex items-center gap-2 rounded-full border border-green-500 bg-transparent px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:border-white"
            >
              Order Project
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
