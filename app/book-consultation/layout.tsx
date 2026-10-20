import type { Metadata } from 'next'
import { SITE_NAME } from '@/lib/constants'

export const metadata: Metadata = {
  title: `Book a Consultation | ${SITE_NAME}`,
  description:
    'Book a one-to-one consultation on web apps, ERP software, architecture or career guidance with Md Shafiqul Islam.',
  alternates: { canonical: '/book-consultation' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
