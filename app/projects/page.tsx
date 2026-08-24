'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Clock,
  Layers,
  MessageCircle,
  Users,
} from 'lucide-react'
import ProjectCard from '@/components/ProjectCard'
import { PROJECT_LIST } from '@/lib/constants'

const CATEGORIES = ['All', 'LMS', 'eCommerce', 'ERP', 'Blog', 'Dashboard', 'SaaS', 'Portfolio', 'Other']

const TRUST_ITEMS = [
  { icon: <Briefcase className="h-4 w-4" />,   label: '100+ Projects Delivered' },
  { icon: <Users     className="h-4 w-4" />,   label: '50+ Happy Clients'        },
  { icon: <Clock     className="h-4 w-4" />,   label: 'Response within 24 hours' },
  { icon: <BadgeCheck className="h-4 w-4" />,  label: '5+ Years Experience'      },
]

function CardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="aspect-video bg-slate-100" />
      <div className="space-y-3 p-5">
        <div className="h-4 w-3/4 rounded bg-slate-100" />
        <div className="h-3 w-full rounded bg-slate-100" />
        <div className="h-3 w-4/5 rounded bg-slate-100" />
        <div className="mt-4 flex gap-2">
          <div className="h-5 w-16 rounded-full bg-slate-100" />
          <div className="h-5 w-20 rounded-full bg-slate-100" />
          <div className="h-5 w-14 rounded-full bg-slate-100" />
        </div>
      </div>
    </div>
  )
}

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
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* ═══════════════════════════════════════
          HERO
      ═══════════════════════════════════════ */}
      <section className="border-b border-slate-100 bg-white">
        <div className="container-custom py-16 lg:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-teal-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-teal-700">
              <BadgeCheck className="h-3.5 w-3.5" /> Selected Work
            </span>
            <h1 className="mb-5 text-4xl font-black leading-tight tracking-tight text-slate-900 sm:text-5xl">
              Projects &amp;{' '}
              <span className="text-teal-600">Case Studies</span>
            </h1>
            <p className="mb-8 text-base leading-relaxed text-slate-500 sm:text-lg">
              A collection of real-world web applications — LMS platforms, eCommerce systems,
              enterprise dashboards, and more — built with clean, production-ready code.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/contact" className="btn-primary gap-2">
                Discuss a Project <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/services" className="btn-secondary gap-2">
                View Services
              </Link>
            </div>
          </div>

          {/* Trust bar */}
          <div className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-3">
            {TRUST_ITEMS.map((item) => (
              <span
                key={item.label}
                className="flex items-center gap-2 text-sm font-medium text-slate-500"
              >
                <span className="text-teal-500">{item.icon}</span>
                {item.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FILTER + GRID
      ═══════════════════════════════════════ */}
      <section className="container-custom py-14 lg:py-16">

        {/* Section heading */}
        <div className="mb-8">
          <span className="mb-2 inline-block text-xs font-bold uppercase tracking-widest text-teal-600">
            My Work
          </span>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            All Projects
          </h2>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-slate-500">
            Browse by category or explore everything — each project is available for
            customization, demo, or purchase.
          </p>
        </div>

        {/* Category tabs */}
        <div className="no-scrollbar mb-8 overflow-x-auto">
          <div className="flex gap-2 pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  activeCategory === cat
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'border border-slate-200 bg-white text-slate-600 hover:border-teal-300 hover:text-teal-600'
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
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-24 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
              <Layers className="h-6 w-6 text-slate-400" />
            </div>
            <p className="text-sm font-semibold text-slate-600">
              No projects in this category yet.
            </p>
            <button
              onClick={() => setActiveCategory('All')}
              className="rounded-full border border-teal-200 bg-teal-50 px-5 py-2 text-sm font-bold text-teal-700 transition hover:bg-teal-100"
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
      </section>

      {/* ═══════════════════════════════════════
          CTA
      ═══════════════════════════════════════ */}
      <section className="container-custom pb-20">
        <div className="rounded-2xl bg-teal-600 px-8 py-14 text-center shadow-sm">
          <p className="mb-3 text-sm font-bold uppercase tracking-widest text-teal-200">
            Let&apos;s Build Together
          </p>
          <h2 className="mb-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
            Have a project in mind?
          </h2>
          <p className="mx-auto mb-8 max-w-lg text-base text-teal-100">
            I build custom web applications from scratch or can adapt any of these
            ready-made projects to fit your exact requirements.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-teal-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              Start a Project <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-teal-400 px-6 py-3 text-sm font-bold text-white transition hover:bg-teal-500"
            >
              <MessageCircle className="h-4 w-4" /> Get in Touch
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
