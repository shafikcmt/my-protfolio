'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, CheckCircle2 } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Project {
  slug: string
  title: string
  description: string
  tags: string[]
  badges: { label: string; type: 'featured' | 'ready' | 'customizable' | 'demo' }[]
  features?: string[]
  featured?: boolean
  image?: string
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const projects: Project[] = [
  {
    slug: 'laravel-learning-management-system',
    title: 'Laravel Learning Management System',
    description:
      'Full-featured LMS platform with course management, student tracking, quizzes and instructor panel.',
    tags: ['Laravel', 'MySQL', 'Blade', 'Bootstrap'],
    badges: [
      { label: '⭐ Featured', type: 'featured' },
      { label: 'Customizable', type: 'customizable' },
      { label: 'Demo on Request', type: 'demo' },
    ],
    features: [
      'Course & lesson management',
      'Student dashboard & progress tracking',
      'Quiz & certificate system',
    ],
    featured: true,
  },
  {
    slug: 'php-oop-blog-site',
    title: 'PHP OOP Blog Site',
    description:
      'Clean blog platform with OOP architecture, user auth, comments and category management.',
    tags: ['PHP', 'OOP', 'MySQL'],
    badges: [
      { label: 'Ready', type: 'ready' },
      { label: 'Customizable', type: 'customizable' },
    ],
  },
  {
    slug: 'laravel-multi-vendor-ecommerce',
    title: 'Laravel Multi-Vendor eCommerce',
    description:
      'Multi-vendor marketplace with seller dashboards, order management and secure payment checkout.',
    tags: ['Laravel', 'Stripe', 'MySQL'],
    badges: [
      { label: 'Ready', type: 'ready' },
      { label: 'Customizable', type: 'customizable' },
    ],
  },
  {
    slug: 'production-tracking-system-with-qr-code',
    title: 'Production Tracking System with QR Code',
    description:
      'Smart production tracker with QR scanning, real-time progress monitoring and REST API integration.',
    tags: ['Django', 'TypeScript', 'Docker'],
    badges: [
      { label: 'Ready', type: 'ready' },
      { label: 'Customizable', type: 'customizable' },
    ],
  },
]

// ─── Badge styles map ─────────────────────────────────────────────────────────

