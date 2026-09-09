'use client'

/**
 * Reveal — a small, reusable scroll-in primitive built on framer-motion.
 *
 * Why it exists: the site previously repeated the same fade-in inline in many
 * places (or had no motion at all). This gives every section access to a shared,
 * GPU-friendly (transform/opacity only) reveal with *varied* motion so the page
 * doesn't feel like one animation on loop.
 *
 * Respects prefers-reduced-motion automatically (framer-motion's useReducedMotion).
 */

import { motion, useReducedMotion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'

type RevealVariant =
  | 'rise'        // translateY up  — default, general sections
  | 'fade'        // opacity only   — quiet/utility rows
  | 'slide-left'  // enters from right
  | 'slide-right' // enters from left
  | 'clip'        // headline / image clip-reveal
  | 'scale'       // pop-in for CTAs / cards
  | 'blur-rise'   // soft focus-in for hero copy

const EASE = [0.22, 1, 0.36, 1] as const // expo-out: crisp, "designed" settle

const VARIANTS: Record<RevealVariant, Variants> = {
  rise: {
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0 },
  },
  fade: {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
  },
  'slide-left': {
    hidden: { opacity: 0, x: 48 },
    show: { opacity: 1, x: 0 },
  },
  'slide-right': {
    hidden: { opacity: 0, x: -48 },
    show: { opacity: 1, x: 0 },
  },
  clip: {
    hidden: { opacity: 0, y: 24, clipPath: 'inset(0 0 100% 0)' },
    show: { opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)' },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.94 },
    show: { opacity: 1, scale: 1 },
  },
  'blur-rise': {
    hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
    show: { opacity: 1, y: 0, filter: 'blur(0px)' },
  },
}

interface RevealProps {
  children: ReactNode
  variant?: RevealVariant
  /** seconds */
  delay?: number
  duration?: number
  /** trigger margin — how early the reveal fires relative to viewport */
  amount?: number
  once?: boolean
  className?: string
  as?: 'div' | 'section' | 'li' | 'span' | 'article'
}

export function Reveal({
  children,
  variant = 'rise',
  delay = 0,
  duration = 0.7,
  amount = 0.25,
  once = true,
  className,
  as = 'div',
}: RevealProps) {
  const reduce = useReducedMotion()
  const MotionTag = motion[as] as typeof motion.div

  if (reduce) {
    const StaticTag = as as 'div'
    return <StaticTag className={className}>{children}</StaticTag>
  }

  return (
    <MotionTag
      className={className}
      variants={VARIANTS[variant]}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </MotionTag>
  )
}

/**
 * Stagger — wraps a list so children (StaggerItem) cascade in on scroll.
 */
interface StaggerProps {
  children: ReactNode
  className?: string
  /** seconds between each child */
  stagger?: number
  delayChildren?: number
  amount?: number
  once?: boolean
  as?: 'div' | 'ul' | 'section'
}

export function Stagger({
  children,
  className,
  stagger = 0.09,
  delayChildren = 0,
  amount = 0.2,
  once = true,
  as = 'div',
}: StaggerProps) {
  const reduce = useReducedMotion()
  const MotionTag = motion[as] as typeof motion.div

  if (reduce) {
    const StaticTag = as as 'div'
    return <StaticTag className={className}>{children}</StaticTag>
  }

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren } },
      }}
    >
      {children}
    </MotionTag>
  )
}

interface StaggerItemProps {
  children: ReactNode
  variant?: RevealVariant
  duration?: number
  className?: string
  as?: 'div' | 'li' | 'span' | 'article'
}

export function StaggerItem({
  children,
  variant = 'rise',
  duration = 0.6,
  className,
  as = 'div',
}: StaggerItemProps) {
  const reduce = useReducedMotion()
  const MotionTag = motion[as] as typeof motion.div

  if (reduce) {
    const StaticTag = as as 'div'
    return <StaticTag className={className}>{children}</StaticTag>
  }

  return (
    <MotionTag
      className={className}
      variants={{
        hidden: VARIANTS[variant].hidden,
        show: {
          ...VARIANTS[variant].show,
          transition: { duration, ease: EASE },
        },
      }}
    >
      {children}
    </MotionTag>
  )
}
