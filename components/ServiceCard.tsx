import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface ServiceCardProps {
  title: string
  description: string
  price?: number
  startingPrice?: string
  duration?: string
  technologies: string[]
  slug: string
  icon?: React.ReactNode
  accent?: string
}

export default function ServiceCard({
  title,
  description,
  price,
  startingPrice,
  duration,
  technologies,
  slug,
  icon,
  accent = 'bg-teal-50 text-teal-600',
}: ServiceCardProps) {
  return (
    <div className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-md">
      {/* Icon + price row */}
      <div className="mb-4 flex items-start justify-between gap-4">
        {icon ? (
          <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${accent}`}>
            {icon}
          </div>
        ) : (
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
            <span className="text-lg">✦</span>
          </div>
        )}
        {(price !== undefined || startingPrice) && (
          <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-right">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
              From
            </p>
            <p className="text-sm font-bold text-teal-700">
              {startingPrice ?? `$${price}`}
            </p>
          </div>
        )}
      </div>

      {/* Title */}
      <h3 className="mb-2 text-lg font-bold text-slate-900 transition-colors group-hover:text-teal-700">
        {title}
      </h3>

      {/* Description */}
      <p className="mb-4 flex-1 text-sm leading-relaxed text-slate-500">{description}</p>

      {/* Tech tags */}
      {technologies.length > 0 && (
        <div className="mb-5 flex flex-wrap gap-1.5">
          {technologies.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-600"
            >
              {tech}
            </span>
          ))}
        </div>
      )}

      {/* Duration if available */}
      {duration && (
        <p className="mb-4 text-xs text-slate-400">
          Typical delivery: <span className="font-semibold text-slate-600">{duration}</span>
        </p>
      )}

      {/* CTA link */}
      <Link
        href={`/services/${slug}`}
        className="inline-flex items-center gap-1.5 text-sm font-bold text-teal-600 transition-all hover:gap-2.5 hover:text-teal-500"
      >
        View details <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  )
}
