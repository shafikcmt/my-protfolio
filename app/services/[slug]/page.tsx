'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import Link from 'next/link'
import SectionTitle from '@/components/SectionTitle'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function ServiceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const [service, setService] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadService = async () => {
      try {
        setLoading(true)
        const { data } = await axios.get(`/api/services?slug=${slug}`)
        if (data.success && data.data.length > 0) {
          setService(data.data[0])
        } else {
          setError('Service not found.')
        }
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Failed to load service.')
      } finally {
        setLoading(false)
      }
    }
    loadService()
  }, [slug])

  if (loading) return <LoadingSpinner />
  if (error || !service) {
    return (
      <div className="container-custom py-24 text-center">
        <p className="text-xl text-slate-300 mb-6">{error || 'Service not found.'}</p>
        <button onClick={() => router.push('/services')} className="btn-secondary">
          Back to Services
        </button>
      </div>
    )
  }

  return (
    <div className="container-custom py-24">
      <SectionTitle title={service.title} subtitle={service.description} eyebrow="Service Details" />
      <div className="grid gap-10 lg:grid-cols-[0.9fr_0.6fr]">
        <div className="glass-card border-slate-700/70 p-10">
          <h2 className="text-2xl font-semibold text-white mb-4">What you get</h2>
          <p className="text-slate-300 leading-8 mb-6">{service.description}</p>
          <div className="grid gap-3">
            {service.features?.map((feature: string) => (
              <div key={feature} className="rounded-3xl bg-slate-950/80 p-5 text-slate-300">
                {feature}
              </div>
            ))}
          </div>
        </div>
        <aside className="glass-card border-slate-700/70 p-10">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-400 uppercase tracking-[0.25em]">Starting Price</p>
              <p className="text-3xl font-semibold text-white">${service.price}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400 uppercase tracking-[0.25em]">Delivery</p>
              <p className="text-lg text-white">{service.duration || 'Custom timeline'}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400 uppercase tracking-[0.25em]">Technologies</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {service.technologies?.map((tech: string) => (
                  <span key={tech} className="rounded-full bg-slate-900/80 px-3 py-1 text-xs text-slate-200">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <Link href="/order-project" className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-primary-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-400">
            Order This Service
          </Link>
        </aside>
      </div>
    </div>
  )
}
