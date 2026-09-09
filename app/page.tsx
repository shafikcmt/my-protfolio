'use client'

import Link from 'next/link'
import ProjectsSection from '@/components/sections/ProjectsSection'
import { useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal'
import { useGsap } from '@/components/motion/useGsap'
import {
  PROJECT_LIST,
  SERVICE_LIST,
  TESTIMONIALS_LIST,
  COURSE_LIST,
  WORK_PROCESS,
  WHY_CHOOSE_ME,
  FAQ_LIST,
  LIVE_TRAINING_INFO,
} from '@/lib/constants'
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BookOpen,
  Briefcase,
  ChevronDown,
  Code2,
  GraduationCap,
  Layers3,
  MessageCircle,
  Monitor,
  Rocket,
  ShieldCheck,
  Smartphone,
  Star,
  Target,
  Users,
  Zap,
} from 'lucide-react'

// ─── WhatsApp link ────────────────────────────────────────────────────────────
const WA = 'https://wa.me/8801234567890'

// ─── Why Choose Me icon + accent map (keyed by title) ────────────────────────
const WHY_ICON_MAP: Record<string, { icon: React.ReactNode; accent: string }> = {
  'Practical Project Experience': { icon: <Rocket     className="h-5 w-5" />, accent: 'bg-teal-50 text-teal-600'    },
  'Bangla & English Support':     { icon: <MessageCircle className="h-5 w-5" />, accent: 'bg-sky-50 text-sky-600'   },
  'Business-Focused Solutions':   { icon: <Target     className="h-5 w-5" />, accent: 'bg-violet-50 text-violet-600' },
  'After-Delivery Support':       { icon: <ShieldCheck className="h-5 w-5" />, accent: 'bg-emerald-50 text-emerald-600' },
  'Mobile Responsive Design':     { icon: <Smartphone className="h-5 w-5" />, accent: 'bg-blue-50 text-blue-600'    },
  'Fast & Clean Code':            { icon: <Zap        className="h-5 w-5" />, accent: 'bg-amber-50 text-amber-600'  },
}

// ─── Quick Value data ─────────────────────────────────────────────────────────
const QUICK_VALUE = [
  { icon: Layers3,     label: 'Ready Projects', desc: 'Pre-built solutions for your business',  href: '#ready-projects', accent: 'bg-teal-50 text-teal-700'   },
  { icon: Code2,       label: 'Custom Build',   desc: 'Full-stack websites built from scratch', href: '/contact',        accent: 'bg-indigo-50 text-indigo-700' },
  { icon: BookOpen,    label: 'Web Courses',     desc: 'Learn Laravel, MERN & Next.js',         href: '/courses',        accent: 'bg-purple-50 text-purple-700' },
  { icon: GraduationCap, label: 'Live Training', desc: 'Online batches with live mentoring',    href: '#training',       accent: 'bg-amber-50 text-amber-700'   },
]

// ─── WhatsApp SVG icon ────────────────────────────────────────────────────────
function WaIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.526 5.847L0 24l6.326-1.497A11.956 11.956 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.808 9.808 0 01-5.017-1.376l-.36-.214-3.732.883.915-3.64-.234-.374A9.771 9.771 0 012.182 12C2.182 6.575 6.575 2.182 12 2.182S21.818 6.575 21.818 12 17.425 21.818 12 21.818z" />
    </svg>
  )
}

