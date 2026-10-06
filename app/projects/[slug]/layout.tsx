import type { Metadata } from 'next'
import { connectDB } from '@/lib/db'
import Project from '@/models/Project'
import { PROJECT_LIST, SITE_NAME } from '@/lib/constants'

// The page itself is a client component; this server layout gives each project
// its own <title>, description and social share image for Google / LinkedIn / WhatsApp.

async function findProject(slug: string): Promise<any | null> {
  try {
    await connectDB()
    const project = await Project.findOne({ slug, status: 'published' })
      .select('title shortDescription description image screenshots technologies category')
      .lean()
    if (project) return project
  } catch (error) {
    console.error('Project metadata fetch error:', error)
  }
  return PROJECT_LIST.find((p) => p.slug === slug) ?? null
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const project = await findProject(params.slug)
  if (!project) return { title: `Project not found | ${SITE_NAME}` }

  const title = `${project.title} | ${SITE_NAME}`
  const description = String(project.shortDescription || project.description || '').slice(0, 160)
  const image = project.screenshots?.[0] || project.image
  const url = `/projects/${params.slug}`

  return {
    title,
    description,
    keywords: [...(project.technologies || []), project.category].filter(Boolean),
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title,
      description,
      images: image ? [image] : undefined,
    },
  }
}

export default function ProjectDetailLayout({ children }: { children: React.ReactNode }) {
  return children
}
