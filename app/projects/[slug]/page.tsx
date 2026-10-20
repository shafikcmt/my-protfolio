'use client'

import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import Link from 'next/link'
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion'
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  Building2,
  Clock,
  Code2,
  ExternalLink,
  Lightbulb,
  Target,
  TrendingUp,
  Star,
  X,
  ZoomIn,
} from 'lucide-react'
import { PROJECT_LIST } from '@/lib/constants'
import LoadingSpinner from '@/components/LoadingSpinner'
import { getEmbedUrl, isDirectVideo } from '@/lib/media'
import { groupFeatures } from '@/lib/features'
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal'

type ProjectData = {
  title: string
  slug?: string
  shortDescription?: string
  description: string
  image?: string
  screenshots?: string[]
  videoUrl?: string
  liveDemoUrl?: string
  githubUrl?: string
  link?: string
  codeLink?: string
  industry?: string
  role?: string
  duration?: string
  results?: string[]
  clientProblem?: string
  solution?: string
  technologies?: string[]
  features?: string[]
  adminFeatures?: string[]
  userFeatures?: string[]
  featured?: boolean
  category?: string
  status?: string
}

function VideoDemo({ url, title }: { url: string; title: string }) {
  const embed = getEmbedUrl(url)
  const direct = isDirectVideo(url)

  return (
    <Card title="Video Demo">
      {direct || embed ? (
        <div className="aspect-video overflow-hidden rounded-xl border border-slate-200 bg-slate-900">
          {direct ? (
            <video src={url} controls preload="metadata" playsInline className="h-full w-full" />
          ) : (
            <iframe
              src={embed}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
              loading="lazy"
              title={`${title} demo video`}
            />
          )}
        </div>
      ) : (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-teal-500"
        >
          <ExternalLink className="h-4 w-4" /> Watch demo video
        </a>
      )}
    </Card>
  )
}

function TechChip({ tag }: { tag: string }) {
  return (
    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
      {tag}
    </span>
  )
}

function FeatureItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2.5 text-sm text-slate-700">
      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-teal-600" />
      {text}
    </li>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Reveal>
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_2px_16px_rgba(15,23,42,0.07)] transition duration-300 hover:shadow-[0_12px_36px_rgba(15,23,42,0.10)]">
        <h3 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-teal-600">
          <span className="h-px w-6 bg-teal-500" />
          {title}
        </h3>
        {children}
      </div>
    </Reveal>
  )
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.001 })
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-teal-500 via-cyan-400 to-emerald-400"
    />
  )
}

