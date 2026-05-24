'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, BadgeCheck, Rocket, Users } from 'lucide-react'
import { ABOUT_SUMMARY } from '@/lib/constants'

type SiteSettings = {
  heroImage?: string
  profileImage?: string
  avatar?: string
  image?: string
}

const heroStats = [
  { label: 'Projects Delivered', value: '100+', icon: Rocket },
  { label: 'Happy Clients', value: '50+', icon: Users },
  { label: 'Years Experience', value: '5+', icon: BadgeCheck },
]

export default function HeroSection() {
  const [heroImage, setHeroImage] = useState('')

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await fetch('/api/settings', { cache: 'no-store' })
        const json = await res.json()

        const settings: SiteSettings = json?.data || json?.settings || json || {}

        setHeroImage(
          settings.heroImage ||
            settings.profileImage ||
            settings.avatar ||
            settings.image ||
            ''
        )
      } catch {
        setHeroImage('')
      }
    }

    loadSettings()
  }, [])

  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-[linear-gradient(135deg,#edf8f7_0%,#f7fbfb_45%,#d8f0ef_100%)]">
      <div className="absolute left-0 top-24 h-80 w-80 rounded-full bg-teal-200/35 blur-3xl" />
      <div className="absolute right-0 bottom-10 h-[520px] w-[520px] rounded-full bg-cyan-200/45 blur-3xl" />

      <div className="container-custom relative z-10 py-14 lg:py-20">
        <div className="grid min-h-[680px] items-center gap-12 rounded-[2.5rem] border border-white/80 bg-white/55 p-7 shadow-[0_30px_90px_rgba(15,23,42,0.08)] backdrop-blur-xl lg:grid-cols-[1fr_0.95fr] lg:p-12 xl:min-h-[720px]">
          <div className="max-w-4xl">
            <p className="mb-5 text-sm font-black uppercase tracking-[0.35em] text-teal-700">
              Welcome to my world
            </p>

            <h1 className="text-5xl font-black leading-[1.05] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl 2xl:text-[86px]">
              Hey! I am <br />
              <span className="text-teal-700">Web Developer</span>
            </h1>

            <p className="mt-7 max-w-3xl text-base leading-8 text-slate-600 lg:text-lg">
              {ABOUT_SUMMARY}
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link href="/contact" className="btn-primary px-8 py-4">
                Let&apos;s Talk
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>

              <Link href="/projects" className="btn-secondary px-8 py-4">
                View Portfolio
              </Link>
            </div>

            <div className="mt-12 grid max-w-2xl gap-4 sm:grid-cols-3">
              {heroStats.map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="rounded-[1.5rem] border border-white bg-white/75 p-5 shadow-[0_15px_45px_rgba(15,23,42,0.06)]"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="text-3xl font-black text-slate-950">{value}</p>
                  <p className="mt-1 text-xs font-bold text-slate-500">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto flex w-full max-w-[700px] items-center justify-center">
            <div className="absolute h-[560px] w-[560px] rounded-full border-[34px] border-teal-900/10" />
            <div className="absolute h-[485px] w-[485px] rounded-full border-[3px] border-dashed border-teal-800/45" />
            <div className="absolute h-[410px] w-[410px] rounded-full bg-gradient-to-br from-teal-700 to-teal-500 shadow-[0_35px_90px_rgba(15,118,110,0.25)]" />

            <div className="relative z-10 flex h-[455px] w-[455px] items-center justify-center overflow-hidden rounded-full">
              {heroImage ? (
                <img
                  src={heroImage}
                  alt="Md Shafiqul Islam"
                  className="h-full w-full object-cover object-top"
                />
              ) : (
                <span className="text-7xl font-black text-white">SI</span>
              )}
            </div>

            <div className="absolute -left-2 bottom-20 z-20 rounded-2xl bg-white/95 px-5 py-4 shadow-[0_18px_45px_rgba(15,23,42,0.12)] backdrop-blur">
              <p className="text-sm font-black text-slate-950">Full-Stack Developer</p>
              <p className="mt-1 text-xs font-bold text-teal-700">Laravel • MERN • Next.js</p>
            </div>

            <div className="absolute right-3 top-24 z-20 rounded-full bg-white/95 px-5 py-3 text-sm font-black text-teal-700 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
              Available
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}