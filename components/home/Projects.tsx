'use client'

import { useMemo, useState } from 'react'

const sampleProjects = [
  {
    id: 'p1',
    title: 'Modern SaaS Dashboard',
    description: 'A responsive admin panel with analytics, team management, and real-time charts.',
    technologies: ['React', 'Next.js', 'Tailwind CSS'],
    link: '#',
  },
  {
    id: 'p2',
    title: 'E-commerce Platform',
    description: 'A full-featured store with cart, checkout, and order management.',
    technologies: ['Node.js', 'MongoDB', 'Stripe'],
    link: '#',
  },
  {
    id: 'p3',
    title: 'Learning Portal',
    description: 'Student dashboard with course progress, lessons, and certificate issuance.',
    technologies: ['React', 'GraphQL', 'Tailwind CSS'],
    link: '#',
  },
  {
    id: 'p4',
    title: 'Portfolio CMS',
    description: 'Admin content management for projects, blogs, and live classes.',
    technologies: ['Next.js', 'TypeScript', 'MongoDB'],
    link: '#',
  },
]

export default function Projects() {
  const [selectedTech, setSelectedTech] = useState('all')

  const technologies = useMemo(
    () => Array.from(new Set(sampleProjects.flatMap((project) => project.technologies))),
    []
  )

  const filteredProjects = useMemo(
    () =>
      selectedTech === 'all'
        ? sampleProjects
        : sampleProjects.filter((project) => project.technologies.includes(selectedTech)),
    [selectedTech]
  )

  return (
    <section id="projects" className="py-20 md:py-32 bg-gray-50 dark:bg-dark-900">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="section-heading">Featured Projects</h2>
          <p className="section-subheading">Explore key work examples and filter by technology.</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          <button
            onClick={() => setSelectedTech('all')}
            className={`px-4 py-2 rounded-full transition ${selectedTech === 'all' ? 'bg-primary-600 text-white' : 'bg-white dark:bg-dark-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'}`}
          >
            All
          </button>
          {technologies.map((tech) => (
            <button
              key={tech}
              onClick={() => setSelectedTech(tech)}
              className={`px-4 py-2 rounded-full transition ${selectedTech === tech ? 'bg-primary-600 text-white' : 'bg-white dark:bg-dark-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'}`}
            >
              {tech}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <article key={project.id} className="rounded-3xl bg-white dark:bg-dark-800 shadow-md border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{project.title}</h3>
                <a href={project.link} className="text-primary-600 dark:text-primary-400 text-sm font-semibold hover:underline">
                  View project
                </a>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-5">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span key={tech} className="text-xs font-semibold uppercase tracking-wide bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full">
                    {tech}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
