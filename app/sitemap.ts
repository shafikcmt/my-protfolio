import type { MetadataRoute } from 'next'
import { connectDB } from '@/lib/db'
import Project from '@/models/Project'
import Blog from '@/models/Blog'
import { PROJECT_LIST, SITE_URL } from '@/lib/constants'

export const revalidate = 3600

const STATIC_PATHS = ['', '/about', '/projects', '/services', '/courses', '/blog', '/contact', '/book-consultation']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: 'weekly',
    priority: path === '' ? 1 : path === '/projects' ? 0.9 : 0.7,
  }))

  let projects: { slug: string; updatedAt?: Date }[] = []
  let blogs: { slug: string; updatedAt?: Date }[] = []
  try {
    await connectDB()
    projects = await Project.find({ status: 'published' }).select('slug updatedAt').lean()
    blogs = await Blog.find({ published: true }).select('slug updatedAt').lean()
  } catch (error) {
    console.error('Sitemap fetch error:', error)
  }
  if (!projects.length) projects = PROJECT_LIST.map((p) => ({ slug: p.slug }))

  projects.forEach((p) =>
    entries.push({ url: `${SITE_URL}/projects/${p.slug}`, lastModified: p.updatedAt, changeFrequency: 'monthly', priority: 0.8 })
  )
  blogs.forEach((b) =>
    entries.push({ url: `${SITE_URL}/blog/${b.slug}`, lastModified: b.updatedAt, changeFrequency: 'monthly', priority: 0.6 })
  )
  return entries
}
