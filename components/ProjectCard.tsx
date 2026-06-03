'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ExternalLink, Code2, ArrowUpRight, Star } from 'lucide-react'

interface ProjectCardProps {
  title: string
  description: string
  shortDescription?: string
  technologies?: string[]
  slug: string
  image?: string
  category?: string
  featured?: boolean
  liveDemoUrl?: string
  githubUrl?: string
  link?: string
  codeLink?: string
}

export default function ProjectCard({
  title,
  description,
  shortDescription,
  technologies = [],
  slug,
  image,
  category,
  featured,
  liveDemoUrl,
  githubUrl,
  link,
  codeLink,
}: ProjectCardProps) {
  const demoUrl = liveDemoUrl || link
  const repoUrl = githubUrl || codeLink
  const displayTechs = technologies.slice(0, 4)
  const extra = technologies.length - 4

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_2px_16px_rgba(15,23,42,0.06)] transition-shadow hover:shadow-[0_8px_30px_rgba(15,23,42,0.1)]"
    >
      {/* Image */}
      <div className="relative aspect-video overflow-hidden bg-slate-100">
        {image ? (
          <div
            className="h-full w-full bg-cover bg-center transition duration-500 group-hover:scale-105"
            style={{ backgroundImage: `url(${image})` }}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200">
            <span className="text-5xl font-black text-slate-300">{title.charAt(0)}</span>
          </div>
        )}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {featured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-1 text-[10px] font-bold text-white shadow">
              <Star className="h-2.5 w-2.5" />
              Featured
            </span>
          )}
          {category && (
            <span className="rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
              {category}
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-bold leading-snug text-slate-900">{title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
          {shortDescription || description}
        </p>

        {displayTechs.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {displayTechs.map((tech) => (
              <span
                key={tech}
                className="rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200"
              >
                {tech}
              </span>
            ))}
            {extra > 0 && (
              <span className="rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-400 ring-1 ring-slate-200">
                +{extra}
              </span>
            )}
          </div>
        )}

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
          <Link href={`/projects/${slug}`} className="btn-primary px-4 py-2 text-xs">
            View Details
          </Link>
          {demoUrl ? (
            <a
              href={demoUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary inline-flex items-center gap-1.5 px-4 py-2 text-xs"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Live Demo
            </a>
          ) : (
            <span className="inline-flex cursor-default items-center gap-1.5 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-400">
              Demo on Request
            </span>
          )}
          {repoUrl && (
            <a
              href={repoUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary inline-flex items-center gap-1.5 px-4 py-2 text-xs"
            >
              <Code2 className="h-3.5 w-3.5" />
              Code
            </a>
          )}
          <Link
            href={`/order-project?project=${encodeURIComponent(title)}`}
            className="inline-flex items-center gap-1 px-2 py-2 text-xs font-bold text-teal-700 transition hover:text-teal-600"
          >
            Enquire <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </motion.article>
  )
}
