'use client'

import { useEffect, useMemo, useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen,
  Clock,
  Award,
  User,
  CheckCircle,
  Lock,
  Unlock,
  ChevronRight,
  ChevronLeft,
  BadgeCheck,
  Layers,
  Camera,
  X,
  ZoomIn,
} from 'lucide-react'
import LoadingSpinner from '@/components/LoadingSpinner'
import EmptyState from '@/components/EmptyState'
import { useAuth } from '@/contexts/AuthContext'

/* ─── Lightbox ─── */
function Lightbox({
  images,
  index,
  onClose,
}: {
  images: string[]
  index: number
  onClose: () => void
}) {
  const [current, setCurrent] = useState(index)

  const prev = useCallback(() => setCurrent((c) => (c - 1 + images.length) % images.length), [images.length])
  const next = useCallback(() => setCurrent((c) => (c + 1) % images.length), [images.length])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, prev, next])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
        aria-label="Close"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Counter */}
      <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
        {current + 1} / {images.length}
      </span>

      {/* Prev */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); prev() }}
          className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25 sm:left-6"
          aria-label="Previous"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}

      {/* Image */}
      <motion.div
        key={current}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.18 }}
        className="relative max-h-[85vh] max-w-5xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[current]}
          alt={`Screenshot ${current + 1}`}
          className="mx-auto max-h-[85vh] w-auto rounded-xl object-contain shadow-2xl"
        />
      </motion.div>

      {/* Next */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); next() }}
          className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25 sm:right-6"
          aria-label="Next"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}
    </motion.div>
  )
}

