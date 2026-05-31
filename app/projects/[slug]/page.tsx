'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Code2,
  ExternalLink,
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
  status?: string
}

function TechChip({ tag }: { tag: string }) {
  return (
    <span className="rounded-md border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-300">
      {tag}
    </span>
  )
}

function FeatureItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2.5 text-sm text-slate-300">
      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-teal-400" />
      {text}
    </li>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
      <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-teal-400">{title}</h3>
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
      <div className="flex flex-1 p-4 gap-3">
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
      <div className="flex min-h-screen items-center justify-center bg-[#080d1a]">
        <LoadingSpinner />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#080d1a]">
        <p className="text-xl font-semibold text-slate-300">Project not found.</p>
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-teal-500"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Projects
        </Link>
      </div>
    )
  }

  const demoUrl = project.liveDemoUrl || project.link
  const repoUrl = project.githubUrl || project.codeLink
  const hasImage = Boolean(project.image) && !imgError
  const enquiryHref = `/order-project?project=${encodeURIComponent(project.title)}`
  const demoEnquiryHref = `/order-project?project=${encodeURIComponent(project.title)}&type=demo`

  return (
    <div className="min-h-screen bg-[#080d1a]">
      {/* Background glow */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 40% at 50% -10%, rgba(0,212,170,0.07), transparent)',
        }}
      />

      <div className="container-custom relative z-10 py-10 lg:py-16">

        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="transition hover:text-teal-400">Home</Link>
          <span>/</span>
          <Link href="/projects" className="transition hover:text-teal-400">Projects</Link>
          <span>/</span>
          <span className="max-w-[240px] truncate text-slate-300">{project.title}</span>
        </nav>

        {/* ── Hero ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          {/* Badges */}
          <div className="mb-4 flex flex-wrap gap-2">
            {project.featured && (
              <span className="inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-400">
                ⭐ Featured
              </span>
            )}
            <span className="inline-flex items-center rounded-full border border-teal-500/30 bg-teal-500/20 px-3 py-1 text-xs font-bold text-teal-400">
              Available
            </span>
          </div>

          <h1 className="text-3xl font-black tracking-tight text-white lg:text-4xl xl:text-[2.75rem]">
            {project.title}
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400">
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
              className="inline-flex items-center gap-2 rounded-full bg-teal-500 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-teal-400 hover:shadow-[0_0_24px_rgba(0,212,170,0.4)]"
            >
              Send Enquiry
            </Link>
            <Link
              href={demoEnquiryHref}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-2.5 text-sm font-bold text-white/80 transition hover:border-teal-400/40 hover:text-white"
            >
              Request Demo <ArrowUpRight className="h-4 w-4" />
            </Link>
            {demoUrl && (
              <a
                href={demoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-400 transition hover:text-teal-400"
              >
                <ExternalLink className="h-3.5 w-3.5" /> Live Demo
              </a>
            )}
          </div>
        </motion.div>

        {/* ── Content grid ── */}
        <div className="grid gap-6 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_360px]">

          {/* Left column */}
          <div className="space-y-6">

            {/* Banner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="overflow-hidden rounded-[1.75rem] border border-white/10"
              style={{ minHeight: '260px' }}
            >
              {hasImage ? (
                <img
                  src={project.image}
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
              <p className="text-sm leading-7 text-slate-300">{project.description}</p>
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

            {/* User / client features */}
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
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                      Problem
                    </p>
                    <p className="text-sm leading-7 text-slate-300">{project.clientProblem}</p>
                  </div>
                )}
                {project.solution && (
                  <div>
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-teal-500">
                      Solution
                    </p>
                    <p className="text-sm leading-7 text-slate-300">{project.solution}</p>
                  </div>
                )}
              </Card>
            )}

            {/* Screenshots */}
            {project.screenshots && project.screenshots.length > 0 && (
              <Card title="Screenshots">
                <div className="grid gap-3 sm:grid-cols-2">
                  {project.screenshots.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt={`Screenshot ${i + 1}`}
                      className="w-full rounded-2xl border border-white/10 object-cover"
                    />
                  ))}
                </div>
              </Card>
            )}

            {/* Video demo */}
            {project.videoUrl && (
              <Card title="Video Demo">
                <div className="aspect-video overflow-hidden rounded-2xl bg-slate-900">
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

          {/* ── Right sidebar ── */}
          <aside className="space-y-5">

            {/* Enquiry CTA card */}
            <div className="rounded-[1.75rem] border border-teal-500/20 bg-gradient-to-br from-teal-900/30 to-transparent p-6">
              <p className="mb-1 text-sm font-bold text-white">Interested in this project?</p>
              <p className="mb-5 text-xs leading-5 text-slate-400">
                No fixed price — send an enquiry with your requirements and get a response within 24 hours.
              </p>
              <div className="space-y-3">
                <Link
                  href={enquiryHref}
                  className="flex w-full items-center justify-center rounded-full bg-teal-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-teal-400"
                >
                  Send Enquiry
                </Link>
                <Link
                  href={demoEnquiryHref}
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-bold text-white/80 transition hover:border-white/40 hover:text-white"
                >
                  Request Demo <ArrowUpRight className="h-4 w-4" />
                </Link>
                {demoUrl && (
                  <a
                    href={demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-teal-700/50 px-5 py-2.5 text-sm font-bold text-teal-400 transition hover:bg-teal-900/30"
                  >
                    <ExternalLink className="h-4 w-4" /> Live Demo
                  </a>
                )}
                {repoUrl && (
                  <a
                    href={repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-700/50 px-5 py-2.5 text-sm font-bold text-slate-400 transition hover:bg-slate-800/50 hover:text-slate-200"
                  >
                    <Code2 className="h-4 w-4" /> View Code
                  </a>
                )}
              </div>
            </div>

            {/* Technologies */}
            {project.technologies && project.technologies.length > 0 && (
              <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-6">
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
            <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.02] p-5 text-sm text-slate-400">
              <p className="mb-1 font-semibold text-white">Need customization?</p>
              <p className="text-xs leading-5">
                All projects can be tailored to your business — branding, features, integrations, and deployment.
              </p>
            </div>

            {/* Back link */}
            <Link
              href="/projects"
              className="flex items-center gap-2 rounded-[1.75rem] border border-white/10 bg-white/[0.02] p-5 text-sm font-semibold text-slate-400 transition hover:bg-white/[0.04] hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" /> All Projects
            </Link>
          </aside>
        </div>
      </div>
    </div>
  )
}
