'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  Cpu,
  Info,
  Layers,
  LayoutDashboard,
  Loader2,
  ScanLine,
  Settings2,
  ShieldCheck,
  Tv,
  Workflow,
} from 'lucide-react'
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal'
import type { ProjectMarketingProfile } from '@/lib/projectMarketing'

/* ── shared bits ─────────────────────────────────────────────────────────── */

function SectionShell({
  id,
  eyebrow,
  title,
  children,
}: {
  id?: string
  eyebrow: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-28">
      <Reveal>
        <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-teal-600">
          <span className="h-px w-6 bg-teal-500" />
          {eyebrow}
        </p>
        <h2 className="mb-5 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">{title}</h2>
      </Reveal>
      {children}
    </section>
  )
}

const INTEREST_EVENT = 'protrac-interest'

export type EnquiryInterest = 'demo' | 'quotation' | 'requirements' | 'other'

/** Anchor link to the enquiry form that also preselects the "interested in" option. */
export function EnquiryLink({
  interest,
  className,
  children,
}: {
  interest: EnquiryInterest
  className?: string
  children: React.ReactNode
}) {
  return (
    <a
      href="#enquiry"
      className={className}
      onClick={() => window.dispatchEvent(new CustomEvent(INTEREST_EVENT, { detail: interest }))}
    >
      {children}
    </a>
  )
}

/* ── hero highlights ─────────────────────────────────────────────────────── */

const HIGHLIGHT_ICONS = [Layers, BarChart3, ScanLine, Tv]

export function HeroHighlights({ items }: { items: ProjectMarketingProfile['highlights'] }) {
  return (
    <Stagger className="mt-9 grid gap-3 sm:grid-cols-2 xl:grid-cols-4" stagger={0.08} delayChildren={0.15}>
      {items.map((item, i) => {
        const Icon = HIGHLIGHT_ICONS[i % HIGHLIGHT_ICONS.length]
        return (
          <StaggerItem key={item.title}>
            <div className="flex h-full items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-teal-400/10 text-teal-300 ring-1 ring-teal-400/30">
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white">{item.title}</p>
                <p className="mt-0.5 text-xs leading-5 text-slate-400">{item.text}</p>
              </div>
            </div>
          </StaggerItem>
        )
      })}
    </Stagger>
  )
}

/* ── about (business value first) ────────────────────────────────────────── */

