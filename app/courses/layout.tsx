import type { Metadata } from 'next'
import { SITE_NAME } from '@/lib/constants'

export const metadata: Metadata = {
  title: `Web Development Courses | ${SITE_NAME}`,
  description:
    'Learn Laravel, MERN and Next.js with project-based courses and live mentoring from Md Shafiqul Islam.',
  alternates: { canonical: '/courses' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
