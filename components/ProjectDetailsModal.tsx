'use client'

import Link from 'next/link'
import { IProject } from '@/types/models'

interface ProjectDetailsModalProps {
  project: IProject | null
  open: boolean
  onClose: () => void
}

function getYoutubeEmbedUrl(url?: string) {
  if (!url) return ''
  if (url.includes('embed')) return url
  const shortMatch = url.match(/youtu\.be\/([^?]+)/)
  const normalMatch = url.match(/[?&]v=([^&]+)/)
  const id = shortMatch?.[1] || normalMatch?.[1]
  return id ? `https://www.youtube.com/embed/${id}` : url
}

export default function ProjectDetailsModal({ project, open, onClose }: ProjectDetailsModalProps) {
  if (!open || !project) return null

  const liveUrl = project.liveDemoUrl || project.link
  const githubUrl = project.githubUrl || project.codeLink
  const videoUrl = getYoutubeEmbedUrl(project.videoUrl)
  const featureGroups = [
    { title: 'Main Features', items: project.features || [] },
    { title: 'Admin Features', items: project.adminFeatures || [] },
    { title: 'User Features', items: project.userFeatures || [] },
  ].filter((group) => group.items.length)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-3xl border border-slate-700 bg-slate-950 text-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-800 bg-slate-950/95 p-5 backdrop-blur">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-300">Project Details</p>
            <h2 className="text-2xl font-black">{project.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
          >
            Close
          </button>
        </div>

        <div className="grid gap-8 p-5 md:p-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            {project.image && (
              <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900">
                <img src={project.image} alt={project.title} className="h-72 w-full object-cover" />
              </div>
            )}

            <div>
              <h3 className="mb-3 text-lg font-bold">Overview</h3>
              <p className="leading-8 text-slate-300">{project.description}</p>
            </div>

            {project.clientProblem && (
              <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
                <h3 className="mb-2 text-lg font-bold">Client Problem</h3>
                <p className="leading-7 text-slate-300">{project.clientProblem}</p>
              </div>
            )}

            {project.solution && (
              <div className="rounded-3xl border border-primary-500/30 bg-primary-500/10 p-5">
                <h3 className="mb-2 text-lg font-bold text-primary-100">Solution</h3>
                <p className="leading-7 text-primary-50/90">{project.solution}</p>
              </div>
            )}

            {!!project.screenshots?.length && (
              <div>
                <h3 className="mb-4 text-lg font-bold">Screenshots</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {project.screenshots.map((src) => (
                    <img key={src} src={src} alt={`${project.title} screenshot`} className="h-48 rounded-2xl border border-slate-800 object-cover" />
                  ))}
                </div>
              </div>
            )}

            {videoUrl && (
              <div>
                <h3 className="mb-4 text-lg font-bold">Video Demo</h3>
                <div className="aspect-video overflow-hidden rounded-3xl border border-slate-800 bg-slate-900">
                  <iframe src={videoUrl} title={`${project.title} video demo`} className="h-full w-full" allowFullScreen />
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
              <h3 className="mb-4 text-lg font-bold">Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                {(project.technologies || []).map((tech) => (
                  <span key={tech} className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-slate-200 ring-1 ring-slate-700">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {featureGroups.map((group) => (
              <div key={group.title} className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
                <h3 className="mb-4 text-lg font-bold">{group.title}</h3>
                <ul className="space-y-3 text-sm text-slate-300">
                  {group.items.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-1 text-primary-300">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="rounded-3xl border border-primary-500/30 bg-primary-500/10 p-5">
              <h3 className="mb-2 text-lg font-bold">Need a similar project?</h3>
              <p className="mb-5 text-sm leading-6 text-primary-50/80">
                Share your requirements and get a professional project plan, timeline, and budget estimate.
              </p>
              <div className="flex flex-col gap-3">
                {liveUrl && (
                  <a href={liveUrl} target="_blank" rel="noreferrer" className="rounded-full bg-white px-4 py-2 text-center text-sm font-bold text-slate-950 transition hover:bg-primary-100">
                    Live Demo
                  </a>
                )}
                {githubUrl && (
                  <a href={githubUrl} target="_blank" rel="noreferrer" className="rounded-full border border-primary-300 px-4 py-2 text-center text-sm font-bold text-primary-100 transition hover:bg-primary-400/10">
                    GitHub Code
                  </a>
                )}
                <Link href={`/order-project?project=${project.slug}`} className="rounded-full bg-primary-500 px-4 py-2 text-center text-sm font-bold text-white transition hover:bg-primary-400">
                  Order Similar Project
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
