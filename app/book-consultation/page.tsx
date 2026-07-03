'use client'

import BookingForm from '@/components/BookingForm'
import Link from 'next/link'
import { ArrowRight, BadgeCheck, BookOpen, CalendarDays, CheckCircle, Clock, MessageSquare, Users, Video } from 'lucide-react'

const INCLUDES = [
  { icon: <Clock className="h-4 w-4" />, text: '60-minute focused session (extendable)' },
  { icon: <MessageSquare className="h-4 w-4" />, text: 'Real-time Q&A and technical discussion' },
  { icon: <BookOpen className="h-4 w-4" />, text: 'Action plan and follow-up notes shared' },
  { icon: <Users className="h-4 w-4" />, text: 'Team or individual training available' },
  { icon: <CheckCircle className="h-4 w-4" />, text: 'Available in Bangla and English' },
]

const TOPICS = [
  'Project development planning',
  'Web development course guidance',
  'LMS & e-learning implementation',
  'Live training program for teams',
  'Bug fixing & code review',
  'Career roadmap & mentoring',
]

const TRUST_ITEMS = [
  { icon: <CalendarDays className="h-4 w-4" />, label: 'Flexible Scheduling' },
  { icon: <Video className="h-4 w-4" />,        label: 'Google Meet / Zoom' },
  { icon: <Clock className="h-4 w-4" />,        label: '24h Confirmation'  },
  { icon: <BadgeCheck className="h-4 w-4" />,   label: '5+ Years Experience' },
]

export default function BookConsultationPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* ── Hero ── */}
      <section className="border-b border-slate-100 bg-white">
        <div className="container-custom py-14 lg:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-teal-50 px-4 py-1.5 text-xs font-black uppercase tracking-[0.32em] text-teal-700">
              <BadgeCheck className="h-3.5 w-3.5" />
              Consultation
            </div>
            <h1 className="mb-4 text-3xl font-black leading-[1.15] tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
              Book a <span className="text-teal-600">Free</span> Consultation
            </h1>
            <p className="mx-auto mb-8 max-w-xl text-base leading-7 text-slate-500">
              Arrange a live session to discuss your project, training needs, or LMS roadmap with a
              hands-on web developer and trainer.
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
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">

          {/* Form */}
          <BookingForm />

          {/* Info sidebar */}
          <aside className="h-fit space-y-5 lg:sticky lg:top-24">

            {/* Trainer card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-2xl font-black text-teal-700">
                  S
                </div>
                <div>
                  <p className="font-bold text-slate-900">Md Shafiqul Islam</p>
                  <p className="text-xs text-slate-500">Full Stack Developer &amp; Trainer</p>
                </div>
              </div>
              <p className="text-sm leading-6 text-slate-600">
                5+ years of professional experience in Laravel, MERN, and Next.js development.
                Trained 200+ students in hands-on web development programs.
              </p>
            </div>

            {/* What's included */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-sm font-bold text-slate-900">What&apos;s Included</h3>
              <ul className="space-y-3">
                {INCLUDES.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="mt-0.5 text-teal-600">{item.icon}</span>
                    <span className="text-sm text-slate-600">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Common topics */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-3 text-sm font-bold text-slate-900">Common Topics</h3>
              <div className="flex flex-wrap gap-2">
                {TOPICS.map((topic) => (
                  <span
                    key={topic}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            {/* Response time */}
            <div className="flex items-start gap-3 rounded-2xl border border-teal-100 bg-teal-50 p-4">
              <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-teal-600" />
              <div>
                <p className="text-sm font-semibold text-teal-900">Response within 24 hours</p>
                <p className="mt-0.5 text-xs text-teal-700">
                  After submitting, I&apos;ll confirm your session with a meeting link via email or WhatsApp.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* ── CTA block ── */}
      <section className="bg-teal-600">
        <div className="container-custom py-14 text-center">
          <p className="mb-2 text-xs font-black uppercase tracking-[0.32em] text-teal-200">
            Not sure yet?
          </p>
          <h2 className="mb-4 text-2xl font-black tracking-tight text-white sm:text-3xl">
            Explore Services or View Projects First
          </h2>
          <p className="mx-auto mb-8 max-w-md text-sm leading-7 text-teal-100">
            Browse what I offer or check out past work before booking — no pressure.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/services" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-teal-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              View Services <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/projects" className="inline-flex items-center gap-2 rounded-full border border-green-500 bg-transparent px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:border-white">
              Browse Projects
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
