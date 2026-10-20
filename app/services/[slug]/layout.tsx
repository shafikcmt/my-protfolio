import type { Metadata } from 'next'
import { SERVICE_LIST, SITE_NAME } from '@/lib/constants'

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const item = SERVICE_LIST.find((i) => i.slug === params.slug)
  if (!item) return { title: `Service | ${SITE_NAME}` }
  return {
    title: `${item.title} | ${SITE_NAME}`,
    description: item.description,
    alternates: { canonical: `/services/${item.slug}` },
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
