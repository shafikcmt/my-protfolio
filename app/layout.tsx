import type { Metadata, Viewport } from 'next'
import './globals.css'
import ClientLayout from '@/components/ClientLayout'

export const metadata: Metadata = {
  title: 'Md Shafiqul Islam | Full Stack Developer — Garments ERP & Web Apps',
  description:
    'Md Shafiqul Islam — Full Stack Developer (Laravel, Next.js, MERN) building Garments & Apparel ERP, merchandising, production and business web apps. Open to remote work and client projects.',
  keywords:
    'Md Shafiqul Islam, full stack developer, remote developer, Laravel developer, Next.js, MERN, garments ERP, apparel software, merchandising software, Bangladesh',
  authors: [{ name: 'Md Shafiqul Islam' }],
  metadataBase: new URL('https://shafiqul.dev'),
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
