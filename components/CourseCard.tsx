import Link from 'next/link'

interface CourseCardProps {
  title: string
  description: string
  instructor: string
  category: string
  price?: number
  level?: string
  duration?: string
  lessons?: number
  slug: string
  image?: string
  isFree?: boolean
}

export default function CourseCard({
  title,
  description,
  instructor,
  category,
  price,
  level,
  duration,
  lessons,
  slug,
  image,
  isFree,
}: CourseCardProps) {
  return (
    <div className="glass-card border-slate-700/70 hover:-translate-y-1 transition-transform">
      {image && (
        <div className="mb-5 h-56 overflow-hidden rounded-3xl bg-slate-950/40">
          <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${image})` }} />
        </div>
      )}
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="rounded-full bg-primary-500/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-primary-200">{category}</span>
        {isFree ? (
          <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200">Free</span>
        ) : (
          <span className="rounded-full bg-slate-800/80 px-3 py-1 text-xs text-slate-200">${price}</span>
        )}
      </div>
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-slate-400 leading-7 mb-5">{description}</p>
      <div className="mb-5 grid gap-2 sm:grid-cols-2 text-sm text-slate-400">
        <span>Level: {level}</span>
        <span>Duration: {duration}</span>
        <span>Lessons: {lessons}</span>
        <span>Instructor: {instructor}</span>
      </div>
      <Link
        href={`/courses/${slug}`}
        className="inline-flex items-center justify-center rounded-full bg-primary-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-400"
      >
        View Course
      </Link>
    </div>
  )
}