const BADGE_STYLES: Record<Project['badges'][number]['type'], string> = {
  featured:     'bg-amber-500/20 text-amber-400 border border-amber-500/30',
  ready:        'bg-teal-500/20 text-teal-400 border border-teal-500/30',
  customizable: 'bg-slate-700/50 text-slate-300 border border-slate-600/50',
  demo:         'bg-blue-500/20 text-blue-400 border border-blue-500/30',
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Badge({ label, type }: { label: string; type: Project['badges'][number]['type'] }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide ${BADGE_STYLES[type]}`}
    >
      {label}
    </span>
  )
}

function TagChip({ tag }: { tag: string }) {
  return (
    <span className="rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-400">
      {tag}
    </span>
  )
}

function ProjectImagePlaceholder({ tags }: { tags?: string[] }) {
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-gradient-to-br from-slate-900 via-[#0d1525] to-slate-900">
      {/* Sweeping shimmer highlight */}
      <motion.div
        animate={{ x: ['-120%', '120%'] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
        className="pointer-events-none absolute inset-y-0 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent"
      />

      {/* Browser chrome bar */}
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

      {/* Mock dashboard */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="flex w-12 flex-col items-center gap-2.5 border-r border-slate-800/70 bg-slate-900/90 py-3">
          <div className="h-5 w-5 rounded-lg bg-gradient-to-br from-teal-500/80 to-teal-700/80" />
          <div className="mt-1 flex flex-col gap-1.5">
            {[true, false, false, false].map((active, i) => (
              <div
                key={i}
                className={`h-2 w-7 rounded ${active ? 'bg-teal-700/60' : 'bg-slate-700/40'}`}
              />
            ))}
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-hidden p-3">
          {/* Stats row */}
          <div className="mb-2.5 grid grid-cols-3 gap-1.5">
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

          {/* List rows */}
          <div className="space-y-1.5">
            {[true, false, false].map((active, i) => (
              <div key={i} className="flex items-center gap-2 rounded-lg bg-slate-800/60 p-1.5">
                <div
                  className={`h-3.5 w-3.5 flex-shrink-0 rounded ${active ? 'bg-teal-700/70' : 'bg-slate-700/60'}`}
                />
                <div className="h-2 flex-1 rounded bg-slate-600/50" />
                <div
                  className={`h-3 w-6 flex-shrink-0 rounded-full ${active ? 'bg-green-800/50' : 'bg-slate-700/40'}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tech tag strip */}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-1 border-t border-slate-800/60 px-3 py-2">
          {tags.slice(0, 3).map((t) => (
            <span
              key={t}
              className="rounded-full bg-teal-900/50 px-2 py-0.5 text-[9px] font-bold text-teal-400"
            >
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Featured hero card ───────────────────────────────────────────────────────

function FeaturedCard({ project }: { project: Project }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.65, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -4 }}
      className="group relative mb-6 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] shadow-[0_4px_48px_rgba(0,0,0,0.55)] backdrop-blur-sm transition-[border-color,box-shadow] duration-500 hover:border-teal-400/30 hover:shadow-[0_8px_64px_rgba(0,0,0,0.65),0_0_0_1px_rgba(0,212,170,0.12)]"
    >
      {/* Corner glow that fades in on hover */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-teal-500/[0.07] blur-3xl opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
      <div className="pointer-events-none absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-teal-600/[0.05] blur-2xl opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

      <div className="grid lg:grid-cols-[1fr_0.68fr]">
        {/* ── Left: content ── */}
        <div className="relative z-10 p-8 lg:p-10">
          {/* Badges */}
          <div className="mb-5 flex flex-wrap gap-2">
            {project.badges.map((b) => (
              <Badge key={b.label} label={b.label} type={b.type} />
            ))}
          </div>

          {/* Title */}
          <h3 className="text-2xl font-black tracking-tight text-white lg:text-[1.75rem]">
            {project.title}
          </h3>

          {/* Description */}
          <p className="mt-3 max-w-lg text-sm leading-7 text-slate-400">{project.description}</p>

          {/* Feature list */}
          {project.features && (
            <ul className="mt-6 space-y-3">
              {project.features.map((f, i) => (
                <motion.li
                  key={f}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 + 0.3 }}
                  className="flex items-center gap-3 text-sm text-slate-300"
                >
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-teal-400" />
                  {f}
                </motion.li>
              ))}
            </ul>
          )}

          {/* Tech tags */}
          <div className="mt-6 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <TagChip key={tag} tag={tag} />
            ))}
          </div>

          {/* Action buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href={`/projects/${project.slug}`}
              className="inline-flex items-center gap-2 rounded-full bg-teal-500 px-6 py-2.5 text-sm font-bold text-white transition-all duration-200 hover:bg-teal-400 hover:shadow-[0_0_24px_rgba(0,212,170,0.45)]"
            >
              View Details
            </Link>
            <Link
              href={`/order-project?project=${project.slug}`}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-2.5 text-sm font-bold text-white/80 transition-all duration-200 hover:border-white/40 hover:text-white"
            >
              Send Enquiry
            </Link>
            <Link
              href={`/order-project?project=${project.slug}&type=demo`}
              className="inline-flex items-center gap-1 text-sm font-bold text-teal-400 transition hover:text-teal-300"
            >
              Request Demo <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* ── Right: image / mockup ── */}
        <div className="relative min-h-[280px] overflow-hidden border-t border-white/[0.06] lg:border-l lg:border-t-0">
          {project.image ? (
            <img
              src={project.image}
              alt={project.title}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />
          ) : (
            <ProjectImagePlaceholder tags={project.tags} />
          )}
          {/* Blend edge with card on desktop */}
          <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-10 bg-gradient-to-r from-[#080d1a]/20 to-transparent lg:block" />
        </div>
      </div>
    </motion.div>
  )
}

// ─── Grid card ────────────────────────────────────────────────────────────────

function GridCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.55,
        delay: index * 0.1 + 0.2,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="group flex flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.03] shadow-[0_4px_20px_rgba(0,0,0,0.4)] backdrop-blur-sm transition-[border-color,box-shadow] duration-300 hover:border-teal-400/20 hover:shadow-[0_8px_36px_rgba(0,0,0,0.5),0_0_0_1px_rgba(0,212,170,0.08)]"
    >
      {/* Thumbnail */}
      <div className="relative h-44 overflow-hidden border-b border-white/[0.06]">
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
          />
        ) : (
          <ProjectImagePlaceholder tags={project.tags} />
        )}
        {/* Dark vignette for badge legibility */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        {/* Badges */}
        <div className="mb-3 flex flex-wrap gap-1.5">
          {project.badges.map((b) => (
            <span
              key={b.label}
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold tracking-wide ${BADGE_STYLES[b.type]}`}
            >
              {b.label}
            </span>
          ))}
        </div>

        {/* Title */}
        <h3 className="text-base font-black tracking-tight text-white">{project.title}</h3>

        {/* Description */}
        <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-slate-500">{project.description}</p>

        {/* Tags */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <TagChip key={tag} tag={tag} />
          ))}
        </div>

        {/* Actions pinned to bottom */}
        <div className="mt-auto flex items-center gap-3 pt-5">
          <Link
            href={`/projects/${project.slug}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-teal-600/80 px-4 py-2 text-xs font-bold text-white transition-all duration-200 hover:bg-teal-500 hover:shadow-[0_0_16px_rgba(0,212,170,0.35)]"
          >
            View Details
          </Link>
          <Link
            href={`/order-project?project=${project.slug}`}
            className="text-xs font-bold text-slate-500 transition hover:text-teal-400"
          >
            Enquiry →
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function ProjectsSection() {
  const featuredProject = projects.find((p) => p.featured)
  const gridProjects = projects.filter((p) => !p.featured)

  return (
    <section id="ready-projects" className="relative overflow-hidden bg-[#080d1a] py-20 lg:py-28">

      {/* Radial gradient mesh */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0,212,170,0.08), transparent)',
        }}
      />
      {/* Ambient side glows */}
      <div className="pointer-events-none absolute -left-64 top-1/3 h-[500px] w-[500px] rounded-full bg-teal-600/[0.04] blur-[120px]" />
      <div className="pointer-events-none absolute -right-64 bottom-1/4 h-[400px] w-[400px] rounded-full bg-teal-400/[0.03] blur-[100px]" />

      <div className="container-custom relative z-10">

        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-12 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-[0.32em] text-teal-500">
              Ready Projects
            </p>
            <h2 className="max-w-2xl text-3xl font-black tracking-tight text-white lg:text-4xl">
              Production-Ready Projects /{' '}
              <span className="bg-gradient-to-r from-teal-400 to-teal-600 bg-clip-text text-transparent">
                For Your Business
              </span>
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-400">
              Browse production-ready projects. Request a demo or send an enquiry for
              customization — no fixed price, discuss your requirements first.
            </p>
          </div>

          <Link
            href="/projects"
            className="group inline-flex w-fit items-center gap-2 rounded-full border border-teal-700/50 px-5 py-2.5 text-sm font-bold text-slate-300 transition-all duration-200 hover:border-teal-400 hover:bg-teal-400/10 hover:text-teal-400"
          >
            All Projects
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        {/* ── Featured hero card ── */}
        {featuredProject && (
          <div className="relative">
            {/* Diffuse glow behind the featured card */}
            <div className="pointer-events-none absolute -inset-6 rounded-[3rem] bg-teal-400/[0.04] blur-3xl" />
            <FeaturedCard project={featuredProject} />
          </div>
        )}

        {/* ── Project grid ── */}
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
          {gridProjects.map((project, index) => (
            <GridCard key={project.slug} project={project} index={index} />
          ))}
        </div>

        {/* ── No-price note ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="mt-8 flex items-start gap-4 rounded-2xl border border-teal-900/40 bg-teal-950/30 px-6 py-5"
        >
          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-teal-900/60 text-sm">
            💡
          </span>
          <p className="text-sm leading-7 text-slate-400">
            <span className="font-bold text-white">No fixed price.</span>{' '}
            Send an enquiry with your requirements — I will review and respond within 24 hours.
          </p>
        </motion.div>

      </div>
    </section>
  )
}
