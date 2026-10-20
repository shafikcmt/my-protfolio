import type { Metadata } from 'next'
import { COURSE_LIST, SITE_NAME } from '@/lib/constants'

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const item = COURSE_LIST.find((i) => i.slug === params.slug)
  if (!item) return { title: `Course | ${SITE_NAME}` }
  return {
    title: `${item.title} | ${SITE_NAME}`,
    description: item.description,
    alternates: { canonical: `/courses/${item.slug}` },
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
