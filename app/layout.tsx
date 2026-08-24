import type { Metadata, Viewport } from 'next'
import './globals.css'
import ClientLayout from '@/components/ClientLayout'

export const metadata: Metadata = {
  title: 'Md Shafiqul Islam | Full Stack Developer & Technical Trainer',
  description:
    'Premium portfolio and LMS platform for Md Shafiqul Islam – modern web development, technical training, service booking, and course management.',
  keywords:
    'Md Shafiqul Islam, full stack developer, Laravel, MERN, Next.js, LMS, portfolio, services, web development',
  authors: [{ name: 'Md Shafiqul Islam' }],
  metadataBase: new URL('https://shafiqul-portfolio-lms-platform.vercel.app'),
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-slate-50 text-slate-900">
        {/* Run before React hydration: disable browser scroll restoration so reloading
            localhost:3000 does not spring back to the last saved scroll position */}
        <script
          dangerouslySetInnerHTML={{
            __html: `if ('scrollRestoration' in history) { history.scrollRestoration = 'manual'; }`,
          }}
        />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
