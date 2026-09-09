'use client'

/**
 * Central GSAP setup. Registers ScrollTrigger once and exposes a reduced-motion
 * flag so scrubbed/scroll-driven effects can be skipped for users who opt out.
 *
 * GSAP is used only for effects framer-motion is awkward at: scrubbed scroll
 * (the "draw" on the process connector) and finely sequenced hero timelines.
 * Everything else uses the framer-motion <Reveal> primitive.
 */

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

let registered = false

export function registerGsap() {
  if (registered || typeof window === 'undefined') return
  gsap.registerPlugin(ScrollTrigger)
  registered = true
}

export function prefersReducedMotion() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export { gsap, ScrollTrigger }
