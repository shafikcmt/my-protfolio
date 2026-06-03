'use client'

import BookingForm from '@/components/BookingForm'
import { CalendarDays, Clock, MessageSquare, BookOpen, Users, CheckCircle } from 'lucide-react'

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

export default function BookConsultationPage() {
  return (
    <div className="container-custom py-16 lg:py-24">
      {/* Header */}
      <div className="mb-12">
        <span className="mb-4 inline-flex rounded-full bg-teal-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-teal-700">
          Consultation
        </span>
        <h1 className="mb-3 max-w-2xl text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
          Book a Consultation
        </h1>
        <p className="max-w-xl text-base leading-7 text-slate-500">
          Arrange a live session to discuss your project, training needs, or LMS roadmap with a
          hands-on web developer and trainer.
        </p>
      </div>

      {/* Content grid */}
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Form */}
        <BookingForm />

        {/* Info sidebar */}
        <aside className="space-y-5 h-fit lg:sticky lg:top-24">
          {/* Trainer card */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_2px_20px_rgba(15,23,42,0.08)]">
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
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_2px_20px_rgba(15,23,42,0.08)]">
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
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_2px_20px_rgba(15,23,42,0.08)]">
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
    </div>
  )
}