// ─── Browser Mockup — portfolio fallback thumbnail ───────────────────────────
function ProjectMockup({ technologies }: { technologies?: string[] }) {
  return (
    <div className="flex h-full flex-col overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950">
      <div className="flex flex-shrink-0 items-center gap-2 border-b border-slate-700/50 bg-slate-800/90 px-3 py-2">
        <div className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-red-400/70" />
          <span className="h-2 w-2 rounded-full bg-amber-400/70" />
          <span className="h-2 w-2 rounded-full bg-green-400/70" />
        </div>
        <div className="mx-2 flex flex-1 items-center gap-1.5 rounded bg-slate-700/50 px-2 py-0.5">
          <span className="h-1.5 w-1.5 rounded-full bg-teal-500/60" />
          <span className="text-[9px] text-slate-500">localhost:3000</span>
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="flex w-12 flex-col items-center gap-2 border-r border-slate-800/70 bg-slate-900/90 py-3">
          <div className="h-5 w-5 rounded-lg bg-gradient-to-br from-teal-500 to-teal-700" />
          <div className="mt-1 flex flex-col gap-1.5">
            <div className="h-2 w-7 rounded bg-teal-700/50" />
            <div className="h-2 w-7 rounded bg-slate-700/40" />
            <div className="h-2 w-7 rounded bg-slate-700/40" />
          </div>
        </div>
        <div className="flex-1 p-3">
          <div className="mb-2 grid grid-cols-3 gap-1.5">
            <div className="rounded-lg bg-teal-900/40 p-2">
              <div className="h-1.5 w-full rounded bg-teal-700/60" />
              <div className="mt-1.5 h-3 w-2/3 rounded bg-teal-500/30" />
            </div>
            {[0, 1].map((i) => (
              <div key={i} className="rounded-lg bg-slate-800/70 p-2">
                <div className="h-1.5 w-full rounded bg-slate-600/60" />
                <div className="mt-1.5 h-3 w-2/3 rounded bg-slate-500/30" />
              </div>
            ))}
          </div>
          <div className="space-y-1.5">
            {[true, false, false].map((a, i) => (
              <div key={i} className="flex items-center gap-2 rounded-lg bg-slate-800/60 p-1.5">
                <div className={`h-3.5 w-3.5 flex-shrink-0 rounded ${a ? 'bg-teal-700/70' : 'bg-slate-700/60'}`} />
                <div className="h-2 flex-1 rounded bg-slate-600/50" />
                <div className={`h-3 w-6 flex-shrink-0 rounded-full ${a ? 'bg-green-800/50' : 'bg-slate-700/40'}`} />
              </div>
            ))}
          </div>
        </div>
      </div>
      {technologies && technologies.length > 0 && (
        <div className="flex flex-wrap gap-1 border-t border-slate-800/60 px-3 py-2">
          {technologies.slice(0, 3).map((t) => (
            <span key={t} className="rounded-full bg-teal-900/50 px-2 py-0.5 text-[9px] font-bold text-teal-400">
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── FAQ Item ─────────────────────────────────────────────────────────────────
function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className={`overflow-hidden rounded-2xl border bg-white transition-colors duration-300 ${
        open ? 'border-teal-200 shadow-[0_10px_30px_rgba(15,118,110,0.08)]' : 'border-slate-200'
      }`}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left"
        aria-expanded={open}
      >
        <span className="text-sm font-bold text-slate-900">{question}</span>
        <ChevronDown
          className={`h-4 w-4 flex-shrink-0 text-teal-600 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-slate-100 px-6 pb-5 pt-4">
              <p className="text-sm leading-7 text-slate-600">{answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  // Guard against browser scroll restoration landing on the Projects section.
  // Runs before first paint (useLayoutEffect) so there is no visible flash.
  // Only scrolls to top when the URL has no hash; hash links like /#ready-projects
  // are allowed to scroll to their target normally.
  useLayoutEffect(() => {
    if (!window.location.hash) {
      window.scrollTo(0, 0)
    }
  }, [])

  const pageRef = useRef<HTMLDivElement>(null)

  // ── Hero entrance timeline + magnetic CTA + scrubbed process connector ──
  useGsap(pageRef, (gsap) => {
    // 1. Hero: sequenced entrance (transform/opacity only → GPU-friendly)
    gsap.set('[data-hero-el]', { opacity: 0, y: 26 })
    gsap.set('[data-hero-line]', { yPercent: 110 })

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.to('[data-hero-el="badge"]', { opacity: 1, y: 0, duration: 0.5 })
      .to('[data-hero-line]', { yPercent: 0, duration: 0.85, stagger: 0.12 }, '-=0.2')
      .to('[data-hero-el="sub"]', { opacity: 1, y: 0, duration: 0.6 }, '-=0.5')
      .to('[data-hero-el="cta"]', { opacity: 1, y: 0, duration: 0.55 }, '-=0.4')
      .to(
        '[data-hero-stat]',
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 },
        '-=0.35',
      )
      .to('[data-hero-el="visual"]', { opacity: 1, y: 0, duration: 0.7 }, '-=0.7')

    // 2. Gentle continuous float on the hero visual
    gsap.to('[data-hero-float]', {
      y: -12,
      duration: 3.4,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    })

    // 3. Magnetic pull on the primary hero CTA
    const magnet = pageRef.current?.querySelector<HTMLElement>('[data-magnetic]')
    if (magnet && window.matchMedia('(pointer: fine)').matches) {
      const xTo = gsap.quickTo(magnet, 'x', { duration: 0.4, ease: 'power3.out' })
      const yTo = gsap.quickTo(magnet, 'y', { duration: 0.4, ease: 'power3.out' })
      const onMove = (e: MouseEvent) => {
        const r = magnet.getBoundingClientRect()
        xTo((e.clientX - (r.left + r.width / 2)) * 0.35)
        yTo((e.clientY - (r.top + r.height / 2)) * 0.35)
      }
      const onLeave = () => {
        xTo(0)
        yTo(0)
      }
      magnet.addEventListener('mousemove', onMove)
      magnet.addEventListener('mouseleave', onLeave)
    }

    // 4. Work-process connector line draws as the section scrolls into view
    gsap.fromTo(
      '[data-process-line]',
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '[data-process]',
          start: 'top 75%',
          end: 'top 30%',
          scrub: true,
        },
      },
    )
    gsap.fromTo(
      '[data-process-step]',
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.15,
        duration: 0.5,
        ease: 'power2.out',
        scrollTrigger: { trigger: '[data-process]', start: 'top 70%' },
      },
    )
  })

  return (
    <div ref={pageRef} className="overflow-x-hidden">

      {/* ══════════════════════════════════════════════
          1. HERO
      ══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[linear-gradient(140deg,#edf8f7_0%,#f4faf9_45%,#d5eeec_100%)]">
        {/* ambient blobs */}
        <div className="pointer-events-none absolute -left-32 -top-12 h-[500px] w-[500px] rounded-full bg-teal-300/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 bottom-0 h-[600px] w-[600px] rounded-full bg-cyan-300/15 blur-3xl" />

        <div className="container-custom relative z-10 py-16 lg:py-20">
          <div className="grid items-center gap-14 lg:grid-cols-[1fr_0.95fr]">

            {/* ── Left: content ── */}
            <div>
              {/* Badge */}
              <div data-hero-el="badge" className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-teal-200 bg-white/80 px-4 py-2 shadow-sm backdrop-blur">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-500" />
                </span>
                <span className="text-xs font-black uppercase tracking-[0.28em] text-teal-700">Available for Project Work</span>
              </div>

              {/* Headline — each line clip-reveals from its own overflow-hidden mask */}
              <h1 className="text-4xl font-black leading-[1.1] tracking-tight text-slate-950 sm:text-5xl lg:text-[3.5rem]">
                <span className="block overflow-hidden pb-1">
                  <span data-hero-line className="block">Building</span>
                </span>
                <span className="block overflow-hidden pb-1">
                  <span data-hero-line className="block">Business-Ready</span>
                </span>
                <span className="block overflow-hidden pb-1">
                  <span data-hero-line className="block bg-gradient-to-r from-teal-600 to-teal-400 bg-clip-text text-transparent">
                    Web Solutions.
                  </span>
                </span>
              </h1>

              <p data-hero-el="sub" className="mt-5 max-w-lg text-base leading-7 text-slate-600">
                Full-stack developer & trainer. I build websites, sell ready-made projects,
                teach courses, and run live training programs.
              </p>

              {/* CTAs */}
              <div data-hero-el="cta" className="mt-8 flex flex-wrap gap-3">
                <Link data-magnetic href="/contact" className="btn-primary px-7 py-3.5 text-sm">
                  <span className="relative z-10 inline-flex items-center">
                    Hire Me <ArrowRight className="ml-1.5 h-4 w-4" />
                  </span>
                </Link>
                <Link href="#ready-projects" className="btn-secondary px-7 py-3.5 text-sm">
                  View Ready Projects
                </Link>
                <a href={WA} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-green-600 px-7 py-3.5 text-sm font-bold text-white shadow-[0_14px_34px_rgba(22,163,74,0.28)] transition duration-300 ease-out hover:-translate-y-0.5 hover:bg-green-700 active:translate-y-0 active:scale-[0.98]">
                  <WaIcon /> WhatsApp
                </a>
              </div>

              {/* Trust stats */}
              <div className="mt-10 flex flex-wrap gap-3">
                {[
                  { v: '100+', l: 'Projects',  icon: Rocket },
                  { v: '50+',  l: 'Clients',   icon: Users },
                  { v: '5+',   l: 'Yrs Exp.',  icon: BadgeCheck },
                  { v: '200+', l: 'Students',  icon: GraduationCap },
                ].map(({ v, l, icon: Icon }) => (
                  <div key={l} data-hero-stat className="group flex items-center gap-2.5 rounded-2xl border border-white/90 bg-white/80 px-4 py-3 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-md">
                    <Icon className="h-4 w-4 text-teal-600 transition-transform duration-300 group-hover:scale-110" />
                    <div>
                      <p className="text-lg font-black leading-none text-slate-950">{v}</p>
                      <p className="mt-0.5 text-[11px] font-semibold text-slate-500">{l}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile-only tech marquee — intentional mobile visual (desktop shows the editor) */}
              <div className="mt-8 overflow-hidden lg:hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
                <div className="flex w-max gap-2 marquee-track">
                  {[...['Laravel', 'Next.js', 'React', 'Node.js', 'MySQL', 'MongoDB', 'TypeScript', 'Tailwind'], ...['Laravel', 'Next.js', 'React', 'Node.js', 'MySQL', 'MongoDB', 'TypeScript', 'Tailwind']].map((t, i) => (
                    <span key={i} className="rounded-full border border-teal-200/70 bg-white/70 px-3 py-1.5 text-xs font-bold text-teal-700 backdrop-blur">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Right: code editor visual (desktop only) ── */}
            <div data-hero-el="visual" className="hidden space-y-4 lg:block">

              {/* Top badge */}
              <div className="flex justify-end">
                <div className="rounded-full border border-teal-700/40 bg-teal-950/80 px-4 py-2 shadow-lg">
                  <p className="text-xs font-black text-teal-400">⚡ Available · Freelance &amp; Training</p>
                </div>
              </div>

              {/* Code editor card */}
              <div data-hero-float className="overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-950 shadow-[0_40px_100px_rgba(0,0,0,0.4)]">
                {/* Title bar */}
                <div className="flex items-center justify-between border-b border-slate-700/60 bg-slate-900/80 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-red-400" />
                    <span className="h-3 w-3 rounded-full bg-amber-400" />
                    <span className="h-3 w-3 rounded-full bg-green-400" />
                  </div>
                  <span className="text-[11px] font-medium text-slate-500">solution.config.ts</span>
                  <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-500">TypeScript</span>
                </div>

                {/* Code body */}
                <div className="flex p-5 font-mono text-[12.5px] leading-[1.85]">
                  {/* Line numbers */}
                  <div className="mr-5 select-none text-right text-slate-700">
                    {Array.from({ length: 10 }, (_, i) => (
                      <div key={i}>{i + 1}</div>
                    ))}
                  </div>
                  {/* Syntax-highlighted code */}
                  <div className="min-w-0">
                    <div><span className="text-slate-600">{'// Professional web solution builder'}</span></div>
                    <div>
                      <span className="text-purple-400">const</span>{' '}
                      <span className="text-sky-300">solution</span>{' '}
                      <span className="text-slate-300">=</span>{' '}
                      <span className="text-yellow-300">buildProject</span>
                      <span className="text-slate-300">{'({'}</span>
                    </div>
                    <div>
                      <span className="text-slate-600">{'  '}</span>
                      <span className="text-sky-300">stack</span>
                      <span className="text-slate-400">{': ['}</span>
                      <span className="text-green-400">&apos;Laravel&apos;</span>
                      <span className="text-slate-400">, </span>
                      <span className="text-green-400">&apos;Next.js&apos;</span>
                      <span className="text-slate-400">, </span>
                      <span className="text-green-400">&apos;React&apos;</span>
                      <span className="text-slate-400">{'],'}</span>
                    </div>
                    <div>
                      <span className="text-slate-600">{'  '}</span>
                      <span className="text-sky-300">type</span>
                      <span className="text-slate-400">{': '}</span>
                      <span className="text-green-400">&apos;Business Ready&apos;</span>
                      <span className="text-slate-400">,</span>
                    </div>
                    <div>
                      <span className="text-slate-600">{'  '}</span>
                      <span className="text-sky-300">delivery</span>
                      <span className="text-slate-400">{': '}</span>
                      <span className="text-amber-400">7</span>
                      <span className="text-slate-600">{',  // days'}</span>
                    </div>
                    <div>
                      <span className="text-slate-600">{'  '}</span>
                      <span className="text-sky-300">support</span>
                      <span className="text-slate-400">{': '}</span>
                      <span className="text-green-400">&apos;after-delivery&apos;</span>
                      <span className="text-slate-400">,</span>
                    </div>
                    <div><span className="text-slate-300">{'}'}</span><span className="text-slate-300">{')'}</span></div>
                    <div>&nbsp;</div>
                    <div><span className="text-slate-600">{'// ✓ Returns: production-ready solution'}</span></div>
                    <div>
                      <span className="text-purple-400">export</span>{' '}
                      <span className="text-purple-400">default</span>{' '}
                      <span className="text-sky-300">solution</span>
                    </div>
                  </div>
                </div>

                {/* Status bar */}
                <div className="flex items-center gap-4 border-t border-slate-700/60 bg-slate-900/60 px-5 py-2">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-teal-400" />
                    <span className="text-[11px] text-teal-400">Ready</span>
                  </div>
                  <span className="text-[11px] text-slate-600">TypeScript 5</span>
                  <span className="ml-auto text-[11px] text-slate-600">UTF-8</span>
                </div>
              </div>

              {/* Bottom row: terminal + tech stack */}
              <div className="grid grid-cols-2 gap-4">
                {/* Mini terminal */}
                <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-950 shadow-lg">
                  <div className="flex items-center gap-2 border-b border-slate-800 bg-slate-900 px-3 py-2">
                    <span className="h-2 w-2 rounded-full bg-red-400" />
                    <span className="h-2 w-2 rounded-full bg-amber-400" />
                    <span className="h-2 w-2 rounded-full bg-green-400" />
                    <span className="ml-1 text-[10px] text-slate-600">bash</span>
                  </div>
                  <div className="p-3 font-mono text-[11px] leading-[1.8]">
                    <div className="text-slate-500">$ npm run deploy</div>
                    <div className="text-green-400">✓ Build success</div>
                    <div className="text-green-400">✓ Tests passed</div>
                    <div className="flex items-center gap-1 text-teal-400">
                      <span className="text-slate-600">$</span>
                      <span className="cursor-blink">▌</span>
                    </div>
                  </div>
                </div>

                {/* Tech stack mini card */}
                <div className="rounded-xl border border-slate-700 bg-slate-950 p-4 shadow-lg">
                  <p className="mb-3 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Tech Stack</p>
                  <div className="flex flex-wrap gap-1.5">
                    {['Laravel', 'Next.js', 'React', 'Node.js', 'MySQL', 'MongoDB'].map((t) => (
                      <span key={t} className="rounded-full bg-teal-900/60 px-2.5 py-1 text-[10px] font-bold text-teal-400">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          2. QUICK VALUE CARDS
      ══════════════════════════════════════════════ */}
      <section className="border-y border-slate-200 bg-white py-8">
        <div className="container-custom">
          <Stagger className="grid gap-px sm:grid-cols-2 lg:grid-cols-4" stagger={0.07} amount={0.4}>
            {QUICK_VALUE.map(({ icon: Icon, label, desc, href, accent }, idx) => (
              <StaggerItem
                key={label}
                as="div"
                className={idx > 0 ? 'sm:border-l sm:border-slate-100' : ''}
              >
                <Link
                  href={href}
                  className="group flex h-full items-center gap-4 bg-white px-6 py-6 transition hover:bg-slate-50"
                >
                  <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-105 ${accent}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-black text-slate-950">{label}</p>
                    <p className="mt-0.5 truncate text-xs text-slate-500">{desc}</p>
                  </div>
                  <ArrowRight className="ml-auto h-4 w-4 flex-shrink-0 text-slate-300 transition-all duration-300 group-hover:translate-x-1 group-hover:text-teal-600" />
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          3. READY PROJECTS & SOLUTIONS
      ══════════════════════════════════════════════ */}
      <ProjectsSection />

      {/* ══════════════════════════════════════════════
          4. SERVICES
      ══════════════════════════════════════════════ */}
      <section id="services" className="py-20 lg:py-24">
        <div className="container-custom">

          <Reveal variant="rise" className="mb-12 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="section-kicker">Services</p>
              <h2 className="section-heading">What I Build for You</h2>
            </div>
            <Link href="/contact" className="btn-primary w-fit">
              <span className="relative z-10 inline-flex items-center">Hire Me <ArrowRight className="ml-1.5 h-4 w-4" /></span>
            </Link>
          </Reveal>

          <Stagger className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" stagger={0.08}>
            {SERVICE_LIST.map((service, idx) => (
              <StaggerItem key={service.slug} variant="scale" as="div"
                className="group relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1.5 hover:border-teal-100 hover:shadow-[0_18px_44px_rgba(15,23,42,0.12)]">
                {/* hover wash */}
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-teal-50/0 to-teal-50/0 opacity-0 transition-opacity duration-300 group-hover:from-teal-50/60 group-hover:to-transparent group-hover:opacity-100" />
                {/* Number accent */}
                <span className="absolute right-5 top-5 text-5xl font-black text-slate-100 transition-colors duration-300 group-hover:text-teal-100 select-none">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <div className="relative mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-105">
                  <Briefcase className="h-5 w-5" />
                </div>
                <h3 className="relative text-base font-black text-slate-950">{service.title}</h3>
                <p className="relative mt-1.5 line-clamp-2 text-sm leading-6 text-slate-500">
                  {service.description}
                </p>
                <div className="relative mt-3 flex flex-wrap gap-1.5">
                  {service.technologies.slice(0, 3).map((t) => (
                    <span key={t} className="rounded-full bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-500 ring-1 ring-slate-200">
                      {t}
                    </span>
                  ))}
                </div>
                <Link href="/contact"
                  className="relative mt-4 inline-flex items-center gap-1 text-sm font-black text-teal-700 transition-all group-hover:gap-2">
                  Hire Me <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </StaggerItem>
            ))}
          </Stagger>

        </div>
      </section>

      {/* ══════════════════════════════════════════════
          5. COURSES + LIVE TRAINING
      ══════════════════════════════════════════════ */}
      <section id="training" className="bg-[#f5f8f7] py-20 lg:py-24">
        <div className="container-custom">

          <Reveal variant="rise" className="mb-12 text-center">
            <p className="section-kicker">Learning Hub</p>
            <h2 className="section-heading mx-auto">Courses &amp; Live Training</h2>
            <p className="section-subheading mx-auto mt-3">
              Practical web development education — self-paced courses and live instructor-led batches.
            </p>
          </Reveal>

          <div className="grid gap-6 lg:grid-cols-2">

            {/* ── Courses ── */}
            <Reveal variant="slide-right" duration={0.75} className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 bg-gradient-to-br from-teal-50/80 to-white px-8 py-7">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
                  <BookOpen className="h-5 w-5" />
                </div>
                <h3 className="text-2xl font-black text-slate-950">Web Dev Courses</h3>
                <p className="mt-1.5 text-sm text-slate-500">Beginner to advanced · project-based learning</p>
              </div>
              <div className="px-8 py-7">
                <ul className="space-y-3">
                  {COURSE_LIST.map((c) => (
                    <li key={c.slug}
                      className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-3.5">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-black text-slate-950">{c.title}</p>
                        <p className="mt-0.5 text-xs capitalize text-slate-500">
                          {c.level} · {c.duration} · {c.lessons} lessons
                        </p>
                      </div>
                      <Link href={`/courses/${c.slug}`}
                        className="flex-shrink-0 rounded-full bg-teal-700 px-4 py-2 text-xs font-black text-white transition hover:bg-teal-600">
                        Join
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link href="/courses"
                  className="mt-5 inline-flex w-full items-center justify-center rounded-full border border-teal-200 bg-teal-50 px-6 py-3 text-sm font-black text-teal-700 transition hover:bg-teal-100">
                  Browse All Courses <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </Reveal>

            {/* ── Live Training ── */}
            <Reveal variant="slide-left" duration={0.75} className="flex flex-col overflow-hidden rounded-[2rem] bg-gradient-to-br from-teal-700 via-teal-800 to-slate-900 shadow-sm">
              <div className="p-8">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-2xl font-black text-white">Live Online Training</h3>
                <p className="mt-1.5 text-sm text-white/65">{LIVE_TRAINING_INFO.subtitle}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-black text-white/80">
                    {LIVE_TRAINING_INFO.batchStatus}
                  </span>
                  <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-black text-white/80">
                    📅 {LIVE_TRAINING_INFO.schedule}
                  </span>
                </div>
              </div>

              <div className="flex-1 border-t border-white/10 px-8 py-7">
                <p className="mb-4 text-[11px] font-black uppercase tracking-[0.28em] text-white/40">Topics</p>
                <ul className="space-y-2.5">
                  {LIVE_TRAINING_INFO.topics.map((topic, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-white/75">
                      <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-white/15 text-xs font-black text-white">
                        {i + 1}
                      </span>
                      {topic}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-col gap-2.5">
                  <Link href="/contact"
                    className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-black text-teal-900 transition hover:bg-teal-50">
                    {LIVE_TRAINING_INFO.ctaLabel} <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                  <a href={WA} target="_blank" rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-black text-white transition hover:bg-white/10">
                    <WaIcon /> Ask on WhatsApp
                  </a>
                </div>
              </div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          6. PORTFOLIO / CASE STUDIES
      ══════════════════════════════════════════════ */}
      <section id="portfolio" className="bg-white py-20 lg:py-24">
        <div className="container-custom">

          <Reveal variant="rise" className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="section-kicker">Portfolio</p>
              <h2 className="section-heading">Completed Work &amp; Case Studies</h2>
            </div>
            <Link href="/projects" className="btn-secondary w-fit">
              View All <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Reveal>

          <Stagger className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4" stagger={0.09}>
            {PROJECT_LIST.map((project) => (
              <StaggerItem key={project.slug} variant="clip" as="div">
                <Link href={`/projects/${project.slug}`}
                  className="group block h-full overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1.5 hover:border-teal-100 hover:shadow-[0_18px_44px_rgba(15,23,42,0.12)]">
                  <div className="relative h-44 overflow-hidden bg-slate-900">
                    {project.image ? (
                      <img src={project.image} alt={project.title}
                        className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-110" />
                    ) : (
                      <ProjectMockup technologies={project.technologies} />
                    )}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>
                  <div className="p-5">
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-teal-600">Case Study</p>
                    <h3 className="mt-1 line-clamp-2 text-sm font-black leading-snug text-slate-950 transition-colors duration-300 group-hover:text-teal-800">
                      {project.title}
                    </h3>
                    <div className="mt-2.5 flex flex-wrap gap-1">
                      {project.technologies?.slice(0, 2).map((t) => (
                        <span key={t} className="rounded-full bg-slate-50 px-2 py-0.5 text-[10px] font-bold text-slate-500 ring-1 ring-slate-200">
                          {t}
                        </span>
                      ))}
                    </div>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-black text-teal-700 transition-all group-hover:gap-2">
                      View Details <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>

        </div>
      </section>

      {/* ══════════════════════════════════════════════
          7. WORK PROCESS
      ══════════════════════════════════════════════ */}
      <section id="process" className="bg-[#f5f8f7] py-20 lg:py-24">
        <div className="container-custom">

          <Reveal variant="rise" className="mb-14 text-center">
            <p className="section-kicker">How It Works</p>
            <h2 className="section-heading mx-auto">From Idea to Delivery</h2>
          </Reveal>

          <div data-process className="relative">
            <div
              data-process-line
              className="absolute left-[10%] right-[10%] top-6 hidden h-0.5 origin-left bg-gradient-to-r from-teal-400 via-teal-400 to-teal-300 lg:block"
            />
            <div className="grid gap-8 lg:grid-cols-5">
              {WORK_PROCESS.map((item) => (
                <div key={item.step} data-process-step className="group flex flex-col items-center text-center">
                  <div className="relative z-10 mb-5 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-teal-700 text-sm font-black text-white shadow-[0_8px_24px_rgba(15,118,110,0.4)] transition-transform duration-300 group-hover:scale-110">
                    {item.step}
                  </div>
                  <h3 className="text-sm font-black text-slate-950">{item.title}</h3>
                  <p className="mt-2 text-xs leading-6 text-slate-500">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-14 text-center">
            <Link href="/contact" className="btn-primary px-8 py-3.5">
              Start a Project <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════
          8. WHY WORK WITH ME
      ══════════════════════════════════════════════ */}
      <section id="why-me" className="border-y border-slate-100 bg-white py-20 lg:py-24">
        <div className="container-custom">

          <Reveal variant="rise" className="mb-10 text-center">
            <span className="mb-3 inline-block text-xs font-bold uppercase tracking-widest text-teal-600">
              Why Work With Me
            </span>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              What Makes Me Different
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-500">
              Every engagement is backed by real project experience, clear communication,
              and support that lasts beyond delivery.
            </p>
          </Reveal>

          <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
            {WHY_CHOOSE_ME.map((item) => {
              const meta = WHY_ICON_MAP[item.title] ?? { icon: <Monitor className="h-5 w-5" />, accent: 'bg-teal-50 text-teal-600' }
              return (
                <StaggerItem key={item.title} as="div" variant="rise"
                  className="group rounded-2xl border border-slate-200 bg-[#F8FAFC] p-5 transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-teal-200 hover:shadow-md">
                  <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-105 ${meta.accent}`}>
                    {meta.icon}
                  </div>
                  <h3 className="mb-1.5 text-sm font-bold text-slate-900">{item.title}</h3>
                  <p className="text-xs leading-relaxed text-slate-500">{item.description}</p>
                </StaggerItem>
              )
            })}
          </Stagger>

        </div>
      </section>

      {/* ══════════════════════════════════════════════
          9. TESTIMONIALS
      ══════════════════════════════════════════════ */}
      <section id="testimonials" className="bg-[#F8FAFC] py-20 lg:py-24">
        <div className="container-custom">

          <Reveal variant="rise" className="mb-10 text-center">
            <span className="mb-3 inline-block text-xs font-bold uppercase tracking-widest text-teal-600">
              Testimonials
            </span>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Trusted by Clients &amp; Students
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-500">
              Feedback from clients and students I&apos;ve worked with across freelance projects
              and training programs.
            </p>
          </Reveal>

          <Stagger className="grid gap-5 xl:grid-cols-2" stagger={0.12}>
            {TESTIMONIALS_LIST.map((t) => (
              <StaggerItem key={t.name} as="div" variant="rise"
                className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-shadow duration-300 hover:shadow-[0_18px_44px_rgba(15,23,42,0.08)]">
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-4 w-4 text-amber-400 ${i < t.rating ? 'fill-current' : 'opacity-30'}`} />
                  ))}
                </div>
                <p className="text-base leading-8 text-slate-600">&ldquo;{t.content}&rdquo;</p>
                <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-teal-50 text-sm font-black text-teal-700">
                    {t.image ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={t.image} alt={t.name} className="h-full w-full object-cover" />
                    ) : (
                      t.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role} · {t.company}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

        </div>
      </section>

      {/* ══════════════════════════════════════════════
          10. FAQ
      ══════════════════════════════════════════════ */}
      <section id="faq" className="py-20 lg:py-24">
        <div className="container-custom">

          <Reveal variant="rise" className="mb-12 text-center">
            <p className="section-kicker">FAQ</p>
            <h2 className="section-heading mx-auto">Frequently Asked Questions</h2>
          </Reveal>

          <Stagger className="mx-auto max-w-3xl space-y-2" stagger={0.06}>
            {FAQ_LIST.map((item) => (
              <StaggerItem key={item.question} as="div" variant="fade">
                <FaqItem question={item.question} answer={item.answer} />
              </StaggerItem>
            ))}
          </Stagger>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link href="/contact" className="btn-primary px-6 py-3">
              <MessageCircle className="mr-2 h-4 w-4" /> Ask a Question
            </Link>
            <a href={WA} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-green-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-green-700">
              <WaIcon /> WhatsApp
            </a>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════
          11. FINAL CTA
      ══════════════════════════════════════════════ */}
      <section className="container-custom pb-20 lg:pb-24">
        <Reveal variant="scale" duration={0.7} className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-600 to-teal-700 px-8 py-14 text-center glow-pulse">
          <span className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
          <span className="pointer-events-none absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-teal-300/20 blur-3xl" />
          <p className="relative mb-3 text-sm font-bold uppercase tracking-widest text-teal-200">
            Ready to Start?
          </p>
          <h2 className="relative mb-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
            Have a project idea or want<br className="hidden sm:block" />
            a ready solution?
          </h2>
          <p className="relative mx-auto mb-8 max-w-lg text-base text-teal-100">
            Send an enquiry, request a demo, or message me on WhatsApp.
            I respond within 24 hours.
          </p>
          <div className="relative flex flex-wrap justify-center gap-3">
            <Link
              href="/order-project"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-teal-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              Send Project Enquiry <ArrowUpRight className="h-4 w-4" />
            </Link>
            <a
              href={WA}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-green-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-green-400"
            >
              <WaIcon /> WhatsApp Me
            </a>
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 rounded-full border border-teal-400 px-6 py-3 text-sm font-bold text-white transition hover:bg-teal-500"
            >
              <BookOpen className="h-4 w-4" /> Join a Course
            </Link>
          </div>
        </Reveal>
      </section>

    </div>
  )
}
