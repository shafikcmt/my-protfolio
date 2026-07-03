'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import toast from 'react-hot-toast'
import { CheckCircle2, ClipboardList, Lock, Play } from 'lucide-react'
import ProtectedRoute from '@/components/ProtectedRoute'
import DashboardLayout from '@/components/DashboardLayout'
import LoadingSpinner from '@/components/LoadingSpinner'
import EmptyState from '@/components/EmptyState'

export default function StudentCourseLearningPage({ params }: { params: { id: string } }) {
  const [course, setCourse] = useState<any>(null)
  const [lessons, setLessons] = useState<any[]>([])
  const [enrollment, setEnrollment] = useState<any>(null)
  const [selectedLesson, setSelectedLesson] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [busyLessonId, setBusyLessonId] = useState<string | null>(null)
  const [generatingCertificate, setGeneratingCertificate] = useState(false)

  const loadCourse = async () => {
    try {
      const { data } = await axios.get(`/api/student/courses?id=${params.id}`)
      const payload = data.data
      setCourse(payload.course)
      setLessons(payload.lessons || [])
      setEnrollment(payload.enrollment)
      setSelectedLesson((current: any) =>
        current || payload.lessons?.find((l: any) => l.accessible) || payload.lessons?.[0] || null
      )
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load course')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadCourse() }, [params.id])

  const completedIds = useMemo(() => {
    return new Set((enrollment?.completedLessons || []).map((item: any) => String(item?._id || item)))
  }, [enrollment])

  const videoEmbedUrl = useMemo(() => getEmbedUrl(selectedLesson?.videoUrl), [selectedLesson?.videoUrl])

  const markComplete = async (lessonId: string, action = 'complete') => {
    try {
      setBusyLessonId(lessonId)
      const { data } = await axios.post('/api/student/lessons', { lessonId, action })
      setEnrollment(data.data)
      toast.success(action === 'uncomplete' ? 'Lesson marked incomplete' : 'Lesson completed')
      await loadCourse()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Could not update progress')
    } finally {
      setBusyLessonId(null)
    }
  }

  const generateCertificate = async () => {
    if (!enrollment?._id) return
    try {
      setGeneratingCertificate(true)
      const { data } = await axios.post('/api/student/certificates', { enrollmentId: enrollment._id })
      toast.success(data.message || 'Certificate generated')
      await loadCourse()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Certificate generation failed')
    } finally {
      setGeneratingCertificate(false)
    }
  }

  return (
    <ProtectedRoute requiredRoles={['student']}>
      <DashboardLayout title="Course Learning">
        {loading ? (
          <LoadingSpinner />
        ) : !course ? (
          <EmptyState title="Course not found" description="The course may be unpublished or unavailable." />
        ) : !enrollment ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">Enrollment required</h2>
            <p className="mt-2 text-slate-500">Please enroll first to access the student learning dashboard.</p>
            <Link href={`/courses/${course.slug}`} className="btn-primary mt-6 inline-flex">
              Go to Course Page
            </Link>
          </div>
        ) : (
          <div className="space-y-8">

            {/* Course header */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-600">{course.category}</p>
                  <h2 className="mt-1 text-2xl font-bold text-slate-900">{course.title}</h2>
                  <p className="mt-2 text-sm text-slate-500">Instructor: {course.instructor || 'Md Shafiqul Islam'}</p>
                </div>
                <div className="min-w-[220px]">
                  <div className="mb-2 flex justify-between text-sm text-slate-500">
                    <span>Progress</span>
                    <span className="font-semibold text-slate-700">{enrollment.progress || 0}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-200">
                    <div className="h-3 rounded-full bg-teal-600 transition-all" style={{ width: `${enrollment.progress || 0}%` }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-8 xl:grid-cols-[1fr_380px]">
              <main className="space-y-6">
                {/* Video player */}
                <div className="overflow-hidden rounded-2xl bg-black shadow-sm">
                  {selectedLesson?.accessible && selectedLesson?.videoUrl ? (
                    videoEmbedUrl ? (
                      <iframe
                        src={videoEmbedUrl}
                        title={selectedLesson.title}
                        className="aspect-video w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <div className="flex aspect-video items-center justify-center p-8 text-center text-white">
                        <a href={selectedLesson.videoUrl} target="_blank" rel="noreferrer" className="btn-primary">
                          Open Video Lesson
                        </a>
                      </div>
                    )
                  ) : (
                    <div className="flex aspect-video items-center justify-center p-8 text-center text-white">
                      <div>
                        <Lock className="mx-auto h-12 w-12 text-slate-400" />
                        <h3 className="mt-4 text-xl font-bold">Lesson Locked</h3>
                        <p className="mt-2 text-slate-300">This lesson is only available after enrollment.</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Lesson info */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">
                        {selectedLesson?.title || 'Select a lesson'}
                      </h3>
                      <p className="mt-2 text-slate-500">
                        {selectedLesson?.description || 'Choose any available lesson from the right side list.'}
                      </p>
                    </div>
                    {selectedLesson?.accessible && selectedLesson?._id && (
                      completedIds.has(String(selectedLesson._id)) ? (
                        <button
                          onClick={() => markComplete(selectedLesson._id, 'uncomplete')}
                          disabled={busyLessonId === selectedLesson._id}
                          className="btn-secondary shrink-0"
                        >
                          Mark Incomplete
                        </button>
                      ) : (
                        <button
                          onClick={() => markComplete(selectedLesson._id)}
                          disabled={busyLessonId === selectedLesson._id}
                          className="btn-primary shrink-0"
                        >
                          Mark Complete
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Placeholders */}
                <div className="grid gap-6 md:grid-cols-2">
                  <PlaceholderBox title="Assignments" icon={<ClipboardList className="h-6 w-6 text-violet-500" />} description="Assignment submission module placeholder is ready for future admin upload and student submission." />
                  <PlaceholderBox title="Quizzes" icon={<CheckCircle2 className="h-6 w-6 text-teal-500" />} description="Quiz module placeholder is ready for future MCQ, score, and result tracking features." />
                </div>
              </main>

              <aside className="space-y-6">
                {/* Lesson list */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-4 text-lg font-bold text-slate-900">Lessons</h3>
                  <div className="space-y-3">
                    {lessons.map((lesson, index) => {
                      const completed = completedIds.has(String(lesson._id))
                      const active = selectedLesson?._id === lesson._id
                      return (
                        <button
                          key={lesson._id}
                          onClick={() => setSelectedLesson(lesson)}
                          className={`w-full rounded-2xl border p-4 text-left transition ${
                            active
                              ? 'border-teal-400 bg-teal-50'
                              : 'border-slate-200 hover:border-teal-300 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="font-semibold text-slate-900">{index + 1}. {lesson.title}</p>
                              <p className="mt-1 text-xs text-slate-500">
                                {lesson.duration ? `${lesson.duration} min` : 'Lesson'} · {lesson.accessible ? 'Unlocked' : 'Locked'}
                              </p>
                            </div>
                            <span className="mt-0.5 flex-shrink-0">
                              {completed ? (
                                <CheckCircle2 className="h-5 w-5 text-teal-500" />
                              ) : lesson.accessible ? (
                                <Play className="h-5 w-5 text-slate-400" />
                              ) : (
                                <Lock className="h-5 w-5 text-slate-300" />
                              )}
                            </span>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Certificate */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-2 text-lg font-bold text-slate-900">Certificate</h3>
                  <p className="mb-4 text-sm text-slate-500">Complete all lessons to generate your certificate.</p>
                  {enrollment.certificate ? (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                      <p className="font-semibold text-emerald-800">Certificate Generated</p>
                      <p className="text-sm text-emerald-700">ID: {enrollment.certificate.certificateId}</p>
                      <button onClick={() => window.print()} className="mt-3 text-sm font-semibold text-emerald-700 hover:text-emerald-600">
                        Print / Save PDF
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={generateCertificate}
                      disabled={(enrollment.progress || 0) < 100 || generatingCertificate}
                      className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {generatingCertificate ? 'Generating...' : 'Generate Certificate'}
                    </button>
                  )}
                </div>
              </aside>
            </div>
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  )
}

function PlaceholderBox({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </div>
  )
}

function getEmbedUrl(url?: string) {
  if (!url) return ''
  try {
    const parsed = new URL(url)
    if (parsed.hostname.includes('youtube.com')) {
      const videoId = parsed.searchParams.get('v')
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url
    }
    if (parsed.hostname.includes('youtu.be')) {
      const videoId = parsed.pathname.replace('/', '')
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url
    }
    if (parsed.hostname.includes('vimeo.com')) {
      const videoId = parsed.pathname.split('/').filter(Boolean).pop()
      return videoId ? `https://player.vimeo.com/video/${videoId}` : url
    }
    return ''
  } catch {
    return ''
  }
}