/* ─── Screenshots gallery ─── */
function ScreenshotGallery({ screenshots }: { screenshots: string[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  if (!screenshots?.length) return null

  return (
    <>
      <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_2px_16px_rgba(15,23,42,0.07)] sm:p-8">
        <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-slate-900">
          <Camera className="h-5 w-5 text-teal-500" />
          Course Screenshots
          <span className="ml-1 rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-600">
            {screenshots.length}
          </span>
        </h2>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {screenshots.map((src, i) => (
            <button
              key={i}
              onClick={() => setLightboxIndex(i)}
              className="group relative aspect-video overflow-hidden rounded-xl border border-slate-200 bg-slate-100 transition hover:border-teal-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-teal-400"
              aria-label={`View screenshot ${i + 1}`}
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                style={{ backgroundImage: `url(${src})` }}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/20">
                <ZoomIn className="h-6 w-6 scale-0 text-white drop-shadow transition-transform duration-200 group-hover:scale-100" />
              </div>
            </button>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            images={screenshots}
            index={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
}

/* ─── Main page ─── */
export default function CourseDetailPage({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [course, setCourse] = useState<any>(null)
  const [lessons, setLessons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)
  const [alreadyEnrolled, setAlreadyEnrolled] = useState(false)

  useEffect(() => {
    const loadCourse = async () => {
      try {
        const { data } = await axios.get(`/api/courses?slug=${params.slug}`)
        setCourse(data.data.course)
        setLessons(data.data.lessons || [])
      } catch {
        setCourse(null)
      } finally {
        setLoading(false)
      }
    }
    loadCourse()
  }, [params.slug])

  useEffect(() => {
    const checkEnrollment = async () => {
      if (!course?._id || !isAuthenticated || user?.role !== 'student') return
      try {
        const { data } = await axios.get(`/api/student/enrollments?courseId=${course._id}`)
        setAlreadyEnrolled(Boolean(data.data))
      } catch {
        setAlreadyEnrolled(false)
      }
    }
    checkEnrollment()
  }, [course?._id, isAuthenticated, user?.role])

  const priceText = useMemo(() => {
    if (!course) return ''
    return course.isFree || !course.price ? 'Free' : `$${course.price}`
  }, [course])

  const handleEnroll = async () => {
    if (!course?._id) return
    if (!isAuthenticated) {
      toast.error('Please login as a student to enroll')
      router.push(`/auth/login?redirect=/courses/${params.slug}`)
      return
    }
    if (user?.role !== 'student') {
      toast.error('Only student accounts can enroll in courses')
      return
    }
    try {
      setEnrolling(true)
      const { data } = await axios.post('/api/student/enrollments', { courseId: course._id })
      setAlreadyEnrolled(true)
      toast.success(data.message || 'Enrolled successfully!')
      router.push(`/dashboard/student/courses/${course._id}`)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Enrollment failed')
    } finally {
      setEnrolling(false)
    }
  }

  if (loading) {
    return (
      <div className="container-custom py-24">
        <LoadingSpinner />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="container-custom py-24">
        <EmptyState title="Course not found" description="This course may be unpublished or removed." />
        <div className="mt-6 text-center">
          <Link href="/courses" className="btn-secondary">
            Back to Courses
          </Link>
        </div>
      </div>
    )
  }

  const screenshots: string[] = Array.isArray(course.screenshots)
    ? course.screenshots.filter(Boolean)
    : []

  const defaultOutcomes = [
    `Build production-ready applications with ${course.category || 'modern web technologies'}.`,
    'Implement authentication, API integration, and deployment workflows.',
    'Understand real project structure and full-stack development process.',
  ]

  const defaultRequirements = [
    'Basic computer knowledge',
    'Laptop or desktop with internet connection',
    'Willingness to build real-world projects',
  ]

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
    <div className="container-custom py-12 lg:py-20">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-slate-500">
        <Link href="/" className="transition hover:text-teal-600">Home</Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
        <Link href="/courses" className="transition hover:text-teal-600">Courses</Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
        <span className="max-w-[200px] truncate font-medium text-slate-700 sm:max-w-none">
          {course.title}
        </span>
      </nav>

      {/* Page header */}
      <div className="mb-10">
        {course.category && (
          <span className="mb-3 inline-flex rounded-full bg-teal-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-teal-700">
            {course.category}
          </span>
        )}
        <h1 className="mb-3 max-w-3xl text-2xl font-black tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
          {course.title}
        </h1>
        {(course.shortDescription || course.description) && (
          <p className="max-w-2xl text-base leading-7 text-slate-500">
            {course.shortDescription || course.description?.slice(0, 180)}
          </p>
        )}
      </div>

      {/* Main grid */}
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* ── Left: content ── */}
        <div className="min-w-0 space-y-5">

          {/* Course Overview */}
          <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_2px_16px_rgba(15,23,42,0.07)] sm:p-8">
            <h2 className="mb-4 text-lg font-bold text-slate-900">Course Overview</h2>
            <p className="leading-7 text-slate-600">{course.description}</p>
          </section>

          {/* Screenshots gallery — only shown when screenshots exist */}
          <ScreenshotGallery screenshots={screenshots} />

          {/* What you'll learn + Requirements */}
          <div className="grid gap-5 sm:grid-cols-2">
            <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_2px_16px_rgba(15,23,42,0.07)]">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-900">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                What You&apos;ll Learn
              </h3>
              <ul className="space-y-2.5">
                {(course.learningOutcomes?.length ? course.learningOutcomes : defaultOutcomes).map(
                  (item: string, i: number) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      <span className="text-sm leading-6 text-slate-600">{item}</span>
                    </li>
                  )
                )}
              </ul>
            </section>

            <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_2px_16px_rgba(15,23,42,0.07)]">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-900">
                <Layers className="h-4 w-4 text-teal-500" />
                Requirements
              </h3>
              <ul className="space-y-2.5">
                {(course.requirements?.length ? course.requirements : defaultRequirements).map(
                  (item: string, i: number) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-400" />
                      <span className="text-sm leading-6 text-slate-600">{item}</span>
                    </li>
                  )
                )}
              </ul>
            </section>
          </div>

          {/* Curriculum */}
          <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_2px_16px_rgba(15,23,42,0.07)] sm:p-8">
            <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-slate-900">
              <BookOpen className="h-5 w-5 text-teal-500" />
              Course Curriculum
              {lessons.length > 0 && (
                <span className="ml-1 rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-600">
                  {lessons.length} lessons
                </span>
              )}
            </h2>

            {lessons.length ? (
              <div className="space-y-2">
                {lessons.map((lesson, index) => {
                  const accessible = lesson.accessible || lesson.isPreview
                  return (
                    <div
                      key={lesson._id || lesson.title}
                      className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 transition hover:border-teal-200 hover:bg-teal-50/30"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-600">
                          {index + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-800">{lesson.title}</p>
                          {lesson.duration && (
                            <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                              <Clock className="h-3 w-3" />
                              {lesson.duration} min
                            </p>
                          )}
                        </div>
                      </div>
                      <span
                        className={`shrink-0 inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${
                          accessible
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                            : 'border-amber-200 bg-amber-50 text-amber-700'
                        }`}
                      >
                        {accessible ? (
                          <><Unlock className="h-3 w-3" /> Preview</>
                        ) : (
                          <><Lock className="h-3 w-3" /> Locked</>
                        )}
                      </span>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="py-6 text-center text-sm text-slate-500">
                Lessons will be added soon. Enroll now to get access as they are released.
              </p>
            )}
          </section>
        </div>

        {/* ── Right: sticky sidebar ── */}
        <aside className="h-fit lg:sticky lg:top-24">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_4px_28px_rgba(15,23,42,0.10)]">
            {/* Course thumbnail */}
            {course.image && (
              <div className="mb-5 aspect-video w-full overflow-hidden rounded-xl bg-slate-100">
                <div
                  className="h-full w-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${course.image})` }}
                />
              </div>
            )}

            {/* Price */}
            <div className="mb-4 border-b border-slate-100 pb-4">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Price</p>
              <p className="mt-1 text-3xl font-black text-slate-900">{priceText}</p>
            </div>

            {/* Meta */}
            <div className="mb-5 space-y-3">
              <MetaRow icon={<Layers className="h-4 w-4" />} label="Category" value={course.category || 'Full Stack'} />
              <MetaRow icon={<Award className="h-4 w-4" />} label="Level" value={course.level || 'Beginner'} />
              <MetaRow icon={<Clock className="h-4 w-4" />} label="Duration" value={course.duration || 'Flexible'} />
              <MetaRow
                icon={<BookOpen className="h-4 w-4" />}
                label="Lessons"
                value={String(course.totalLessons || course.lessons || lessons.length || 0)}
              />
              <MetaRow icon={<User className="h-4 w-4" />} label="Instructor" value={course.instructor || 'Md Shafiqul Islam'} />
              <MetaRow
                icon={<BadgeCheck className="h-4 w-4" />}
                label="Certificate"
                value={course.certificateEnabled === false ? 'Not Available' : 'Available'}
              />
            </div>

            {/* CTA buttons */}
            <div className="space-y-3">
              {alreadyEnrolled ? (
                <Link href={`/dashboard/student/courses/${course._id}`} className="btn-primary w-full">
                  Continue Learning →
                </Link>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {enrolling ? 'Enrolling...' : 'Enroll Now'}
                </button>
              )}
              <Link href="/book-consultation" className="btn-secondary w-full">
                Ask About Live Training
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
    </div>
  )
}

function MetaRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-slate-500">
        <span className="text-teal-500">{icon}</span>
        <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
      </div>
      <span className="text-right text-sm font-semibold capitalize text-slate-700">{value}</span>
    </div>
  )
}
