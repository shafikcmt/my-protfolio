import Link from 'next/link'
import { ArrowUpRight, Code2, ExternalLink } from 'lucide-react'

interface ProjectCardProps {
  title: string
  description: string
  shortDescription?: string
  technologies?: string[]
  slug: string
  image?: string
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
  liveDemoUrl,
  githubUrl,
  link,
  codeLink,
}: ProjectCardProps) {
  const demoUrl = liveDemoUrl || link
  const repoUrl = githubUrl || codeLink

  return (
    <article className="group surface-card overflow-hidden p-5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
      <div className="relative mb-6 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-gradient-to-br from-teal-50 via-white to-cyan-50 p-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(13,148,136,0.14),_transparent_25%)]" />
        <div className="relative aspect-[16/10] overflow-hidden rounded-[1.25rem] bg-white shadow-sm">
          {image ? (
            <div className="h-full w-full bg-cover bg-center transition duration-500 group-hover:scale-105" style={{ backgroundImage: `url(${image})` }} />
          ) : (
            <div className="flex h-full flex-col justify-between p-5 hero-grid">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-teal-600 px-3 py-1 text-xs font-semibold text-white">Featured</span>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">UI / UX</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="h-16 rounded-2xl bg-slate-100" />
                <div className="h-16 rounded-2xl bg-slate-100" />
                <div className="h-16 rounded-2xl bg-teal-100" />
                <div className="col-span-2 h-24 rounded-2xl bg-slate-100" />
                <div className="h-24 rounded-2xl bg-cyan-100" />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Selected Project</p>
          <h3 className="mt-2 text-2xl font-black text-slate-950">{title}</h3>
        </div>
        <div className="hidden rounded-2xl bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-500 sm:block">Modern UI</div>
      </div>
      <p className="mt-4 line-clamp-3 text-base leading-8 text-slate-600">{shortDescription || description}</p>

      <div className="mt-5 flex flex-wrap gap-2.5">
        {technologies.map((tech) => (
          <span key={tech} className="rounded-full bg-slate-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-600 ring-1 ring-slate-200">
            {tech}
          </span>
        ))}
      </div>

      <div className="mt-7 flex flex-wrap gap-3">
        {demoUrl && (
          <a
            href={demoUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-primary px-5 py-2.5"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Live Demo
          </a>
        )}
        {repoUrl && (
          <a
            href={repoUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-secondary px-5 py-2.5"
          >
            <Code2 className="mr-2 h-4 w-4" />
            Source Code
          </a>
        )}
        <Link href={`/projects/${slug}`} className="btn-secondary px-5 py-2.5">
          Details
        </Link>
        <Link href={`/order-project?project=${slug}`} className="inline-flex items-center gap-2 rounded-full px-2 py-2 text-sm font-bold text-teal-700 transition hover:text-teal-800">
          Order Similar
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  )
}
