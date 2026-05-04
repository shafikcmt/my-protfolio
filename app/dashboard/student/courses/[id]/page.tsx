'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import toast from 'react-hot-toast'
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
      setSelectedLesson((current: any) => current || payload.lessons?.find((lesson: any) => lesson.accessible) || payload.lessons?.[0] || null)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load course')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCourse()
  }, [params.id])

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
          <div className="rounded-2xl bg-white p-8 text-center shadow dark:bg-dark-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Enrollment required</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Please enroll first to access the student learning dashboard.</p>
            <Link href={`/courses/${course.slug}`} className="btn-primary mt-6">
              Go to Course Page
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="rounded-2xl bg-white p-6 shadow dark:bg-dark-800">
              <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-300">{course.category}</p>
                  <h2 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{course.title}</h2>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">Instructor: {course.instructor || 'Md Shafiqul Islam'}</p>
                </div>
                <div className="min-w-[220px]">
                  <div className="mb-2 flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>Progress</span>
                    <span>{enrollment.progress || 0}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-gray-200 dark:bg-gray-700">
                    <div className="h-3 rounded-full bg-primary-600" style={{ width: `${enrollment.progress || 0}%` }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-8 xl:grid-cols-[1fr_380px]">
              <main className="space-y-6">
                <div className="overflow-hidden rounded-2xl bg-black shadow">
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
                        <p className="text-5xl">🔒</p>
                        <h3 className="mt-4 text-xl font-bold">Lesson Locked</h3>
                        <p className="mt-2 text-slate-300">This lesson is only available after enrollment.</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="rounded-2xl bg-white p-6 shadow dark:bg-dark-800">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedLesson?.title || 'Select a lesson'}</h3>
                      <p className="mt-2 text-gray-600 dark:text-gray-400">{selectedLesson?.description || 'Choose any available lesson from the right side list.'}</p>
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

                <div className="grid gap-6 md:grid-cols-2">
                  <PlaceholderBox title="Assignments" icon="📝" description="Assignment submission module placeholder is ready for future admin upload and student submission." />
                  <PlaceholderBox title="Quizzes" icon="✅" description="Quiz module placeholder is ready for future MCQ, score, and result tracking features." />
                </div>
              </main>

              <aside className="space-y-6">
                <div className="rounded-2xl bg-white p-6 shadow dark:bg-dark-800">
                  <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">Lessons</h3>
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
                              ? 'border-primary-500 bg-primary-500/10'
                              : 'border-gray-200 hover:border-primary-300 dark:border-gray-700 dark:hover:border-primary-500'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">{index + 1}. {lesson.title}</p>
                              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                {lesson.duration ? `${lesson.duration} min` : 'Lesson'} · {lesson.accessible ? 'Unlocked' : 'Locked'}
                              </p>
                            </div>
                            <span className="text-lg">{completed ? '✅' : lesson.accessible ? '▶️' : '🔒'}</span>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="rounded-2xl bg-white p-6 shadow dark:bg-dark-800">
                  <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">Certificate</h3>
                  <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">Complete all lessons to generate your certificate.</p>
                  {enrollment.certificate ? (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/30">
                      <p className="font-semibold text-emerald-800 dark:text-emerald-200">Certificate Generated</p>
                      <p className="text-sm text-emerald-700 dark:text-emerald-300">ID: {enrollment.certificate.certificateId}</p>
                      <button onClick={() => window.print()} className="mt-3 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
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

function PlaceholderBox({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow dark:bg-dark-800">
      <p className="text-4xl">{icon}</p>
      <h3 className="mt-3 text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{description}</p>
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
  } catch (error) {
    return ''
  }
}
