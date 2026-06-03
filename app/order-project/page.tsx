'use client'

import OrderForm from '@/components/OrderForm'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { CalendarDays, CheckCircle, Clock, MessageSquare } from 'lucide-react'

const PROCESS_ITEMS = [
  { icon: <MessageSquare className="h-4 w-4" />, title: 'Share Requirements', text: 'Describe your project goals, budget, and deadline.' },
  { icon: <Clock className="h-4 w-4" />, title: 'Get a Proposal', text: 'Receive a tailored proposal within 24 hours.' },
  { icon: <CheckCircle className="h-4 w-4" />, title: 'Start Development', text: 'After approval, development begins immediately.' },
]

function OrderContent() {
  const searchParams = useSearchParams()
  const project = searchParams.get('project') ?? undefined
  const type = searchParams.get('type') ?? undefined

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <OrderForm initialProject={project} />

      <aside className="space-y-5 lg:sticky lg:top-24 lg:h-fit">
        {/* Info card */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_2px_20px_rgba(15,23,42,0.08)]">
          <h2 className="mb-3 text-base font-bold text-slate-900">How It Works</h2>
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
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_2px_20px_rgba(15,23,42,0.08)]">
          <h3 className="mb-3 text-sm font-bold text-slate-900">What to Include</h3>
          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-teal-500" />
              Project type, category, and purpose
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-teal-500" />
              Budget range and deadline
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-teal-500" />
              Reference links or design files
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-teal-500" />
              Preferred technology stack
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-teal-500" />
              Any special customization requirements
            </li>
          </ul>
        </div>

        {/* Response time */}
        <div className="flex items-start gap-3 rounded-2xl border border-teal-100 bg-teal-50 p-4">
          <CalendarDays className="mt-0.5 h-5 w-5 flex-shrink-0 text-teal-600" />
          <div>
            <p className="text-sm font-semibold text-teal-900">Response within 24 hours</p>
            <p className="mt-0.5 text-xs text-teal-700">
              {type === 'demo'
                ? 'I\'ll send a meeting link to arrange a live demo session.'
                : 'You\'ll receive a detailed proposal with timeline and pricing.'}
            </p>
          </div>
        </div>
      </aside>
    </div>
  )
}

export default function OrderProjectPage() {
  return (
    <div className="container-custom py-16 lg:py-24">
      {/* Header */}
      <div className="mb-10">
        <span className="mb-4 inline-flex rounded-full bg-primary-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary-600">
          Order
        </span>
        <h1 className="mb-3 max-w-2xl text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
          Project Order
        </h1>
        <p className="max-w-xl text-base leading-7 text-slate-500">
          Submit your project brief, budget, deadline, and technology preferences to get a tailored proposal.
        </p>
      </div>

      <Suspense fallback={<div className="text-slate-400 text-sm">Loading…</div>}>
        <OrderContent />
      </Suspense>
    </div>
  )
}
