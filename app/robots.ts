import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/constants'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/admin', '/api/', '/login', '/register', '/auth/', '/proposal/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