function CaseStudy({ problem, solution, results }: { problem?: string; solution?: string; results?: string[] }) {
  const steps = [
    problem && { icon: Target, label: 'The Problem', tone: 'bg-rose-50 text-rose-600 ring-rose-100', body: <p className="text-sm leading-7 text-slate-600">{problem}</p> },
    solution && { icon: Lightbulb, label: 'The Solution', tone: 'bg-teal-50 text-teal-600 ring-teal-100', body: <p className="text-sm leading-7 text-slate-600">{solution}</p> },
    results && results.length > 0 && {
      icon: TrendingUp,
      label: 'The Result',
      tone: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
      body: (
        <ul className="space-y-2.5">
          {results.map((r) => (
            <FeatureItem key={r} text={r} />
          ))}
        </ul>
      ),
    },
  ].filter(Boolean) as { icon: typeof Target; label: string; tone: string; body: React.ReactNode }[]

  if (steps.length === 0) return null

  return (
    <div>
      <Reveal>
        <h3 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-teal-600">
          <span className="h-px w-6 bg-teal-500" />
          Case Study
        </h3>
      </Reveal>
      <Stagger className="space-y-4" stagger={0.12}>
        {steps.map((step, i) => (
          <StaggerItem key={step.label}>
            <div className="relative flex gap-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_2px_16px_rgba(15,23,42,0.07)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_36px_rgba(15,23,42,0.10)]">
              <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ring-1 ${step.tone}`}>
                <step.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="mb-2 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                  <span className="text-slate-300">0{i + 1}</span> · {step.label}
                </p>
                {step.body}
              </div>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  )
}

function BannerPlaceholder({ tags }: { tags?: string[] }) {
  return (
    <div className="flex h-full w-full flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
        </div>
        <div className="mx-2 flex flex-1 items-center gap-1.5 rounded bg-slate-100 px-2 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
          <span className="text-[10px] text-slate-400">localhost:3000/dashboard</span>
        </div>
      </div>
      <div className="flex flex-1 gap-3 p-4">
        <div className="flex w-14 flex-col gap-2">
          <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600" />
          {[true, false, false, false, false].map((a, i) => (
            <div key={i} className={`h-2 rounded ${a ? 'bg-teal-200' : 'bg-slate-200'}`} />
          ))}
        </div>
        <div className="flex-1 space-y-2.5">
          <div className="grid grid-cols-3 gap-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className={`rounded-xl p-2.5 ${i === 0 ? 'bg-teal-50 border border-teal-100' : 'bg-white border border-slate-200'}`}>
                <div className="h-1.5 w-full rounded bg-slate-200" />
                <div className="mt-1.5 h-4 w-2/3 rounded bg-slate-100" />
              </div>
            ))}
          </div>
          <div className="space-y-1.5">
            {[true, false, false, false].map((a, i) => (
              <div key={i} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-2">
                <div className={`h-3 w-3 rounded ${a ? 'bg-teal-400' : 'bg-slate-200'}`} />
                <div className="h-2 flex-1 rounded bg-slate-100" />
                <div className={`h-3 w-8 rounded-full ${a ? 'bg-emerald-100' : 'bg-slate-100'}`} />
              </div>
            ))}
          </div>
        </div>
      </div>
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 border-t border-slate-200 bg-white/80 px-4 py-2.5">
          {tags.slice(0, 4).map((t) => (
            <span key={t} className="rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-teal-700 ring-1 ring-teal-100">
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

function ScreenshotGallery({
  screenshots,
  title,
}: {
  screenshots: string[]
  title: string
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const prev = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i - 1 + screenshots.length) % screenshots.length))
  }, [screenshots.length])

  const next = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i + 1) % screenshots.length))
  }, [screenshots.length])

  useEffect(() => {
    if (lightboxIndex === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null)
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightboxIndex, prev, next])

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {screenshots.map((src, i) => (
          <motion.button
            key={i}
            onClick={() => setLightboxIndex(i)}
            aria-label={`Open ${title} screenshot ${i + 1}`}
            className={`group relative overflow-hidden rounded-xl border border-slate-200 bg-slate-100 ${
              i === 0 && screenshots.length > 2 ? 'col-span-2 row-span-2 aspect-video sm:aspect-auto sm:min-h-[260px]' : 'aspect-video'
            }`}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: Math.min(i, 5) * 0.06 }}
            whileHover={{ y: -3 }}
          >
            <div
              className="h-full w-full bg-cover bg-center transition duration-300 group-hover:scale-105"
              style={{ backgroundImage: `url(${src})` }}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/20">
              <ZoomIn className="h-5 w-5 text-white opacity-0 transition group-hover:opacity-100" />
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={() => setLightboxIndex(null)}
          >
            <motion.div
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.92 }}
              className="relative max-h-[90vh] max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={screenshots[lightboxIndex]}
                alt={`${title} screenshot ${lightboxIndex + 1}`}
                className="max-h-[85vh] rounded-xl object-contain shadow-2xl"
              />
              <button
                onClick={() => setLightboxIndex(null)}
                aria-label="Close image"
                className="absolute -right-4 -top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </button>
              {screenshots.length > 1 && (
                <>
                  <button
                    onClick={prev}
                    aria-label="Previous image"
                    className="absolute left-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={next}
                    aria-label="Next image"
                    className="absolute right-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  <p className="mt-2 text-center text-xs text-white/60">
                    {lightboxIndex + 1} / {screenshots.length}
                  </p>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default function ProjectDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const [project, setProject] = useState<ProjectData | null>(null)
  const [loading, setLoading] = useState(true)
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const { data } = await axios.get(`/api/projects?slug=${encodeURIComponent(slug)}`)
        if (data.success && data.data) {
          setProject(data.data)
          setLoading(false)
          return
        }
      } catch {
        // fall through to static fallback
      }

      const staticProject = PROJECT_LIST.find((p) => p.slug === slug) ?? null
      setProject(staticProject)
      setLoading(false)
    }
    load()
  }, [slug])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6">
        <p className="text-xl font-semibold text-slate-500">Project not found.</p>
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-teal-500"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Link>
      </div>
    )
  }

  const demoUrl = project.liveDemoUrl || project.link
  const repoUrl = project.githubUrl || project.codeLink
  const bannerImage = project.screenshots?.[0] || project.image
  const hasLiveDemo = Boolean(project.liveDemoUrl)
  const hasImage = Boolean(bannerImage) && !imgError
  const enquiryHref = `/order-project?project=${encodeURIComponent(project.title)}`
  const demoEnquiryHref = `/order-project?project=${encodeURIComponent(project.title)}&type=demo`

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 lg:pb-0">
      <ScrollProgress />
      <section className="relative overflow-hidden bg-slate-950">
        <div className="pointer-events-none absolute -left-24 -top-24 h-[420px] w-[420px] rounded-full bg-teal-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-[380px] w-[380px] rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="container-custom relative z-10 py-10 lg:py-16">

        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-slate-400">
          <Link href="/" className="transition hover:text-teal-300">Home</Link>
          <span>/</span>
          <Link href="/projects" className="transition hover:text-teal-300">Projects</Link>
          <span>/</span>
          <span className="max-w-[240px] truncate text-slate-200">{project.title}</span>
        </nav>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-4 flex flex-wrap gap-2">
            {project.featured && (
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-xs font-bold text-amber-300">
                <Star className="h-3 w-3" />
                Featured
              </span>
            )}
            {project.category && (
              <span className="inline-flex items-center rounded-full border border-teal-400/40 bg-teal-400/10 px-3 py-1 text-xs font-bold text-teal-300">
                {project.category}
              </span>
            )}
            <span className="inline-flex items-center rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">
              Available
            </span>
          </div>

          <h1 className="bg-gradient-to-r from-white via-white to-teal-200 bg-clip-text text-3xl font-black tracking-tight text-transparent lg:text-4xl xl:text-[2.75rem]">
            {project.title}
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
            {project.shortDescription ||
              (project.description.length > 200
                ? project.description.slice(0, 200) + '…'
                : project.description)}
          </p>

          {project.technologies && project.technologies.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {project.technologies.map((t) => (
                <span key={t} className="rounded-full bg-white/5 px-2.5 py-1 text-xs font-semibold text-slate-200 ring-1 ring-white/15 backdrop-blur">
                  {t}
                </span>
              ))}
            </div>
          )}

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href={enquiryHref}
              className="inline-flex items-center gap-2 rounded-full bg-teal-500 px-6 py-2.5 text-sm font-bold text-slate-950 shadow-[0_10px_30px_rgba(20,184,166,0.35)] transition hover:-translate-y-0.5 hover:bg-teal-400"
            >
              Send Enquiry
            </Link>
            <Link
              href={demoEnquiryHref}
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-2.5 text-sm font-bold text-white transition hover:border-teal-300 hover:text-teal-200"
            >
              Request Demo <ArrowUpRight className="h-4 w-4" />
            </Link>
            {demoUrl && (
              <a
                href={demoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-300 transition hover:text-teal-300"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Live Demo
              </a>
            )}
          </div>

          {(project.industry || project.role || project.duration) && (
            <Stagger className="mt-9 grid max-w-3xl gap-3 sm:grid-cols-3" stagger={0.1} delayChildren={0.2}>
              {[
                { icon: Building2, k: 'Industry', v: project.industry },
                { icon: Briefcase, k: 'My Role', v: project.role },
                { icon: Clock, k: 'Duration', v: project.duration },
              ]
                .filter((i) => i.v)
                .map(({ icon: Icon, k, v }) => (
                  <StaggerItem key={k}>
                    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
                      <Icon className="h-4 w-4 flex-shrink-0 text-teal-300" />
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">{k}</p>
                        <p className="truncate text-sm font-semibold text-white">{v}</p>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
            </Stagger>
          )}
        </motion.div>
        </div>
      </section>

      <div className="container-custom py-10 lg:py-14">
        {/* Content grid */}
        <div className="grid gap-6 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_360px]">

          {/* Left column */}
          <div className="space-y-6">

            {/* Banner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="overflow-hidden rounded-2xl border border-slate-200 shadow-[0_18px_50px_rgba(15,23,42,0.12)]"
              style={{ minHeight: '260px' }}
            >
              {hasLiveDemo ? (
                <div className="flex h-64 flex-col lg:h-80">
                  <div className="flex flex-shrink-0 items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-2.5">
                    <div className="flex gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
                      <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
                    </div>
                    <div className="mx-2 flex min-w-0 flex-1 items-center gap-1.5 rounded-md bg-slate-200 px-2 py-1">
                      <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-teal-500" />
                      <span className="truncate text-[10px] text-slate-500">{project.liveDemoUrl}</span>
                    </div>
                    <a
                      href={project.liveDemoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex flex-shrink-0 items-center gap-1 rounded-full bg-teal-600 px-2.5 py-1 text-[10px] font-bold text-white transition hover:bg-teal-500"
                    >
                      <ExternalLink className="h-2.5 w-2.5" />
                      Open
                    </a>
                  </div>
                  <div className="relative flex-1 overflow-hidden bg-slate-100">
                    <iframe
                      src={project.liveDemoUrl}
                      title={`${project.title} live demo`}
                      className="h-full w-full border-0"
                      sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                      allowFullScreen
                    />
                  </div>
                </div>
              ) : hasImage ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={bannerImage}
                  alt={project.title}
                  className="aspect-video w-full object-cover transition duration-700 hover:scale-[1.03]"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="h-64 lg:h-80">
                  <BannerPlaceholder tags={project.technologies} />
                </div>
              )}
            </motion.div>

            {/* Video demo — shown right after the banner so visitors see it first */}
            {project.videoUrl && <VideoDemo url={project.videoUrl} title={project.title} />}

            {/* About */}
            <Card title="About This Project">
              <p className="text-sm leading-7 text-slate-600">{project.description}</p>
            </Card>

            {/* Features — one card per "## Module" heading; legacy admin/user lists keep their own cards */}
            {[
              ...groupFeatures(project.features).map((g) => ({ ...g, heading: g.heading || 'Key Features' })),
              ...(project.adminFeatures?.length ? [{ heading: 'Admin Features', items: project.adminFeatures }] : []),
              ...(project.userFeatures?.length ? [{ heading: 'User / Client Features', items: project.userFeatures }] : []),
            ].map((group, i) => (
              <Card key={`${group.heading}-${i}`} title={group.heading}>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {group.items.map((f) => (
                    <FeatureItem key={f} text={f} />
                  ))}
                </ul>
              </Card>
            ))}

            {/* Case study: problem -> solution -> result */}
            <CaseStudy problem={project.clientProblem} solution={project.solution} results={project.results} />

            {/* Screenshots */}
            {project.screenshots && project.screenshots.length > 0 && (
              <Card title="Screenshots">
                <ScreenshotGallery screenshots={project.screenshots} title={project.title} />
              </Card>
            )}

          </div>

          {/* Sidebar */}
          <aside className="space-y-5 lg:sticky lg:top-24 lg:h-fit">

            {/* Enquiry CTA */}
            <div className="rounded-2xl border border-teal-100 bg-gradient-to-br from-teal-50 to-white p-6 shadow-[0_2px_16px_rgba(15,23,42,0.07)]">
              <p className="mb-1 text-sm font-bold text-slate-900">Interested in this project?</p>
              <p className="mb-5 text-xs leading-5 text-slate-500">
                No fixed price — send an enquiry with your requirements and get a response within 24 hours.
              </p>
              <div className="space-y-3">
                <Link
                  href={enquiryHref}
                  className="flex w-full items-center justify-center rounded-full bg-teal-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-teal-500"
                >
                  Send Enquiry
                </Link>
                <Link
                  href={demoEnquiryHref}
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-300 px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:border-teal-400 hover:text-teal-700"
                >
                  Request Demo <ArrowUpRight className="h-4 w-4" />
                </Link>
                {demoUrl && (
                  <a
                    href={demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-teal-200 px-5 py-2.5 text-sm font-bold text-teal-700 transition hover:bg-teal-50"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Live Demo
                  </a>
                )}
                {repoUrl && (
                  <a
                    href={repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                  >
                    <Code2 className="h-4 w-4" />
                    View Code
                  </a>
                )}
              </div>
            </div>

            {/* Project snapshot */}
            {(project.industry || project.role || project.duration) && (
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_2px_16px_rgba(15,23,42,0.07)]">
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Project Snapshot</p>
                <dl className="space-y-3 text-sm">
                  {[
                    ['Industry', project.industry],
                    ['My Role', project.role],
                    ['Duration', project.duration],
                  ]
                    .filter(([, v]) => v)
                    .map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-4">
                        <dt className="text-slate-400">{k}</dt>
                        <dd className="text-right font-semibold text-slate-800">{v}</dd>
                      </div>
                    ))}
                </dl>
              </div>
            )}

            {/* Tech Stack */}
            {project.technologies && project.technologies.length > 0 && (
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_2px_16px_rgba(15,23,42,0.07)]">
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                  Tech Stack
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((t) => (
                    <TechChip key={t} tag={t} />
                  ))}
                </div>
              </div>
            )}

            {/* Customization note */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_2px_16px_rgba(15,23,42,0.07)]">
              <p className="mb-1 text-sm font-bold text-slate-900">Need customization?</p>
              <p className="text-xs leading-5 text-slate-500">
                All projects can be tailored to your business — branding, features, integrations, and deployment.
              </p>
            </div>

            {/* Back link */}
            <Link
              href="/projects"
              className="flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-white p-5 text-sm font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
            >
              <ArrowLeft className="h-4 w-4" />
              All Projects
            </Link>
          </aside>
        </div>
      </div>

      {/* Mobile sticky CTA */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/90 p-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-md gap-2 pr-16">
          <Link href={enquiryHref} className="flex flex-1 items-center justify-center rounded-full bg-teal-600 px-4 py-2.5 text-sm font-bold text-white">
            Send Enquiry
          </Link>
          <Link href={demoEnquiryHref} className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700">
            Request Demo <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
