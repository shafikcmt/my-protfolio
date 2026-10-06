import type { Metadata } from 'next'
import { SITE_NAME } from '@/lib/constants'

export const metadata: Metadata = {
  title: `Projects | ${SITE_NAME}`,
  description:
    'Case studies of web applications built by Md Shafiqul Islam — Garments & Apparel ERP, merchandising, LMS, eCommerce and business dashboards with Laravel, Next.js and MERN.',
  alternates: { canonical: '/projects' },
}

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return children
}
