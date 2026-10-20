import type { Metadata } from 'next'
import { SITE_NAME } from '@/lib/constants'

export const metadata: Metadata = {
  title: `Contact & Hire | ${SITE_NAME}`,
  description:
    'Get in touch with Md Shafiqul Islam for remote roles, Laravel / Next.js / MERN projects and Garments ERP development. Replies within 24 hours.',
  alternates: { canonical: '/contact' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
