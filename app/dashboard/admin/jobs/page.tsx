'use client'

import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { Bookmark, Building2, CheckCircle2, ExternalLink, Loader2, MapPin, RefreshCw, Search, Send, X } from 'lucide-react'
import ProtectedRoute from '@/components/ProtectedRoute'
import DashboardLayout from '@/components/DashboardLayout'

type JobStatus = 'new' | 'saved' | 'applied' | 'rejected'

interface JobItem {
  _id: string
  source: string
  title: string
  company?: string
  url: string
  location?: string
  salary?: string
  excerpt?: string
  publishedAt?: string
  createdAt: string
  score: number
  matchedSkills: string[]
  status: JobStatus
}

const TABS: { key: JobStatus; label: string }[] = [
  { key: 'new', label: 'New' },
  { key: 'saved', label: 'Saved' },
  { key: 'applied', label: 'Applied' },
  { key: 'rejected', label: 'Rejected' },
]

function timeAgo(value?: string) {
  if (!value) return ''
  const days = Math.floor((Date.now() - new Date(value).getTime()) / 86_400_000)
  if (days <= 0) return 'today'
  if (days === 1) return 'yesterday'
  return `${days} days ago`
}

function scoreClass(score: number) {
  if (score >= 15) return 'bg-emerald-600 text-white'
  if (score >= 9) return 'bg-teal-100 text-teal-800'
  return 'bg-slate-100 text-slate-600'
}

