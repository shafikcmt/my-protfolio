'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

const KEY = 'portfolio_ref'

/**
 * Remembers ?ref=<code> from a job application link for this browser tab and
 * reports each page the visitor opens, so I can see which recruiter looked at
 * what. Silent: never blocks or breaks the page.
 */
export default function VisitTracker() {
  const pathname = usePathname()

  useEffect(() => {
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/auth')) return
    let ref: string | null = null
    try {
      const fromUrl = new URLSearchParams(window.location.search).get('ref')
      if (fromUrl) sessionStorage.setItem(KEY, fromUrl)
      ref = fromUrl || sessionStorage.getItem(KEY)
    } catch {
      return
    }
    if (!ref) return

    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ref, path: pathname }),
      keepalive: true,
    }).catch(() => {})
  }, [pathname])

  return null
}
