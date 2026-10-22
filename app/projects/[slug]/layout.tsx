import type { Metadata } from 'next'
import { connectDB } from '@/lib/db'
import Project from '@/models/Project'
import { PROJECT_LIST, SITE_NAME, SITE_URL } from '@/lib/constants'
import { getMarketingProfile } from '@/lib/projectMarketing'

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

  const profile = getMarketingProfile(params.slug)
  const title = profile?.seoTitle || `${project.title} | ${SITE_NAME}`
  const description = profile?.seoDescription || String(project.shortDescription || project.description || '').slice(0, 160)
  const image = project.screenshots?.[0] || project.image
  const url = `/projects/${params.slug}`

  return {
    title,
    description,
    keywords: profile ? profile.seoKeywords : [...(project.technologies || []), project.category].filter(Boolean),
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

export default async function ProjectDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { slug: string }
}) {
  const profile = getMarketingProfile(params.slug)
  if (!profile) return children

  const pageUrl = `${SITE_URL}/projects/${params.slug}`
  const project = await findProject(params.slug)
  const image = project?.screenshots?.[0] || project?.image

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        '@id': `${pageUrl}#software`,
        name: 'ProTrac',
        url: pageUrl,
        description: profile.seoDescription,
        applicationCategory: 'BusinessApplication',
        applicationSubCategory: 'Garment production tracking',
        operatingSystem: 'Web',
        ...(image ? { image: image.startsWith('http') ? image : `${SITE_URL}${image}` } : {}),
        author: { '@id': `${SITE_URL}/#person` },
      },
      {
        '@type': 'FAQPage',
        mainEntity: profile.faq.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Projects', item: `${SITE_URL}/projects` },
          { '@type': 'ListItem', position: 3, name: 'ProTrac', item: pageUrl },
        ],
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  )
}
