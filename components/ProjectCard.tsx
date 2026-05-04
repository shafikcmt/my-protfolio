import Link from 'next/link'

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
    <article className="group overflow-hidden rounded-3xl border border-slate-700/70 bg-slate-900/80 p-5 shadow-2xl shadow-black/20 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-primary-400/70">
      <div className="relative mb-5 h-56 overflow-hidden rounded-3xl bg-slate-950/70">
        {image ? (
          <div className="h-full w-full bg-cover bg-center transition duration-500 group-hover:scale-105" style={{ backgroundImage: `url(${image})` }} />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-500/20 via-slate-900 to-purple-500/20 text-5xl">
            🚀
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 to-transparent p-4">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary-200">Featured Project</p>
        </div>
      </div>

      <h3 className="mb-3 text-2xl font-black text-white">{title}</h3>
      <p className="mb-5 line-clamp-3 leading-7 text-slate-300">{shortDescription || description}</p>

      <div className="mb-6 flex flex-wrap gap-2">
        {technologies.map((tech) => (
          <span key={tech} className="rounded-full bg-slate-950/80 px-3 py-1 text-xs font-semibold text-slate-200 ring-1 ring-slate-700">
            {tech}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        {demoUrl && (
          <a
            href={demoUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-emerald-400/70 px-4 py-2 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-500/10"
          >
            Live Demo
          </a>
        )}
        {repoUrl && (
          <a
            href={repoUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-slate-500 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-slate-800"
          >
            GitHub
          </a>
        )}
        <Link
          href={`/projects/${slug}`}
          className="rounded-full border border-primary-400 px-4 py-2 text-sm font-semibold text-primary-100 transition hover:bg-primary-500/10"
        >
          Details
        </Link>
        <Link
          href={`/order-project?project=${slug}`}
          className="rounded-full bg-primary-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-400"
        >
          Order Similar
        </Link>
      </div>
    </article>
  )
}
