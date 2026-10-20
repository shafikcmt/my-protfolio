import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import ClientLayout from '@/components/ClientLayout'
import { AUTHOR_EMAIL, AUTHOR_NAME, SITE_URL } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Md Shafiqul Islam | Full Stack Developer — Garments ERP & Web Apps',
  description:
    'Md Shafiqul Islam — Full Stack Developer (Laravel, Next.js, MERN) building Garments & Apparel ERP, merchandising, production and business web apps. Open to remote work and client projects.',
  keywords:
    'Md Shafiqul Islam, full stack developer, remote developer, Laravel developer, Next.js, MERN, garments ERP, apparel software, merchandising software, Bangladesh',
  authors: [{ name: 'Md Shafiqul Islam' }],
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: 'website',
    siteName: AUTHOR_NAME,
    url: SITE_URL,
    locale: 'en_US',
    title: 'Md Shafiqul Islam | Full Stack Developer — Garments ERP & Web Apps',
    description:
      'Laravel · Next.js · MERN developer building Garments & Apparel ERP and business web apps. Open to remote work and client projects.',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${SITE_URL}/#person`,
      name: AUTHOR_NAME,
      url: SITE_URL,
      email: AUTHOR_EMAIL,
      jobTitle: 'Full Stack Developer',
      description: 'Full Stack Developer (Laravel, Next.js, MERN) specialising in Garments & Apparel ERP systems.',
      address: { '@type': 'PostalAddress', addressCountry: 'BD' },
      knowsAbout: ['Laravel', 'Next.js', 'React', 'Node.js', 'MongoDB', 'MySQL', 'ERP systems', 'Garments software'],
      sameAs: ['https://github.com/shafikcmt', 'https://linkedin.com/in/shafikcmt'],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: AUTHOR_NAME,
      publisher: { '@id': `${SITE_URL}/#person` },
    },
    {
      '@type': 'ProfessionalService',
      '@id': `${SITE_URL}/#service`,
      name: `${AUTHOR_NAME} — Web & ERP Development`,
      url: SITE_URL,
      founder: { '@id': `${SITE_URL}/#person` },
      areaServed: 'Worldwide',
      serviceType: ['Web application development', 'ERP development', 'Laravel development', 'Next.js development'],
    },
  ],
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {/* Run before React hydration: disable browser scroll restoration so reloading
            localhost:3000 does not spring back to the last saved scroll position */}
        <script
          dangerouslySetInnerHTML={{
            __html: `if ('scrollRestoration' in history) { history.scrollRestoration = 'manual'; }`,
          }}
        />
        <ClientLayout>{children}</ClientLayout>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
