'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowRight, Menu, X } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/#about' },
    { label: 'Services', href: '/#services' },
    { label: 'Projects', href: '/#projects' },
    { label: 'Testimonials', href: '/#testimonials' },
    { label: 'Contact', href: '/contact' },
  ]

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
      <div className="container-custom">
        <div className="flex h-20 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-600 to-cyan-500 text-lg font-black text-white shadow-[0_10px_25px_rgba(13,148,136,0.28)]">
              SI
            </div>
            <div>
              <p className="text-lg font-black tracking-tight text-slate-900">Shafiqul</p>
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-slate-500">Portfolio & LMS</p>
            </div>
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-slate-600 transition hover:text-teal-600"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <Link href="/dashboard" className="btn-secondary px-5 py-2.5">
              Dashboard
            </Link>
            <Link href="/contact" className="btn-primary px-5 py-2.5">
              Let&apos;s Talk
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm lg:hidden"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {isOpen && (
          <div className="pb-5 lg:hidden">
            <div className="surface-card overflow-hidden rounded-[1.75rem] p-3">
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-teal-600"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="mt-2 grid gap-2 px-2 pb-2 sm:grid-cols-2">
                  <Link href="/dashboard" className="btn-secondary w-full" onClick={() => setIsOpen(false)}>
                    Dashboard
                  </Link>
                  <Link href="/contact" className="btn-primary w-full" onClick={() => setIsOpen(false)}>
                    Let&apos;s Talk
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
