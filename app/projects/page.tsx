'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import ProjectCard from '@/components/ProjectCard'
import { PROJECT_LIST } from '@/lib/constants'
import { Layers } from 'lucide-react'

const CATEGORIES = ['All', 'LMS', 'eCommerce', 'ERP', 'Blog', 'Dashboard', 'SaaS', 'Portfolio', 'Other']

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get('/api/projects')
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setProjects(data.data)
        } else {
          setProjects(PROJECT_LIST as any[])
        }
      } catch {
        setProjects(PROJECT_LIST as any[])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered =
    activeCategory === 'All'
      ? projects
      : projects.filter((p) => p.category === activeCategory)

  return (
    <div className="container-custom py-16 lg:py-24">
      {/* Header */}
      <div className="mb-10">
        <span className="mb-4 inline-flex rounded-full bg-primary-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary-600">
          Selected Work
        </span>
        <h1 className="mb-3 max-w-2xl text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
          Projects
        </h1>
        <p className="max-w-xl text-base leading-7 text-slate-500">
          Explore signature projects — from LMS platforms to eCommerce systems and enterprise solutions.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="no-scrollbar mb-8 overflow-x-auto">
        <div className="flex gap-2 pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeCategory === cat
                  ? 'bg-primary-600 text-white shadow'
                  : 'border border-slate-200 bg-white text-slate-600 hover:border-primary-300 hover:text-primary-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-80 animate-pulse rounded-2xl bg-slate-100" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-24">
          <Layers className="h-10 w-10 text-slate-300" />
          <p className="text-sm font-semibold text-slate-500">No projects in this category yet.</p>
          <button
            onClick={() => setActiveCategory('All')}
            className="rounded-full bg-primary-50 px-5 py-2 text-sm font-bold text-primary-600 transition hover:bg-primary-100"
          >
            View all projects
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project: any, i: number) => (
            <ProjectCard
              key={project.slug || project._id || i}
              title={project.title}
              description={project.description}
              shortDescription={project.shortDescription}
              technologies={project.technologies}
              slug={project.slug}
              image={project.screenshots?.[0] || project.image}
              category={project.category}
              featured={project.featured}
              liveDemoUrl={project.liveDemoUrl || project.link}
              githubUrl={project.githubUrl || project.codeLink}
            />
          ))}
        </div>
      )}
    </div>
  )
}
