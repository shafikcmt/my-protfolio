import Link from 'next/link'
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Briefcase,
  CheckCircle2,
  Clock,
  Code2,
  Globe,
  Layers3,
  MessageCircle,
  Monitor,
  Server,
  Settings,
  Sparkles,
  Users,
  Wrench,
  Zap,
} from 'lucide-react'
import ServiceCard from '@/components/ServiceCard'
import { SERVICE_LIST } from '@/lib/constants'

// ─── Map a lucide icon + accent color to each service slug ────────────────────

const SERVICE_META: Record<
  string,
  { icon: React.ReactNode; accent: string }
> = {
  'full-stack-web-application-development': {
    icon: <Code2 className="h-5 w-5" />,
    accent: 'bg-teal-50 text-teal-600',
  },
  'laravel-web-application-development': {
    icon: <Server className="h-5 w-5" />,
    accent: 'bg-red-50 text-red-600',
  },
  'mern-stack-development': {
    icon: <Layers3 className="h-5 w-5" />,
    accent: 'bg-sky-50 text-sky-600',
  },
  'nextjs-website-development': {
    icon: <Zap className="h-5 w-5" />,
    accent: 'bg-slate-100 text-slate-700',
  },
  'bug-fixing-performance': {
    icon: <Wrench className="h-5 w-5" />,
    accent: 'bg-amber-50 text-amber-600',
  },
  'project-customization': {
    icon: <Settings className="h-5 w-5" />,
    accent: 'bg-violet-50 text-violet-600',
  },
  'business-website-setup': {
    icon: <Globe className="h-5 w-5" />,
    accent: 'bg-emerald-50 text-emerald-600',
  },
}

const DEFAULT_META = { icon: <Sparkles className="h-5 w-5" />, accent: 'bg-teal-50 text-teal-600' }

// ─── Trust highlights ─────────────────────────────────────────────────────────

const TRUST_ITEMS = [
  { icon: <Briefcase className="h-4 w-4" />,     label: '100+ Projects Delivered' },
  { icon: <Users     className="h-4 w-4" />,     label: '50+ Happy Clients'        },
  { icon: <Clock     className="h-4 w-4" />,     label: 'Response within 24 hours' },
  { icon: <BadgeCheck className="h-4 w-4" />,    label: '5+ Years Experience'      },
]

// ─── Why choose section ────────────────────────────────────────────────────────

