'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import toast from 'react-hot-toast'
import SectionTitle from '@/components/SectionTitle'
import LoadingSpinner from '@/components/LoadingSpinner'
import EmptyState from '@/components/EmptyState'
import { useAuth } from '@/contexts/AuthContext'

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
      } catch (error: any) {
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
      } catch (error) {
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
      toast.error('Please login as a student first')
      router.push('/auth/login')
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
      toast.success(data.message || 'Enrolled successfully')
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

  return (
    <div className="container-custom py-24">
      <SectionTitle title={course.title} subtitle={course.shortDescription || course.description} eyebrow="Course Details" />

      <div className="grid gap-10 lg:grid-cols-[0.9fr_0.5fr]">
        <div className="space-y-8">
          <div className="glass-card border-slate-700/70 p-8 lg:p-10">
            <h3 className="mb-4 text-2xl font-semibold text-white">Course Overview</h3>
            <p className="mb-6 leading-8 text-slate-300">{course.description}</p>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl bg-slate-950/70 p-6">
                <h4 className="mb-3 text-lg font-semibold text-white">What you will learn</h4>
                <ul className="list-disc space-y-2 pl-5 text-slate-300">
                  {(course.learningOutcomes?.length ? course.learningOutcomes : [
                    `Build production-ready applications with ${course.category || 'modern web technologies'}.`,
                    'Implement authentication, dashboard, API and deployment workflows.',
                    'Understand real project structure and full-stack development process.',
                  ]).map((item: string) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-3xl bg-slate-950/70 p-6">
                <h4 className="mb-3 text-lg font-semibold text-white">Requirements</h4>
                <ul className="list-disc space-y-2 pl-5 text-slate-300">
                  {(course.requirements?.length ? course.requirements : [
                    'Basic computer knowledge',
                    'Laptop or desktop with internet connection',
                    'Interest in building real-world projects',
                  ]).map((item: string) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="glass-card border-slate-700/70 p-8 lg:p-10">
            <h3 className="mb-5 text-2xl font-semibold text-white">Course Lessons</h3>
            <div className="space-y-3">
              {lessons.length ? lessons.map((lesson, index) => (
                <div key={lesson._id || lesson.title} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                  <div>
                    <p className="font-semibold text-white">{index + 1}. {lesson.title}</p>
                    <p className="text-sm text-slate-400">{lesson.duration ? `${lesson.duration} min` : 'Recorded lesson'} · {lesson.accessible ? 'Preview available' : 'Enrollment required'}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${lesson.accessible ? 'bg-emerald-500/10 text-emerald-200' : 'bg-yellow-500/10 text-yellow-200'}`}>
                    {lesson.accessible ? 'Unlocked' : 'Locked'}
                  </span>
                </div>
              )) : (
                <p className="text-slate-400">Lessons will be added soon.</p>
              )}
            </div>
          </div>
        </div>

        <aside className="glass-card h-fit border-slate-700/70 p-8 lg:p-10">
          {course.image && (
            <div className="mb-6 overflow-hidden rounded-3xl bg-slate-950/40">
              <div className="h-56 w-full bg-cover bg-center" style={{ backgroundImage: `url(${course.image})` }} />
            </div>
          )}

          <div className="space-y-5">
            <Info label="Category" value={course.category || 'Full Stack'} />
            <Info label="Level" value={course.level || 'Beginner'} />
            <Info label="Duration" value={course.duration || 'Flexible'} />
            <Info label="Lessons" value={String(course.totalLessons || course.lessons || lessons.length || 0)} />
            <Info label="Instructor" value={course.instructor || 'Md Shafiqul Islam'} />
            <Info label="Certificate" value={course.certificateEnabled === false ? 'Not Available' : 'Available'} />

            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Price</p>
              <p className="text-3xl font-semibold text-white">{priceText}</p>
            </div>

            {alreadyEnrolled ? (
              <Link href={`/dashboard/student/courses/${course._id}`} className="btn-primary w-full">
                Continue Learning
              </Link>
            ) : (
              <button onClick={handleEnroll} disabled={enrolling} className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60">
                {enrolling ? 'Enrolling...' : 'Enroll Now'}
              </button>
            )}

            <Link href="/book-consultation" className="btn-secondary w-full">
              Ask About Live Training
            </Link>
          </div>
        </aside>
      </div>
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm uppercase tracking-[0.25em] text-slate-400">{label}</p>
      <p className="text-lg text-white capitalize">{value}</p>
    </div>
  )
}