export function AboutBusiness({ paragraphs }: { paragraphs: string[] }) {
  return (
    <SectionShell eyebrow="About ProTrac" title="Production visibility from cutting to finishing">
      <Reveal>
        <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-6 text-[15px] leading-7 text-slate-600 shadow-[0_2px_16px_rgba(15,23,42,0.07)]">
          {paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </Reveal>
    </SectionShell>
  )
}

/* ── features ────────────────────────────────────────────────────────────── */

const FEATURE_ICONS = [ScanLine, LayoutDashboard, Layers, BarChart3, ShieldCheck, Workflow, Tv, BarChart3, Settings2]

export function FeatureGrid({ features }: { features: ProjectMarketingProfile['features'] }) {
  return (
    <SectionShell eyebrow="Features" title="What ProTrac does for your production floor">
      <Stagger className="grid gap-4 sm:grid-cols-2" stagger={0.06}>
        {features.map((f, i) => {
          const Icon = FEATURE_ICONS[i % FEATURE_ICONS.length]
          return (
            <StaggerItem key={f.title}>
              <div className="flex h-full gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_2px_16px_rgba(15,23,42,0.07)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_36px_rgba(15,23,42,0.10)]">
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600 ring-1 ring-teal-100">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <h3 className="text-sm font-black text-slate-900">{f.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{f.description}</p>
                </div>
              </div>
            </StaggerItem>
          )
        })}
      </Stagger>
    </SectionShell>
  )
}

/* ── benefits ────────────────────────────────────────────────────────────── */

export function Benefits({
  heading,
  items,
}: {
  heading: string
  items: ProjectMarketingProfile['benefits']
}) {
  return (
    <SectionShell eyebrow="Benefits" title={heading}>
      <Stagger className="grid gap-4 sm:grid-cols-2" stagger={0.06}>
        {items.map((b) => (
          <StaggerItem key={b.title}>
            <div className="flex h-full items-start gap-3 rounded-2xl border border-slate-200/80 bg-white p-5">
              <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-teal-600" />
              <div>
                <h3 className="text-sm font-black text-slate-900">{b.title}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">{b.text}</p>
              </div>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </SectionShell>
  )
}

/* ── case study framing ──────────────────────────────────────────────────── */

export function ImplementationNote({
  example,
  flexibility,
}: {
  example: ProjectMarketingProfile['exampleImplementation']
  flexibility: ProjectMarketingProfile['productFlexibility']
}) {
  return (
    <Reveal>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5">
          <p className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-amber-700">
            <Info className="h-4 w-4" /> {example.heading}
          </p>
          <p className="text-sm leading-6 text-slate-700">{example.text}</p>
        </div>
        <div className="rounded-2xl border border-teal-200 bg-teal-50/70 p-5">
          <p className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-teal-700">
            <Settings2 className="h-4 w-4" /> {flexibility.heading}
          </p>
          <ul className="space-y-1.5 text-sm leading-6 text-slate-700">
            {flexibility.points.map((p) => (
              <li key={p} className="flex items-start gap-2">
                <CheckCircle2 className="mt-1 h-3.5 w-3.5 flex-shrink-0 text-teal-600" />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Reveal>
  )
}

export function ConceptualNotice({ text }: { text: string }) {
  return (
    <p className="mb-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-800">
      <Info className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
      {text}
    </p>
  )
}

/* ── technical architecture ──────────────────────────────────────────────── */

export function TechnicalArchitecture({
  technical,
  description,
}: {
  technical: ProjectMarketingProfile['technical']
  description?: string
}) {
  return (
    <SectionShell eyebrow="For IT teams" title="Technical Architecture">
      <Reveal>
        <div className="space-y-5 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_2px_16px_rgba(15,23,42,0.07)]">
          <p className="text-sm leading-7 text-slate-600">{technical.intro}</p>
          <div className="flex flex-wrap gap-2">
            {technical.stack.map((t) => (
              <span key={t} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                {t}
              </span>
            ))}
          </div>
          <ul className="grid gap-2 sm:grid-cols-2">
            {technical.deployment.map((d) => (
              <li key={d} className="flex items-start gap-2 text-sm text-slate-700">
                <Cpu className="mt-0.5 h-4 w-4 flex-shrink-0 text-teal-600" />
                {d}
              </li>
            ))}
          </ul>
          {description && (
            <div className="border-t border-slate-100 pt-4">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">Implementation notes</p>
              <p className="whitespace-pre-line text-sm leading-7 text-slate-600">{description}</p>
            </div>
          )}
          <p className="flex items-start gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-500">
            <Info className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
            {technical.notClaimed}
          </p>
        </div>
      </Reveal>
    </SectionShell>
  )
}

/* ── pricing ─────────────────────────────────────────────────────────────── */

export function PricingCta({ pricing }: { pricing: ProjectMarketingProfile['pricing'] }) {
  return (
    <Reveal>
      <div className="relative overflow-hidden rounded-2xl bg-slate-950 p-7 text-center sm:p-9">
        <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-teal-500/20 blur-3xl" />
        <div className="relative">
          <h2 className="text-xl font-black text-white sm:text-2xl">{pricing.heading}</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-300">{pricing.text}</p>
          <EnquiryLink
            interest="quotation"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-teal-500 px-6 py-3 text-sm font-bold text-slate-950 shadow-[0_10px_30px_rgba(20,184,166,0.35)] transition hover:-translate-y-0.5 hover:bg-teal-400"
          >
            {pricing.cta} <ArrowRight className="h-4 w-4" />
          </EnquiryLink>
        </div>
      </div>
    </Reveal>
  )
}

/* ── FAQ ─────────────────────────────────────────────────────────────────── */

export function FaqAccordion({ items }: { items: ProjectMarketingProfile['faq'] }) {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <SectionShell eyebrow="FAQ" title="Frequently Asked Questions">
      <div className="space-y-2">
        {items.map((item, i) => {
          const isOpen = open === i
          return (
            <div key={item.question} className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
              <h3>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                  id={`faq-button-${i}`}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-bold text-slate-900 transition hover:bg-slate-50"
                >
                  {item.question}
                  <ChevronDown className={`h-4 w-4 flex-shrink-0 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
              </h3>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`faq-panel-${i}`}
                    role="region"
                    aria-labelledby={`faq-button-${i}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-sm leading-7 text-slate-600">{item.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </SectionShell>
  )
}

/* ── enquiry form (posts to the existing /api/contact flow) ──────────────── */

const INTEREST_LABELS: Record<EnquiryInterest, string> = {
  demo: 'Live demo',
  quotation: 'Custom quotation',
  requirements: 'Factory requirements discussion',
  other: 'Other',
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const EMPTY = {
  name: '',
  company: '',
  designation: '',
  email: '',
  phone: '',
  location: '',
  lines: '',
  message: '',
  website: '', // honeypot, real users never fill this
}

const inputClass =
  'w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20'

function Field({
  id,
  label,
  required,
  error,
  hint,
  children,
}: {
  id: string
  label: string
  required?: boolean
  error?: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-bold text-slate-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-[11px] text-slate-400">{hint}</p>}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-[11px] font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}

export function EnquiryForm({ projectTitle }: { projectTitle: string }) {
  const [form, setForm] = useState(EMPTY)
  const [interest, setInterest] = useState<EnquiryInterest>('demo')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  useEffect(() => {
    const onInterest = (e: Event) => {
      const value = (e as CustomEvent<EnquiryInterest>).detail
      if (value && value in INTEREST_LABELS) setInterest(value)
    }
    window.addEventListener(INTEREST_EVENT, onInterest)
    return () => window.removeEventListener(INTEREST_EVENT, onInterest)
  }, [])

  const set = (name: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [name]: e.target.value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const next: Record<string, string> = {}
    if (!form.name.trim()) next.name = 'Please enter your full name.'
    if (!form.company.trim()) next.company = 'Please enter your company or factory name.'
    if (!form.email.trim()) next.email = 'Please enter your business email.'
    else if (!EMAIL_RE.test(form.email.trim())) next.email = 'Please enter a valid email address.'
    if (form.phone.trim() && !/^[+()\d\s-]{6,20}$/.test(form.phone.trim())) next.phone = 'Please enter a valid phone number.'
    if (form.lines.trim() && !/^\d{1,4}$/.test(form.lines.trim())) next.lines = 'Enter a number, or leave blank.'
    if (form.message.trim().length < 10) next.message = 'Please describe your requirements (at least 10 characters).'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setResult(null)
    if (!validate()) return

    const details = [
      `Interested in: ${INTEREST_LABELS[interest]}`,
      `Product: ${projectTitle}`,
      `Company / Factory: ${form.company.trim()}`,
      form.designation.trim() ? `Designation: ${form.designation.trim()}` : '',
      form.location.trim() ? `Factory location: ${form.location.trim()}` : '',
      form.lines.trim() ? `Production lines: ${form.lines.trim()}` : '',
    ].filter(Boolean)
    const message = `${details.join('\n')}\n\n${form.message.trim()}`

    setLoading(true)
    try {
      const { data } = await axios.post('/api/contact', {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        inquiryType: 'project_inquiry',
        serviceNeeded: 'ProTrac',
        subject: `ProTrac enquiry (${INTEREST_LABELS[interest]}) - ${form.company.trim()}`,
        message,
        website: form.website,
      })
      if (data?.success) {
        setResult({ type: 'success', message: "Thank you! Your enquiry has been received. I'll reply within 24 hours." })
        setForm(EMPTY)
      } else {
        setResult({ type: 'error', message: data?.message || 'Something went wrong. Please try again.' })
      }
    } catch (err: any) {
      setResult({
        type: 'error',
        message:
          err?.response?.status === 429
            ? 'Too many requests. Please wait a few minutes and try again.'
            : err?.response?.data?.message || 'Could not send your enquiry. Please try again or use WhatsApp.',
      })
    } finally {
      setLoading(false)
    }
  }

  const describedBy = (id: string) => (errors[id] ? `${id}-error` : undefined)

  return (
    <SectionShell id="enquiry" eyebrow="Get in touch" title="Request a Demo or Custom Quotation">
      <Reveal>
        <form
          onSubmit={onSubmit}
          noValidate
          className="relative rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_2px_16px_rgba(15,23,42,0.07)] sm:p-7"
        >
          {/* honeypot */}
          <input
            type="text"
            name="website"
            value={form.website}
            onChange={set('website')}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute left-[-9999px] h-0 w-0 opacity-0"
          />

          <div className="mb-5">
            <label htmlFor="pt-interest" className="mb-1.5 block text-xs font-bold text-slate-700">
              I am interested in
            </label>
            <select
              id="pt-interest"
              value={interest}
              onChange={(e) => setInterest(e.target.value as EnquiryInterest)}
              className={inputClass}
            >
              {(Object.keys(INTEREST_LABELS) as EnquiryInterest[]).map((k) => (
                <option key={k} value={k}>
                  {INTEREST_LABELS[k]}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="pt-name" label="Full name" required error={errors.name}>
              <input id="pt-name" value={form.name} onChange={set('name')} autoComplete="name" aria-invalid={!!errors.name} aria-describedby={describedBy('name')} className={inputClass} />
            </Field>
            <Field id="pt-company" label="Company / factory name" required error={errors.company}>
              <input id="pt-company" value={form.company} onChange={set('company')} autoComplete="organization" aria-invalid={!!errors.company} aria-describedby={describedBy('company')} className={inputClass} />
            </Field>
            <Field id="pt-designation" label="Job designation">
              <input id="pt-designation" value={form.designation} onChange={set('designation')} autoComplete="organization-title" placeholder="e.g. Production Manager" className={inputClass} />
            </Field>
            <Field id="pt-email" label="Business email" required error={errors.email}>
              <input id="pt-email" type="email" inputMode="email" value={form.email} onChange={set('email')} autoComplete="email" aria-invalid={!!errors.email} aria-describedby={describedBy('email')} className={inputClass} />
            </Field>
            <Field id="pt-phone" label="Phone / WhatsApp" error={errors.phone}>
              <input id="pt-phone" type="tel" inputMode="tel" value={form.phone} onChange={set('phone')} autoComplete="tel" aria-invalid={!!errors.phone} aria-describedby={describedBy('phone')} className={inputClass} />
            </Field>
            <Field id="pt-location" label="Factory location">
              <input id="pt-location" value={form.location} onChange={set('location')} autoComplete="address-level2" placeholder="City / industrial area" className={inputClass} />
            </Field>
            <Field id="pt-lines" label="Number of production lines (optional)" error={errors.lines} hint="Any size is fine. An estimate helps me prepare.">
              <input id="pt-lines" inputMode="numeric" value={form.lines} onChange={set('lines')} aria-invalid={!!errors.lines} aria-describedby={describedBy('lines')} className={inputClass} />
            </Field>
          </div>

          <div className="mt-4">
            <Field id="pt-message" label="Requirements / message" required error={errors.message}>
              <textarea
                id="pt-message"
                rows={5}
                value={form.message}
                onChange={set('message')}
                aria-invalid={!!errors.message}
                aria-describedby={describedBy('message')}
                placeholder="Tell me about your production floor, what you want to monitor and any special workflow."
                className={inputClass}
              />
            </Field>
          </div>

          <div aria-live="polite" className="mt-4">
            {result && (
              <p
                role={result.type === 'error' ? 'alert' : 'status'}
                className={`flex items-start gap-2 rounded-xl px-3.5 py-3 text-sm ${
                  result.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-700'
                }`}
              >
                {result.type === 'success' ? <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" /> : <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />}
                {result.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-teal-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-teal-500 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
            {loading ? 'Sending...' : 'Send Enquiry'}
          </button>
          <p className="mt-3 text-[11px] leading-5 text-slate-400">
            Your details are sent privately to the site owner and are never shown publicly.
          </p>
        </form>
      </Reveal>
    </SectionShell>
  )
}
