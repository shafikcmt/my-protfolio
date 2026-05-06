import Link from 'next/link'
import { ArrowRight, BadgeCheck } from 'lucide-react'

interface ServiceCardProps {
  title: string
  description: string
  price?: number
  technologies: string[]
  slug: string
}

export default function ServiceCard({ title, description, price, technologies, slug }: ServiceCardProps) {
  return (
    <div className="surface-card p-7 transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
            <BadgeCheck className="h-3.5 w-3.5" />
            Premium Service
          </span>
          <h3 className="mt-3 text-2xl font-black text-slate-950">{title}</h3>
        </div>
        {price !== undefined && (
          <div className="rounded-2xl bg-slate-50 px-4 py-3 text-right">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Starts from</p>
            <p className="text-xl font-black text-teal-700">${price}</p>
          </div>
        )}
      </div>
      <p className="mb-6 text-base leading-8 text-slate-600">{description}</p>
      <div className="mb-7 flex flex-wrap gap-2.5">
        {technologies.map((tech) => (
          <span key={tech} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-600">
            {tech}
          </span>
        ))}
      </div>
      <Link
        href={`/services/${slug}`}
        className="inline-flex items-center gap-2 text-sm font-bold text-teal-700 transition hover:gap-3"
      >
        Explore service
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  )
}
