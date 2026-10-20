import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, CalendarDays, Clock, Download, Globe2, Mail, MessageCircle } from 'lucide-react'
import {
  AUTHOR_EMAIL,
  AVAILABILITY,
  EXPERIENCE_TIMELINE,
  PROJECT_LIST,
  RESUME_URL,
  SITE_NAME,
  SITE_URL,
  SKILL_SECTIONS,
  WHATSAPP_URL,
  WORK_PROCESS,
} from '@/lib/constants'

export const metadata: Metadata = {
  title: `Hire Me — Remote Full Stack Developer | ${SITE_NAME}`,
  description:
    'Hire Md Shafiqul Islam, a remote Full Stack Developer (Laravel, Next.js, MERN) with Garments & Apparel ERP experience. Available for full-time, contract and fixed-price projects.',
  alternates: { canonical: '/hire' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  url: `${SITE_URL}/hire`,
  mainEntity: { '@id': `${SITE_URL}/#person` },
}

const FOCUS = [
  {
    title: 'Garments & Apparel ERP',
    text: 'Merchandising and order tracking (TNA), production line output, store / inventory, commercial export documents, HR and payroll.',
  },
  {
    title: 'Full stack web applications',
    text: 'Laravel and Next.js / MERN apps with secure APIs, role-based dashboards, payments and clean, maintainable code.',
  },
  {
    title: 'Remote-ready collaboration',
    text: 'Clear written English updates, small PRs, documented handover and overlap with EU / US hours when needed.',
  },
]

export default function HirePage() {
  return (
    <div className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="bg-[linear-gradient(140deg,#edf8f7_0%,#f4faf9_45%,#d5eeec_100%)] py-16 lg:py-20">
        <div className="container-custom">
          <span className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-teal-700">
            <span className="h-2 w-2 rounded-full bg-teal-500" /> Available now
          </span>
          <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight text-slate-950 sm:text-5xl">
            Remote Full Stack Developer for ERP &amp; business web apps
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            {AVAILABILITY.status}. 5+ years building Laravel, Next.js and MERN products, with deep experience in the
            garments &amp; apparel industry.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/book-consultation" className="btn-primary px-7 py-3.5 text-sm">
              <span className="relative z-10 inline-flex items-center">
                <CalendarDays className="mr-1.5 h-4 w-4" /> Book a call
              </span>
            </Link>
            <a href={`mailto:${AUTHOR_EMAIL}?subject=Hiring%20inquiry`} className="btn-secondary px-7 py-3.5 text-sm">
              <Mail className="mr-1.5 h-4 w-4" /> Email me
            </a>
            {RESUME_URL && (
              <a href={RESUME_URL} target="_blank" rel="noreferrer" className="btn-secondary px-7 py-3.5 text-sm">
                <Download className="mr-1.5 h-4 w-4" /> Download CV
              </a>
            )}
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="btn-secondary px-7 py-3.5 text-sm">
              <MessageCircle className="mr-1.5 h-4 w-4" /> WhatsApp
            </a>
          </div>
          <dl className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white bg-white/80 p-4 shadow-sm">
              <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                <Globe2 className="h-4 w-4 text-teal-600" /> Timezone
              </dt>
              <dd className="mt-1 text-sm font-semibold text-slate-900">{AVAILABILITY.timezone}</dd>
            </div>
            <div className="rounded-2xl border border-white bg-white/80 p-4 shadow-sm">
              <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                <Clock className="h-4 w-4 text-teal-600" /> Response
              </dt>
              <dd className="mt-1 text-sm font-semibold text-slate-900">{AVAILABILITY.responseTime}</dd>
            </div>
            <div className="rounded-2xl border border-white bg-white/80 p-4 shadow-sm">
              <dt className="text-xs font-bold uppercase tracking-wider text-slate-500">Engagement</dt>
              <dd className="mt-1 text-sm font-semibold text-slate-900">{AVAILABILITY.engagements.join(' · ')}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="py-16">
        <div className="container-custom">
          <h2 className="text-2xl font-black text-slate-950 sm:text-3xl">What I do best</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {FOCUS.map((f) => (
              <div key={f.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="font-bold text-slate-950">{f.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f5f8f7] py-16">
        <div className="container-custom">
          <h2 className="text-2xl font-black text-slate-950 sm:text-3xl">Tech stack</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SKILL_SECTIONS.map((s) => (
              <div key={s.category} className="rounded-2xl border border-slate-200 bg-white p-5">
                <h3 className="text-sm font-bold uppercase tracking-wider text-teal-700">{s.category}</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {s.items.map((i) => (
                    <span key={i} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      {i}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-custom">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-2xl font-black text-slate-950 sm:text-3xl">Selected projects</h2>
            <Link href="/projects" className="text-sm font-bold text-teal-700 hover:underline">
              All projects <ArrowRight className="inline h-4 w-4" />
            </Link>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {PROJECT_LIST.slice(0, 3).map((p) => (
              <Link
                key={p.slug}
                href={`/projects/${p.slug}`}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md"
              >
                <h3 className="font-bold text-slate-950">{p.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{p.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f5f8f7] py-16">
        <div className="container-custom">
          <h2 className="text-2xl font-black text-slate-950 sm:text-3xl">Experience</h2>
          <ol className="mt-8 space-y-4">
            {EXPERIENCE_TIMELINE.map((e) => (
              <li key={e.company} className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-bold text-slate-950">
                    {e.role} · {e.company}
                  </h3>
                  <span className="text-xs font-semibold text-slate-500">{e.period}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{e.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-16">
        <div className="container-custom">
          <h2 className="text-2xl font-black text-slate-950 sm:text-3xl">How we will work together</h2>
          <ol className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {WORK_PROCESS.slice(0, 4).map((w, i) => (
              <li key={w.title} className="rounded-2xl border border-slate-200 bg-white p-5">
                <span className="text-xs font-black text-teal-600">0{i + 1}</span>
                <h3 className="mt-1 font-bold text-slate-950">{w.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{w.description}</p>
              </li>
            ))}
          </ol>
          <div className="mt-12 rounded-3xl bg-slate-950 p-8 text-center text-white">
            <h2 className="text-2xl font-black">Have a role or project in mind?</h2>
            <p className="mx-auto mt-2 max-w-xl text-slate-300">
              Send a short brief and I will reply with questions, a rough plan and timeline within 24 hours.
            </p>
            <Link href="/contact" className="btn-primary mt-6 inline-flex px-7 py-3.5 text-sm">
              <span className="relative z-10 inline-flex items-center">
                Start the conversation <ArrowRight className="ml-1.5 h-4 w-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
