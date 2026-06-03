'use client'

import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Code2,
  ExternalLink,
  Star,
  X,
  ZoomIn,
} from 'lucide-react'
import { PROJECT_LIST } from '@/lib/constants'
import LoadingSpinner from '@/components/LoadingSpinner'

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
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_2px_16px_rgba(15,23,42,0.07)]">
      <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-teal-600">{title}</h3>
      {children}
    </div>
  )
}

function BannerPlaceholder({ tags }: { tags?: string[] }) {
  return (
    <div className="flex h-full w-full flex-col bg-gradient-to-br from-slate-900 via-[#0d1525] to-slate-900">
      <div className="flex items-center gap-2 border-b border-slate-700/50 bg-slate-800/90 px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
        </div>
        <div className="mx-2 flex flex-1 items-center gap-1.5 rounded bg-slate-700/50 px-2 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-teal-500/60" />
          <span className="text-[10px] text-slate-500">localhost:3000/dashboard</span>
        </div>
      </div>
      <div className="flex flex-1 gap-3 p-4">
        <div className="flex w-14 flex-col gap-2">
          <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-teal-500/70 to-teal-700/70" />
          {[true, false, false, false, false].map((a, i) => (
            <div key={i} className={`h-2 rounded ${a ? 'bg-teal-700/50' : 'bg-slate-700/40'}`} />
          ))}
        </div>
        <div className="flex-1 space-y-2.5">
          <div className="grid grid-cols-3 gap-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className={`rounded-xl p-2.5 ${i === 0 ? 'bg-teal-900/40' : 'bg-slate-800/70'}`}>
                <div className="h-1.5 w-full rounded bg-slate-600/60" />
                <div className="mt-1.5 h-4 w-2/3 rounded bg-slate-500/30" />
              </div>
            ))}
          </div>
          <div className="space-y-1.5">
            {[true, false, false, false].map((a, i) => (
              <div key={i} className="flex items-center gap-2 rounded-lg bg-slate-800/60 p-2">
                <div className={`h-3 w-3 rounded ${a ? 'bg-teal-600/70' : 'bg-slate-700/60'}`} />
                <div className="h-2 flex-1 rounded bg-slate-600/50" />
                <div className={`h-3 w-8 rounded-full ${a ? 'bg-green-800/50' : 'bg-slate-700/40'}`} />
              </div>
            ))}
          </div>
        </div>
      </div>
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 border-t border-slate-800/60 px-4 py-2.5">
          {tags.slice(0, 4).map((t) => (
            <span key={t} className="rounded-full bg-teal-900/50 px-2 py-0.5 text-[10px] font-bold text-teal-400">
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
            className="group relative aspect-video overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.15 }}
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
                className="absolute -right-4 -top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </button>
              {screenshots.length > 1 && (
                <>
                  <button
                    onClick={prev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={next}
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
    <div className="min-h-screen">
      <div className="container-custom py-10 lg:py-16">

        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-slate-400">
          <Link href="/" className="transition hover:text-teal-600">Home</Link>
          <span>/</span>
          <Link href="/projects" className="transition hover:text-teal-600">Projects</Link>
          <span>/</span>
          <span className="max-w-[240px] truncate text-slate-700">{project.title}</span>
        </nav>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="mb-4 flex flex-wrap gap-2">
            {project.featured && (
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
                <Star className="h-3 w-3" />
                Featured
              </span>
            )}
            {project.category && (
              <span className="inline-flex items-center rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-bold text-primary-700">
                {project.category}
              </span>
            )}
            <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
              Available
            </span>
          </div>

          <h1 className="text-3xl font-black tracking-tight text-slate-900 lg:text-4xl xl:text-[2.75rem]">
            {project.title}
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-500">
            {project.shortDescription ||
              (project.description.length > 200
                ? project.description.slice(0, 200) + '…'
                : project.description)}
          </p>

          {project.technologies && project.technologies.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {project.technologies.map((t) => (
                <TechChip key={t} tag={t} />
              ))}
            </div>
          )}

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href={enquiryHref}
              className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-teal-500"
            >
              Send Enquiry
            </Link>
            <Link
              href={demoEnquiryHref}
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-6 py-2.5 text-sm font-bold text-slate-700 transition hover:border-teal-400 hover:text-teal-700"
            >
              Request Demo <ArrowUpRight className="h-4 w-4" />
            </Link>
            {demoUrl && (
              <a
                href={demoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition hover:text-teal-600"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Live Demo
              </a>
            )}
          </div>
        </motion.div>

        {/* Content grid */}
        <div className="grid gap-6 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_360px]">

          {/* Left column */}
          <div className="space-y-6">

            {/* Banner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="overflow-hidden rounded-2xl border border-slate-200"
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
                  className="h-64 w-full object-cover lg:h-80"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="h-64 lg:h-80">
                  <BannerPlaceholder tags={project.technologies} />
                </div>
              )}
            </motion.div>

            {/* About */}
            <Card title="About This Project">
              <p className="text-sm leading-7 text-slate-600">{project.description}</p>
            </Card>

            {/* Key features */}
            {project.features && project.features.length > 0 && (
              <Card title="Key Features">
                <ul className="space-y-3">
                  {project.features.map((f) => (
                    <FeatureItem key={f} text={f} />
                  ))}
                </ul>
              </Card>
            )}

            {/* Admin features */}
            {project.adminFeatures && project.adminFeatures.length > 0 && (
              <Card title="Admin Features">
                <ul className="space-y-3">
                  {project.adminFeatures.map((f) => (
                    <FeatureItem key={f} text={f} />
                  ))}
                </ul>
              </Card>
            )}

            {/* User features */}
            {project.userFeatures && project.userFeatures.length > 0 && (
              <Card title="User / Client Features">
                <ul className="space-y-3">
                  {project.userFeatures.map((f) => (
                    <FeatureItem key={f} text={f} />
                  ))}
                </ul>
              </Card>
            )}

            {/* Problem & Solution */}
            {(project.clientProblem || project.solution) && (
              <Card title="Problem & Solution">
                {project.clientProblem && (
                  <div className="mb-5">
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
                      Problem
                    </p>
                    <p className="text-sm leading-7 text-slate-600">{project.clientProblem}</p>
                  </div>
                )}
                {project.solution && (
                  <div>
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-teal-600">
                      Solution
                    </p>
                    <p className="text-sm leading-7 text-slate-600">{project.solution}</p>
                  </div>
                )}
              </Card>
            )}

            {/* Screenshots */}
            {project.screenshots && project.screenshots.length > 0 && (
              <Card title="Screenshots">
                <ScreenshotGallery screenshots={project.screenshots} title={project.title} />
              </Card>
            )}

            {/* Video demo */}
            {project.videoUrl && (
              <Card title="Video Demo">
                <div className="aspect-video overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                  <iframe
                    src={project.videoUrl}
                    className="h-full w-full"
                    allow="autoplay; fullscreen"
                    allowFullScreen
                    title="Project demo video"
                  />
                </div>
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
    </div>
  )
}
