'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import {
  ArrowRight,
  Award,
  BadgeCheck,
  BookOpen,
  Clock,
  MessageCircle,
  Users,
} from 'lucide-react'
import CourseCard from '@/components/CourseCard'
import { COURSE_LIST } from '@/lib/constants'
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal'

const TRUST_ITEMS = [
  { icon: <BookOpen className="h-4 w-4" />, label: '10+ Courses Available'    },
  { icon: <Users   className="h-4 w-4" />, label: '200+ Students Enrolled'    },
  { icon: <Award   className="h-4 w-4" />, label: 'Certificate on Completion' },
  { icon: <Clock   className="h-4 w-4" />, label: 'Learn at Your Own Pace'    },
]

function CardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="aspect-video bg-slate-100" />
      <div className="space-y-3 p-5">
        <div className="h-4 w-3/4 rounded bg-slate-100" />
        <div className="h-3 w-full rounded bg-slate-100" />
        <div className="h-3 w-4/5 rounded bg-slate-100" />
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="h-4 rounded bg-slate-100" />
          <div className="h-4 rounded bg-slate-100" />
          <div className="h-4 rounded bg-slate-100" />
          <div className="h-4 rounded bg-slate-100" />
        </div>
        <div className="mt-2 h-9 rounded-xl bg-slate-100" />
      </div>
    </div>
  )
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('All')

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const { data } = await axios.get('/api/courses')
        const apiCourses = Array.isArray(data.data) ? data.data : []
        setCourses(apiCourses.length ? apiCourses : COURSE_LIST)
      } catch {
        setCourses(COURSE_LIST)
      } finally {
        setLoading(false)
      }
    }
    loadCourses()
  }, [])

  const categories = [
    'All',
    ...Array.from(new Set(courses.map((c) => c.category).filter(Boolean))),
  ]
  const filteredCourses =
    category === 'All' ? courses : courses.filter((c) => c.category === category)

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* ═══════════════════════════════════════
          HERO
      ═══════════════════════════════════════ */}
      <section className="border-b border-slate-100 bg-white">
        <div className="container-custom py-16 lg:py-20">
          <Reveal variant="blur-rise" className="mx-auto max-w-3xl text-center">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-teal-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-teal-700">
              <BadgeCheck className="h-3.5 w-3.5" /> Online Courses
            </span>
            <h1 className="mb-5 text-4xl font-black leading-tight tracking-tight text-slate-900 sm:text-5xl">
              Learn{' '}
              <span className="text-teal-600">Web Development</span>
              <br className="hidden sm:block" />
              by Building Real Projects
            </h1>
            <p className="mb-8 text-base leading-relaxed text-slate-500 sm:text-lg">
              Project-based courses designed to take you from concept to deployment.
              Learn Laravel, Next.js, MERN Stack and more — with practical, hands-on lessons.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/book-consultation" className="btn-primary gap-2">
                Join Live Training <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/contact" className="btn-secondary gap-2">
                Ask a Question
              </Link>
            </div>
          </Reveal>

          {/* Trust bar */}
          <Reveal variant="fade" delay={0.15} className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-3">
            {TRUST_ITEMS.map((item) => (
              <span
                key={item.label}
                className="flex items-center gap-2 text-sm font-medium text-slate-500"
              >
                <span className="text-teal-500">{item.icon}</span>
                {item.label}
              </span>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FILTER + GRID
      ═══════════════════════════════════════ */}
      <section className="container-custom py-14 lg:py-16">

        {/* Section heading */}
        <Reveal variant="rise" className="mb-8">
          <span className="mb-2 inline-block text-xs font-bold uppercase tracking-widest text-teal-600">
            Course Catalogue
          </span>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            All Courses
          </h2>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-slate-500">
            Browse by category or explore the full catalogue — every course is taught with
            real project examples and covers deployment from start to finish.
          </p>
        </Reveal>

        {/* Category tabs */}
        <div className="-mx-4 mb-8 px-4 sm:mx-0 sm:px-0">
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
            {loading
              ? ['All', 'Loading...'].map((cat) => (
                  <div
                    key={cat}
                    className="h-9 w-20 flex-shrink-0 animate-pulse rounded-full bg-slate-100"
                  />
                ))
              : categories.map((item) => (
                  <button
                    key={item}
                    onClick={() => setCategory(item)}
                    className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                      category === item
                        ? 'bg-teal-600 text-white shadow-sm'
                        : 'border border-slate-200 bg-white text-slate-600 hover:border-teal-300 hover:text-teal-600'
                    }`}
                  >
                    {item}
                  </button>
                ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : filteredCourses.length > 0 ? (
          <Stagger key={category} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" stagger={0.07} amount={0.05}>
            {filteredCourses.map((course) => (
              <StaggerItem key={course._id || course.slug} as="div" variant="rise" className="h-full">
                <CourseCard
                  title={course.title}
                  description={course.shortDescription || course.description}
                  instructor={course.instructor || 'Md Shafiqul Islam'}
                  category={course.category || 'Full Stack'}
                  price={course.price}
                  level={course.level}
                  duration={course.duration}
                  lessons={course.totalLessons || course.lessons}
                  slug={course.slug}
                  image={course.image}
                  isFree={course.isFree}
                />
              </StaggerItem>
            ))}
          </Stagger>
        ) : (
          <div className="flex flex-col items-center gap-4 py-24 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
              <BookOpen className="h-6 w-6 text-slate-400" />
            </div>
            <p className="text-sm font-semibold text-slate-600">
              No courses found in this category.
            </p>
            <p className="text-xs text-slate-400">Try selecting a different category above.</p>
            <button
              onClick={() => setCategory('All')}
              className="rounded-full border border-teal-200 bg-teal-50 px-5 py-2 text-sm font-bold text-teal-700 transition hover:bg-teal-100"
            >
              View all courses
            </button>
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════════
          WHY LEARN WITH ME
      ═══════════════════════════════════════ */}
      <section className="border-y border-slate-100 bg-white py-14 lg:py-16">
        <div className="container-custom">
          <Reveal variant="rise" className="mb-10 text-center">
            <span className="mb-3 inline-block text-xs font-bold uppercase tracking-widest text-teal-600">
              Why Learn Here
            </span>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Practical. Project-Based. Real Results.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-500">
              Every course is built around shipping real code — not slides and theory.
              You finish each course with a portfolio-ready project.
            </p>
          </Reveal>

          <Stagger className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4" stagger={0.08}>
            {[
              {
                icon: <BookOpen className="h-5 w-5" />,
                title: 'Project-based learning',
                body: 'Every lesson is tied to a real application you build and can show in your portfolio.',
                accent: 'bg-teal-50 text-teal-600',
              },
              {
                icon: <Clock className="h-5 w-5" />,
                title: 'Self-paced access',
                body: 'Watch on your schedule. Rewatch any lesson as many times as you need.',
                accent: 'bg-sky-50 text-sky-600',
              },
              {
                icon: <Users className="h-5 w-5" />,
                title: 'Live training option',
                body: 'Prefer live sessions? Join an online batch or book a private mentorship call.',
                accent: 'bg-violet-50 text-violet-600',
              },
              {
                icon: <Award className="h-5 w-5" />,
                title: 'Certificate included',
                body: 'Receive a completion certificate you can share on LinkedIn and your resume.',
                accent: 'bg-emerald-50 text-emerald-600',
              },
            ].map((item) => (
              <StaggerItem
                key={item.title}
                as="div"
                variant="rise"
                className="group rounded-2xl border border-slate-200 bg-[#F8FAFC] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-md"
              >
                <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-105 ${item.accent}`}>
                  {item.icon}
                </div>
                <h3 className="mb-1.5 text-sm font-bold text-slate-900">{item.title}</h3>
                <p className="text-xs leading-relaxed text-slate-500">{item.body}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CTA
      ═══════════════════════════════════════ */}
      <section className="container-custom py-16 pb-20">
        <Reveal variant="scale" duration={0.7} className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-600 to-teal-700 px-8 py-14 text-center glow-pulse">
          <span className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
          <span className="pointer-events-none absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-teal-300/20 blur-3xl" />
          <p className="relative mb-3 text-sm font-bold uppercase tracking-widest text-teal-200">
            Want More Than a Course?
          </p>
          <h2 className="relative mb-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
            Join a Live Training Batch
          </h2>
          <p className="relative mx-auto mb-8 max-w-lg text-base text-teal-100">
            Get real-time mentorship, project feedback, and group sessions — enroll in the
            next live batch and build faster with direct guidance.
          </p>
          <div className="relative flex flex-wrap justify-center gap-3">
            <Link
              href="/book-consultation"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-teal-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              Book a Consultation <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-teal-400 px-6 py-3 text-sm font-bold text-white transition hover:bg-teal-500"
            >
              <MessageCircle className="h-4 w-4" /> Ask a Question
            </Link>
          </div>
        </Reveal>
      </section>

    </div>
  )
}
