import BlogSearchClient from '@/components/BlogSearchClient'
import { SITE_NAME } from '@/lib/constants'

interface BlogPageProps {
  searchParams: { q?: string }
}

export async function generateMetadata({ searchParams }: BlogPageProps) {
  const query = searchParams.q || ''
  return {
    title: query ? `Blog search: ${query}` : `${SITE_NAME} Blog`,
    description: query
      ? `Search results for ${query} on ${SITE_NAME}`
      : `Read the latest articles and tutorials from ${SITE_NAME}`,
  }
}

export default function BlogPage({ searchParams }: BlogPageProps) {
  return <BlogSearchClient initialQuery={searchParams.q || ''} />
}
