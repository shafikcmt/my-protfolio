'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import Link from 'next/link'
import SectionTitle from '@/components/SectionTitle'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadProject = async () => {
      try {
        setLoading(true)
        const { data } = await axios.get(`/api/projects?slug=${slug}`)
        if (data.success && data.data.length > 0) {
          setProject(data.data[0])
        } else {
          setError('Project not found.')
        }
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Failed to load project.')
      } finally {
        setLoading(false)
      }
    }
    loadProject()
  }, [slug])

  if (loading) return <LoadingSpinner />
  if (error || !project) {
    return (
      <div className="container-custom py-24 text-center">
        <p className="text-xl text-slate-300 mb-6">{error || 'Project not found.'}</p>
        <button onClick={() => router.push('/projects')} className="btn-secondary">
          Back to Projects
        </button>
      </div>
    )
  }

  return (
    <div className="container-custom py-24">
      <SectionTitle title={project.title} subtitle={project.description} eyebrow="Project Details" />
      <div className="grid gap-10 lg:grid-cols-[0.9fr_0.6fr]">
        <div className="glass-card border-slate-700/70 p-10">
          <h3 className="text-xl font-semibold text-white mb-4">Overview</h3>
          <p className="text-slate-300 leading-8 mb-6">{project.description}</p>
          {project.clientProblem && (
            <div className="mb-6 rounded-3xl bg-slate-950/80 p-6">
              <h4 className="text-lg font-semibold text-white mb-2">Problem Solved</h4>
              <p className="text-slate-300 leading-7">{project.clientProblem}</p>
            </div>
          )}
          <div className="grid gap-4">
            {project.adminFeatures?.length > 0 && (
              <div className="rounded-3xl bg-slate-950/80 p-6">
                <h4 className="text-lg font-semibold text-white mb-3">Admin Features</h4>
                <ul className="list-disc space-y-2 pl-5 text-slate-300">
                  {project.adminFeatures.map((feature: string) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
            {project.userFeatures?.length > 0 && (
              <div className="rounded-3xl bg-slate-950/80 p-6">
                <h4 className="text-lg font-semibold text-white mb-3">User Features</h4>
                <ul className="list-disc space-y-2 pl-5 text-slate-300">
                  {project.userFeatures.map((feature: string) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        <aside className="glass-card border-slate-700/70 p-10">
          <div className="space-y-5">
            <div>
              <p className="text-sm text-slate-400 uppercase tracking-[0.25em]">Technologies</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.technologies?.map((tech: string) => (
                  <span key={tech} className="rounded-full bg-slate-900/80 px-3 py-1 text-xs text-slate-200">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            {project.link && (
              <a href={project.link} target="_blank" rel="noreferrer" className="block rounded-full border border-primary-500 px-4 py-3 text-center text-sm font-semibold text-primary-100 hover:bg-primary-500/10">
                View Live Demo
              </a>
            )}
            {project.codeLink && (
              <a href={project.codeLink} target="_blank" rel="noreferrer" className="block rounded-full border border-slate-700/70 px-4 py-3 text-center text-sm font-semibold text-slate-200 hover:bg-slate-900/80">
                View Code
              </a>
            )}
            <Link href="/order-project" className="block rounded-full bg-primary-500 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-primary-400">
              Order Similar Project
            </Link>
          </div>
        </aside>
      </div>
    </div>
  )
}