const WHY_ITEMS = [
  {
    icon: <CheckCircle2 className="h-5 w-5" />,
    title: 'Production-ready code',
    body: 'Every project is built with clean, scalable code following industry best practices — not a quick prototype.',
    accent: 'bg-teal-50 text-teal-600',
  },
  {
    icon: <MessageCircle className="h-5 w-5" />,
    title: 'Clear communication',
    body: 'Regular progress updates in Bangla or English. No surprises — you always know where your project stands.',
    accent: 'bg-sky-50 text-sky-600',
  },
  {
    icon: <Monitor className="h-5 w-5" />,
    title: 'Mobile-first & responsive',
    body: 'All solutions are tested across desktop, tablet, and mobile so your users get a great experience on any device.',
    accent: 'bg-violet-50 text-violet-600',
  },
  {
    icon: <BookOpen className="h-5 w-5" />,
    title: 'After-delivery support',
    body: 'Bug fixes, small changes, and deployment help even after handover — I stay available for my clients.',
    accent: 'bg-emerald-50 text-emerald-600',
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export const metadata = {
  title: 'Services — Md Shafiqul Islam',
  description:
    'Web development services including Laravel, Next.js, MERN Stack, LMS platforms, dashboards, and more.',
}

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* ═══════════════════════════════════════
          HERO
      ═══════════════════════════════════════ */}
      <section className="border-b border-slate-100 bg-white">
        <div className="container-custom py-16 lg:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-teal-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-teal-700">
              <BadgeCheck className="h-3.5 w-3.5" /> Services
            </span>
            <h1 className="mb-5 text-4xl font-black leading-tight tracking-tight text-slate-900 sm:text-5xl">
              Web Development<br className="hidden sm:block" />
              <span className="text-teal-600"> Services &amp; Solutions</span>
            </h1>
            <p className="mb-8 text-base leading-relaxed text-slate-500 sm:text-lg">
              Tailored web development solutions for startups, businesses, and organizations —
              built with clean code, delivered on time, and supported after launch.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/contact" className="btn-primary gap-2">
                Discuss a Project <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/projects" className="btn-secondary gap-2">
                View Past Work
              </Link>
            </div>
          </div>

          {/* Trust bar */}
          <div className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-3">
            {TRUST_ITEMS.map((item) => (
              <span
                key={item.label}
                className="flex items-center gap-2 text-sm font-semibold text-slate-500"
              >
                <span className="text-teal-500">{item.icon}</span>
                {item.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SERVICE CARDS
      ═══════════════════════════════════════ */}
      <section className="container-custom py-16 lg:py-20">
        <div className="mb-10">
          <span className="mb-3 inline-block text-xs font-bold uppercase tracking-widest text-teal-600">
            What I Offer
          </span>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Available Services
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-500">
            From single-page websites to complex LMS platforms — I build solutions that fit your
            business goals and budget.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICE_LIST.map((service) => {
            const meta = SERVICE_META[service.slug] ?? DEFAULT_META
            return (
              <ServiceCard
                key={service.slug}
                {...service}
                icon={meta.icon}
                accent={meta.accent}
              />
            )
          })}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          WHY CHOOSE ME
      ═══════════════════════════════════════ */}
      <section className="border-y border-slate-100 bg-white py-16 lg:py-20">
        <div className="container-custom">
          <div className="mb-10 text-center">
            <span className="mb-3 inline-block text-xs font-bold uppercase tracking-widest text-teal-600">
              Why Work With Me
            </span>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Quality You Can Count On
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-500">
              Every service is delivered with the same standard of quality — clean code,
              clear communication, and ongoing support.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_ITEMS.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-5"
              >
                <div
                  className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${item.accent}`}
                >
                  {item.icon}
                </div>
                <h3 className="mb-1.5 text-sm font-bold text-slate-900">{item.title}</h3>
                <p className="text-xs leading-relaxed text-slate-500">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          HOW IT WORKS
      ═══════════════════════════════════════ */}
      <section className="container-custom py-16 lg:py-20">
        <div className="mb-10 text-center">
          <span className="mb-3 inline-block text-xs font-bold uppercase tracking-widest text-teal-600">
            Simple Process
          </span>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            How We Work Together
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              step: '01',
              title: 'Share Your Idea',
              body: 'Tell me about your project — goals, features, timeline, and any specific requirements.',
              icon: <MessageCircle className="h-5 w-5" />,
            },
            {
              step: '02',
              title: 'Get a Plan & Quote',
              body: "I'll send a detailed proposal with scope, tech stack, timeline, and pricing within 24 hours.",
              icon: <CheckCircle2 className="h-5 w-5" />,
            },
            {
              step: '03',
              title: 'Build & Update',
              body: 'Development begins with regular updates at every milestone — you stay informed throughout.',
              icon: <Code2 className="h-5 w-5" />,
            },
            {
              step: '04',
              title: 'Launch & Support',
              body: 'Final delivery with documentation, deployment help, and after-launch support included.',
              icon: <Zap className="h-5 w-5" />,
            },
          ].map((step, idx) => (
            <div key={step.step} className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                  {step.icon}
                </div>
                <span className="text-2xl font-black text-slate-100">{step.step}</span>
              </div>
              <h3 className="mb-2 text-sm font-bold text-slate-900">{step.title}</h3>
              <p className="text-xs leading-relaxed text-slate-500">{step.body}</p>
              {idx < 3 && (
                <div className="absolute -right-2 top-1/2 z-10 hidden -translate-y-1/2 lg:block">
                  <div className="flex h-4 w-4 items-center justify-center rounded-full border border-teal-200 bg-white">
                    <ArrowRight className="h-2.5 w-2.5 text-teal-400" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CTA
      ═══════════════════════════════════════ */}
      <section className="bg-teal-600">
        <div className="container-custom py-14 text-center">
          <p className="mb-2 text-xs font-black uppercase tracking-[0.32em] text-teal-200">
            Let&apos;s Build Together
          </p>
          <h2 className="mb-4 text-2xl font-black tracking-tight text-white sm:text-3xl">
            Have a project in mind?
          </h2>
          <p className="mx-auto mb-8 max-w-md text-sm leading-7 text-teal-100">
            Send me your requirements and I&apos;ll get back to you within 24 hours with a
            clear plan and fair quote — no obligation.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-teal-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              Start a Project <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="https://wa.me/8801234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-green-500 bg-transparent px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:border-white"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp Me
            </a>
          </div>
        </div>
      </section>

    </div>
  )
}