export default function AdminJobsPage() {
  const [tab, setTab] = useState<JobStatus>('new')
  const [query, setQuery] = useState('')
  const [jobs, setJobs] = useState<JobItem[]>([])
  const [stats, setStats] = useState<Record<string, number>>({})
  const [lastFoundAt, setLastFoundAt] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [running, setRunning] = useState(false)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const { data } = await axios.get('/api/admin/jobs', { params: { status: tab, q: query || undefined } })
      setJobs(data.data || [])
      setStats(data.stats || {})
      setLastFoundAt(data.lastFoundAt)
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load jobs')
    } finally {
      setLoading(false)
    }
  }, [tab, query])

  useEffect(() => {
    const timer = setTimeout(load, query ? 300 : 0)
    return () => clearTimeout(timer)
  }, [load, query])

  const runNow = async () => {
    try {
      setRunning(true)
      setNotice('')
      setError('')
      const { data } = await axios.post('/api/cron/jobs')
      const r = data.data
      setNotice(
        `Checked ${r.fetched} jobs · ${r.matched} matched your skills · ${r.inserted} new` +
          (r.alerted ? ` · ${r.alerted} sent to Telegram` : '') +
          (r.errors?.length ? ` · Some sources failed: ${r.errors.join('; ')}` : '')
      )
      await load()
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Job search failed')
    } finally {
      setRunning(false)
    }
  }

  const setStatus = async (job: JobItem, status: JobStatus) => {
    setJobs((list) => list.filter((j) => j._id !== job._id))
    setStats((s) => ({ ...s, [job.status]: Math.max(0, (s[job.status] || 1) - 1), [status]: (s[status] || 0) + 1 }))
    try {
      await axios.patch('/api/admin/jobs', { id: job._id, status })
    } catch {
      setError('Could not update the job, please refresh.')
      load()
    }
  }

  return (
    <ProtectedRoute requiredRoles={['admin']}>
      <DashboardLayout
        title="Job Finder"
        breadcrumbs={[
          { label: 'Admin Dashboard', href: '/dashboard/admin' },
          { label: 'Job Finder', href: '/dashboard/admin/jobs' },
        ]}
      >
        <div className="mx-auto max-w-6xl space-y-6">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-teal-600">Remote Jobs</p>
              <h1 className="text-2xl font-bold text-slate-900">Job Finder</h1>
              <p className="mt-1 text-sm text-slate-500">
                Collected daily from Remotive, RemoteOK, Arbeitnow, Jobicy and We Work Remotely, scored against your skills.
                {lastFoundAt && <> Last new job found {timeAgo(lastFoundAt)}.</>}
              </p>
            </div>
            <button
              type="button"
              onClick={runNow}
              disabled={running}
              className="inline-flex flex-shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-teal-600 disabled:opacity-60"
            >
              {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              {running ? 'Searching…' : 'Find Jobs Now'}
            </button>
          </div>

          {notice && <div className="rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-800">{notice}</div>}
          {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

          {/* Tabs + search */}
          <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-2 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-1 overflow-x-auto">
              {TABS.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTab(key)}
                  className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2 text-sm font-semibold transition ${
                    tab === key ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {label}
                  <span className={`rounded-full px-2 py-0.5 text-[11px] ${tab === key ? 'bg-white/20' : 'bg-slate-100 text-slate-500'}`}>
                    {stats[key] || 0}
                  </span>
                </button>
              ))}
            </div>
            <div className="relative sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search title, company, skill"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-teal-400 focus:bg-white"
              />
            </div>
          </div>

          {/* List */}
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
            </div>
          ) : jobs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-14 text-center">
              <p className="font-semibold text-slate-700">No {tab} jobs{query ? ` matching “${query}”` : ''}.</p>
              {tab === 'new' && !query && (
                <p className="mt-1 text-sm text-slate-500">Click “Find Jobs Now” to search, or wait for the daily automatic run.</p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.map((job) => (
                <article key={job._id} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:border-teal-100">
                  <div className="flex items-start gap-4">
                    <div className={`flex h-12 w-12 flex-shrink-0 flex-col items-center justify-center rounded-xl text-center ${scoreClass(job.score)}`} title="Match score">
                      <span className="text-base font-black leading-none">{job.score}</span>
                      <span className="text-[9px] font-semibold uppercase opacity-80">score</span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <a href={job.url} target="_blank" rel="noreferrer" className="group inline-flex items-start gap-1.5">
                        <h2 className="text-base font-bold text-slate-900 group-hover:text-teal-700">{job.title}</h2>
                        <ExternalLink className="mt-1 h-3.5 w-3.5 flex-shrink-0 text-slate-400 group-hover:text-teal-600" />
                      </a>
                      <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                        {job.company && (
                          <span className="inline-flex items-center gap-1"><Building2 className="h-3.5 w-3.5" />{job.company}</span>
                        )}
                        <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{job.location || 'Remote'}</span>
                        {job.salary && <span className="font-semibold text-emerald-700">{job.salary}</span>}
                        <span>{job.source} · {timeAgo(job.publishedAt || job.createdAt)}</span>
                      </div>
                      {job.excerpt && <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{job.excerpt}</p>}
                      {job.matchedSkills?.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {job.matchedSkills.map((skill) => (
                            <span key={skill} className="rounded-full border border-teal-100 bg-teal-50 px-2.5 py-0.5 text-xs font-medium text-teal-700">
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-teal-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-teal-600"
                    >
                      <Send className="h-3.5 w-3.5" /> Open &amp; Apply
                    </a>
                    {job.status !== 'saved' && (
                      <StatusButton onClick={() => setStatus(job, 'saved')} icon={<Bookmark className="h-3.5 w-3.5" />} label="Save" />
                    )}
                    {job.status !== 'applied' && (
                      <StatusButton onClick={() => setStatus(job, 'applied')} icon={<CheckCircle2 className="h-3.5 w-3.5" />} label="Mark Applied" />
                    )}
                    {job.status !== 'rejected' && (
                      <StatusButton onClick={() => setStatus(job, 'rejected')} icon={<X className="h-3.5 w-3.5" />} label="Not Interested" muted />
                    )}
                    {job.status !== 'new' && (
                      <StatusButton onClick={() => setStatus(job, 'new')} icon={<RefreshCw className="h-3.5 w-3.5" />} label="Move to New" muted />
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}

function StatusButton({ onClick, icon, label, muted }: { onClick: () => void; icon: React.ReactNode; label: string; muted?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
        muted ? 'border-slate-200 text-slate-500 hover:bg-slate-50' : 'border-slate-200 text-slate-700 hover:border-teal-200 hover:text-teal-700'
      }`}
    >
      {icon} {label}
    </button>
  )
}
