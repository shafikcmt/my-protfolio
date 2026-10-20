import type { Metadata } from 'next'
import { SITE_NAME } from '@/lib/constants'

export const metadata: Metadata = {
  title: `Order a Project | ${SITE_NAME}`,
  description:
    'Order a ready-made or custom web project — ERP, LMS, eCommerce and business dashboards — built with Laravel, Next.js or MERN.',
  alternates: { canonical: '/order-project' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
