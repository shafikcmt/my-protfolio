'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { BookOpen, Clock, Award, User } from 'lucide-react'

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
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_2px_16px_rgba(15,23,42,0.07)] transition-shadow hover:shadow-[0_8px_32px_rgba(15,23,42,0.12)]"
    >
      {/* 16:9 image area */}
      <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-slate-100">
        {image ? (
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 hover:scale-105"
            style={{ backgroundImage: `url(${image})` }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-50 via-violet-50 to-slate-100">
            <BookOpen className="h-12 w-12 text-primary-200" />
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-primary-600/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
          {category}
        </span>
        <span className="absolute right-3 top-3">
          {isFree ? (
            <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white">
              Free
            </span>
          ) : price ? (
            <span className="rounded-full bg-slate-900/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              ${price}
            </span>
          ) : null}
        </span>
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-2 text-base font-bold leading-snug text-slate-900 sm:text-[17px]">
          {title}
        </h3>
        <p className="mb-4 line-clamp-2 text-sm leading-6 text-slate-500">{description}</p>

        {/* Meta info */}
        <div className="mb-5 grid grid-cols-2 gap-x-3 gap-y-2">
          <MetaItem icon={<Award className="h-3.5 w-3.5" />} label={level || 'Beginner'} />
          <MetaItem icon={<Clock className="h-3.5 w-3.5" />} label={duration || 'Flexible'} />
          <MetaItem icon={<BookOpen className="h-3.5 w-3.5" />} label={`${lessons || 0} Lessons`} />
          <MetaItem icon={<User className="h-3.5 w-3.5" />} label={instructor} />
        </div>

        <Link
          href={`/courses/${slug}`}
          className="mt-auto inline-flex w-full items-center justify-center rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
        >
          View Course →
        </Link>
      </div>
    </motion.div>
  )
}

function MetaItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-xs text-slate-500">
      <span className="shrink-0 text-primary-500">{icon}</span>
      <span className="truncate capitalize">{label}</span>
    </span>
  )
}
