import Link from 'next/link'

interface ServiceCardProps {
  title: string
  description: string
  price?: number
  technologies: string[]
  slug: string
}

export default function ServiceCard({ title, description, price, technologies, slug }: ServiceCardProps) {
  return (
    <div className="glass-card border-slate-700/70 hover:-translate-y-1 transition-transform">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        {price !== undefined && <span className="text-sm text-primary-300">Starts at ${price}</span>}
      </div>
      <p className="text-slate-300 leading-7 mb-5">{description}</p>
      <div className="mb-6 flex flex-wrap gap-2">
        {technologies.map((tech) => (
          <span key={tech} className="rounded-full border border-slate-700/70 bg-slate-900/70 px-3 py-1 text-xs text-slate-200">
            {tech}
          </span>
        ))}
      </div>
      <Link
        href={`/services/${slug}`}
        className="inline-flex items-center gap-2 rounded-full border border-primary-400 px-4 py-2 text-sm font-semibold text-primary-100 transition hover:bg-primary-500/10"
      >
        Order Service →
      </Link>
    </div>
  )
}
