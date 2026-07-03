'use client'

import OrderForm from '@/components/OrderForm'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import {
  ArrowRight, BadgeCheck, Briefcase, CalendarDays,
  CheckCircle, Clock, MessageSquare,
} from 'lucide-react'

const PROCESS_ITEMS = [
  { icon: <MessageSquare className="h-4 w-4" />, title: 'Share Requirements', text: 'Describe your project goals, budget, and deadline.' },
  { icon: <Clock className="h-4 w-4" />,         title: 'Get a Proposal',      text: 'Receive a tailored proposal within 24 hours.'       },
  { icon: <CheckCircle className="h-4 w-4" />,   title: 'Start Development',   text: 'After approval, development begins immediately.'    },
]

const TRUST_ITEMS = [
  { icon: <Briefcase className="h-4 w-4" />,    label: 'Custom Projects'       },
  { icon: <Clock className="h-4 w-4" />,        label: 'Proposal in 24 Hours'  },
  { icon: <BadgeCheck className="h-4 w-4" />,   label: 'On-time Delivery'      },
  { icon: <MessageSquare className="h-4 w-4" />, label: 'Direct Communication' },
]

function OrderContent() {
  const searchParams = useSearchParams()
  const project = searchParams.get('project') ?? undefined
  const type = searchParams.get('type') ?? undefined

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <OrderForm initialProject={project} />

      <aside className="h-fit space-y-5 lg:sticky lg:top-24">

        {/* How it works */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-base font-bold text-slate-900">How It Works</h2>
          <ul className="space-y-4">
            {PROCESS_ITEMS.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-600">
                  {item.icon}
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <p className="text-xs leading-5 text-slate-500">{item.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* What to include */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-3 text-sm font-bold text-slate-900">What to Include</h3>
          <ul className="space-y-2 text-xs text-slate-600">
            {[
              'Project type, category, and purpose',
              'Budget range and deadline',
              'Reference links or design files',
              'Preferred technology stack',
              'Any special customization requirements',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-teal-500" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Response time */}
        <div className="flex items-start gap-3 rounded-2xl border border-teal-100 bg-teal-50 p-4">
          <CalendarDays className="mt-0.5 h-5 w-5 flex-shrink-0 text-teal-600" />
          <div>
            <p className="text-sm font-semibold text-teal-900">Response within 24 hours</p>
            <p className="mt-0.5 text-xs text-teal-700">
              {type === 'demo'
                ? "I'll send a meeting link to arrange a live demo session."
                : "You'll receive a detailed proposal with timeline and pricing."}
            </p>
          </div>
        </div>
      </aside>
    </div>
  )
}

export default function OrderProjectPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* ── Hero ── */}
      <section className="border-b border-slate-100 bg-white">
        <div className="container-custom py-14 lg:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-teal-50 px-4 py-1.5 text-xs font-black uppercase tracking-[0.32em] text-teal-700">
              <BadgeCheck className="h-3.5 w-3.5" />
              Order a Project
            </div>
            <h1 className="mb-4 text-3xl font-black leading-[1.15] tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
              Let&apos;s Build Your <span className="text-teal-600">Next Project</span>
            </h1>
            <p className="mx-auto mb-8 max-w-xl text-base leading-7 text-slate-500">
              Submit your project brief, budget, deadline, and technology preferences to get a
              tailored proposal within 24 hours.
            </p>

            {/* Trust bar */}
            <div className="inline-flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
              {TRUST_ITEMS.map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                  <span className="text-teal-500">{icon}</span>
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Content grid ── */}
      <section className="container-custom py-12 lg:py-16">
        <Suspense fallback={<div className="text-sm text-slate-400">Loading…</div>}>
          <OrderContent />
        </Suspense>
      </section>

      {/* ── CTA block ── */}
      <section className="bg-teal-600">
        <div className="container-custom py-14 text-center">
          <p className="mb-2 text-xs font-black uppercase tracking-[0.32em] text-teal-200">
            Looking for something ready-made?
          </p>
          <h2 className="mb-4 text-2xl font-black tracking-tight text-white sm:text-3xl">
            Browse Ready-Made Projects
          </h2>
          <p className="mx-auto mb-8 max-w-md text-sm leading-7 text-teal-100">
            Get a fully built, customizable project delivered faster and at a lower cost.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/projects" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-teal-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              View Projects <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-full border border-green-500 bg-transparent px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:border-white">
              Contact Me First
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
