'use client'

/**
 * useGsap — run a scoped GSAP animation against a container ref with automatic
 * cleanup (gsap.context) on unmount. Skips entirely under reduced-motion.
 *
 * Usage:
 *   const scope = useRef<HTMLDivElement>(null)
 *   useGsap(scope, (gsap) => {
 *     gsap.from('.thing', { y: 40, opacity: 0, stagger: 0.1 })
 *   })
 */

import { useLayoutEffect, type RefObject } from 'react'
import { gsap, registerGsap, prefersReducedMotion } from '@/lib/gsap'

type GsapSetup = (g: typeof gsap, ctx: gsap.Context) => void

export function useGsap(
  scope: RefObject<HTMLElement>,
  setup: GsapSetup,
  deps: unknown[] = [],
) {
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return
    if (prefersReducedMotion()) return
    registerGsap()

    const ctx = gsap.context((self) => setup(gsap, self), scope)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
