'use client'

import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import {
  Bookmark,
  Building2,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  Copy,
  ExternalLink,
  Eye,
  GraduationCap,
  Link2,
  Loader2,
  MapPin,
  PenLine,
  Plus,
  RefreshCw,
  Search,
  Send,
  X,
} from 'lucide-react'
import ProtectedRoute from '@/components/ProtectedRoute'
import DashboardLayout from '@/components/DashboardLayout'
import { trackedPortfolioUrl } from '@/lib/careerProfile'
import { buildCoverLetterPrompt, buildInterviewPrepPrompt, openInClaude, type PromptProject } from '@/lib/jobPrompts'

type JobStatus = 'new' | 'saved' | 'applied' | 'interview' | 'offer' | 'hired' | 'rejected'

interface JobItem {
  _id: string
  source: string
  title: string
  company?: string
  url: string
  location?: string
  salary?: string
  excerpt?: string
  description?: string
  tags?: string[]
  publishedAt?: string
  createdAt: string
  score: number
  matchedSkills: string[]
  status: JobStatus
  notes?: string
  appliedAt?: string
  followUpAt?: string
  interviewAt?: string
  refCode?: string
  visitCount?: number
  lastVisitAt?: string
  visits?: { at: string; path: string }[]
}

const TABS: { key: JobStatus; label: string }[] = [
  { key: 'new', label: 'New' },
  { key: 'saved', label: 'Saved' },
  { key: 'applied', label: 'Applied' },
  { key: 'interview', label: 'Interview' },
  { key: 'offer', label: 'Offer' },
  { key: 'hired', label: 'Hired' },
  { key: 'rejected', label: 'Rejected' },
]

const STATUS_LABEL = Object.fromEntries(TABS.map((t) => [t.key, t.label])) as Record<JobStatus, string>

function timeAgo(value?: string) {
  if (!value) return ''
  const minutes = Math.floor((Date.now() - new Date(value).getTime()) / 60_000)
  if (minutes < 60) return minutes <= 1 ? 'just now' : `${minutes} min ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return days === 1 ? 'yesterday' : `${days} days ago`
}

function toInputDate(value?: string, withTime = false) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString()
  return withTime ? local.slice(0, 16) : local.slice(0, 10)
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
  const [projects, setProjects] = useState<PromptProject[]>([])
  const [loading, setLoading] = useState(true)
  const [running, setRunning] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
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

  // My published projects, used to pick relevant examples for cover letters
  useEffect(() => {
    axios
      .get('/api/projects')
      .then(({ data }) => setProjects(Array.isArray(data.data) ? data.data : []))
      .catch(() => {})
  }, [])

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
          (r.reminders ? ` · ${r.reminders} reminders sent` : '') +
          (r.errors?.length ? ` · Some sources failed: ${r.errors.join('; ')}` : '')
      )
      await load()
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Job search failed')
    } finally {
      setRunning(false)
    }
  }

  /** PATCH a job and merge the server copy back into the list. */
  const updateJob = async (job: JobItem, changes: Record<string, any>) => {
    const { data } = await axios.patch('/api/admin/jobs', { id: job._id, ...changes })
    const updated: JobItem = data.data
    if (changes.status && changes.status !== tab) {
      setJobs((list) => list.filter((j) => j._id !== job._id))
      setStats((s) => ({ ...s, [job.status]: Math.max(0, (s[job.status] || 1) - 1), [changes.status]: (s[changes.status] || 0) + 1 }))
      setNotice(`Moved “${job.title}” to ${STATUS_LABEL[changes.status as JobStatus]}.`)
    } else {
      setJobs((list) => list.map((j) => (j._id === job._id ? updated : j)))
    }
    return updated
  }

  const safeUpdate = async (job: JobItem, changes: Record<string, any>) => {
    try {
      return await updateJob(job, changes)
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Could not update the job, please refresh.')
      return null
    }
  }

  /** Makes sure the job has a tracking code and returns the tracked portfolio URL. */
  const ensureTrackedUrl = async (job: JobItem) => {
    if (job.refCode) return trackedPortfolioUrl(job.refCode)
    const updated = await safeUpdate(job, { ensureRef: true })
    return trackedPortfolioUrl(updated?.refCode)
  }

  const reportClaude = ({ copied, opened }: { copied: boolean; opened: boolean }, what: string) => {
    if (opened) {
      setNotice(`${what} prompt sent to Claude in a new tab.${copied ? ' If the message box is empty, paste with Ctrl+V and press Enter.' : ''}`)
    } else if (copied) {
      setNotice(`${what} prompt copied. Your browser blocked the new tab — open claude.ai, paste with Ctrl+V and press Enter.`)
    } else {
      setError('Browser blocked both the clipboard and the new tab. Allow pop-ups for this site and try again.')
    }
  }

  const coverLetter = async (job: JobItem) => {
    const url = await ensureTrackedUrl(job)
    reportClaude(await openInClaude(buildCoverLetterPrompt(job, projects, url)), 'Cover letter')
  }

  const interviewPrep = async (job: JobItem) => {
    reportClaude(await openInClaude(buildInterviewPrepPrompt(job)), 'Interview prep')
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
            <div className="flex flex-shrink-0 gap-2">
              <button
                type="button"
                onClick={() => setShowAdd(true)}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-teal-200 hover:text-teal-700"
              >
                <Plus className="h-4 w-4" /> Add Job
              </button>
              <button
                type="button"
                onClick={runNow}
                disabled={running}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-teal-600 disabled:opacity-60"
              >
                {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                {running ? 'Searching…' : 'Find Jobs Now'}
              </button>
            </div>
          </div>

          {notice && (
            <div className="flex items-start justify-between gap-3 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-800">
              <span>{notice}</span>
              <button type="button" onClick={() => setNotice('')} aria-label="Dismiss"><X className="h-4 w-4" /></button>
            </div>
          )}
          {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

          {/* Tabs + search */}
          <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-2 shadow-sm xl:flex-row xl:items-center xl:justify-between">
            <div className="flex gap-1 overflow-x-auto">
              {TABS.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTab(key)}
                  className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-3.5 py-2 text-sm font-semibold transition ${
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
            <div className="relative xl:w-60">
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
              <p className="font-semibold text-slate-700">No {STATUS_LABEL[tab].toLowerCase()} jobs{query ? ` matching “${query}”` : ''}.</p>
              {tab === 'new' && !query && (
                <p className="mt-1 text-sm text-slate-500">Click “Find Jobs Now” to search, or wait for the daily automatic run.</p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  onUpdate={(changes) => safeUpdate(job, changes)}
                  onTrackedUrl={() => ensureTrackedUrl(job)}
                  onCoverLetter={() => coverLetter(job)}
                  onInterviewPrep={() => interviewPrep(job)}
                />
              ))}
            </div>
          )}
        </div>

        {showAdd && (
          <AddJobModal
            onClose={() => setShowAdd(false)}
            onAdded={(status) => {
              setShowAdd(false)
              setNotice('Job added.')
              if (status === tab) load()
              else setTab(status)
            }}
          />
        )}
      </DashboardLayout>
    </ProtectedRoute>
  )
}

// ─── Job card ─────────────────────────────────────────────────────────────────

function JobCard({
  job,
  onUpdate,
  onTrackedUrl,
  onCoverLetter,
  onInterviewPrep,
}: {
  job: JobItem
  onUpdate: (changes: Record<string, any>) => Promise<JobItem | null>
  onTrackedUrl: () => Promise<string>
  onCoverLetter: () => Promise<void>
  onInterviewPrep: () => Promise<void>
}) {
  const inPipeline = ['applied', 'interview', 'offer', 'hired'].includes(job.status)
  const [open, setOpen] = useState(false)
  const [notes, setNotes] = useState(job.notes || '')
  const [copied, setCopied] = useState(false)
  const [busy, setBusy] = useState<'' | 'cover' | 'prep'>('')

  useEffect(() => setNotes(job.notes || ''), [job.notes])

  const copyLink = async () => {
    const url = await onTrackedUrl()
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.prompt('Copy your tracking link:', url)
    }
  }

  const run = async (kind: 'cover' | 'prep', fn: () => Promise<void>) => {
    setBusy(kind)
    try {
      await fn()
    } finally {
      setBusy('')
    }
  }

  return (
    <article className="rounded-2xl border border-slate-200/80 bg-white shadow-sm transition hover:border-teal-100">
      <div className="p-5">
        <div className="flex items-start gap-4">
          {job.source === 'Manual' ? (
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-[10px] font-bold uppercase text-indigo-700">Manual</div>
          ) : (
            <div className={`flex h-12 w-12 flex-shrink-0 flex-col items-center justify-center rounded-xl text-center ${scoreClass(job.score)}`} title="Match score">
              <span className="text-base font-black leading-none">{job.score}</span>
              <span className="text-[9px] font-semibold uppercase opacity-80">score</span>
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <a href={job.url} target="_blank" rel="noreferrer" className="group inline-flex items-start gap-1.5">
                <h2 className="text-base font-bold text-slate-900 group-hover:text-teal-700">{job.title}</h2>
                <ExternalLink className="mt-1 h-3.5 w-3.5 flex-shrink-0 text-slate-400 group-hover:text-teal-600" />
              </a>
              {(job.visitCount || 0) > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 ring-1 ring-amber-200">
                  <Eye className="h-3.5 w-3.5" /> Viewed your portfolio {job.visitCount}× · {timeAgo(job.lastVisitAt)}
                </span>
              )}
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
              {job.company && <span className="inline-flex items-center gap-1"><Building2 className="h-3.5 w-3.5" />{job.company}</span>}
              <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{job.location || 'Remote'}</span>
              {job.salary && <span className="font-semibold text-emerald-700">{job.salary}</span>}
              <span>{job.source} · {timeAgo(job.publishedAt || job.createdAt)}</span>
              {job.appliedAt && <span>Applied {timeAgo(job.appliedAt)}</span>}
              {job.interviewAt && (
                <span className="inline-flex items-center gap-1 font-semibold text-violet-700">
                  <CalendarClock className="h-3.5 w-3.5" />
                  Interview {new Date(job.interviewAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
                </span>
              )}
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

        {/* Actions */}
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={() => run('cover', onCoverLetter)}
            disabled={busy !== ''}
            className="inline-flex items-center gap-1.5 rounded-lg bg-teal-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-teal-600 disabled:opacity-60"
          >
            {busy === 'cover' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <PenLine className="h-3.5 w-3.5" />} Write Cover Letter
          </button>
          <a
            href={job.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-teal-200 px-3 py-1.5 text-xs font-bold text-teal-700 hover:bg-teal-50"
          >
            <Send className="h-3.5 w-3.5" /> Open &amp; Apply
          </a>
          <StatusButton onClick={copyLink} icon={copied ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Link2 className="h-3.5 w-3.5" />} label={copied ? 'Copied!' : 'Copy Tracking Link'} />

          {job.status === 'new' && <StatusButton onClick={() => onUpdate({ status: 'saved' })} icon={<Bookmark className="h-3.5 w-3.5" />} label="Save" />}
          {['new', 'saved'].includes(job.status) && (
            <StatusButton onClick={() => onUpdate({ status: 'applied' })} icon={<CheckCircle2 className="h-3.5 w-3.5" />} label="Mark Applied" />
          )}
          {['applied', 'interview'].includes(job.status) && (
            <StatusButton onClick={() => run('prep', onInterviewPrep)} icon={<GraduationCap className="h-3.5 w-3.5" />} label="Interview Prep" />
          )}
          {!['rejected', 'hired'].includes(job.status) && (
            <StatusButton onClick={() => onUpdate({ status: 'rejected' })} icon={<X className="h-3.5 w-3.5" />} label={inPipeline ? 'Rejected' : 'Not Interested'} muted />
          )}

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="ml-auto inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-800"
          >
            Details <ChevronDown className={`h-3.5 w-3.5 transition ${open ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Details: pipeline + notes + tracking */}
      {open && (
        <div className="grid gap-5 border-t border-slate-100 bg-slate-50/60 p-5 md:grid-cols-2">
          <div className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-slate-700">Stage</span>
              <select
                value={job.status}
                onChange={(e) => onUpdate({ status: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-teal-400"
              >
                {TABS.map((t) => (
                  <option key={t.key} value={t.key}>{t.label}</option>
                ))}
              </select>
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-slate-700">Follow-up reminder</span>
                <input
                  type="date"
                  value={toInputDate(job.followUpAt)}
                  onChange={(e) => onUpdate({ followUpAt: e.target.value || null })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-teal-400"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-slate-700">Interview date &amp; time</span>
                <input
                  type="datetime-local"
                  value={toInputDate(job.interviewAt, true)}
                  onChange={(e) => onUpdate({ interviewAt: e.target.value ? new Date(e.target.value).toISOString() : null, ...(e.target.value && job.status !== 'interview' ? { status: 'interview' } : {}) })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-teal-400"
                />
              </label>
            </div>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-slate-700">Notes</span>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                onBlur={() => notes !== (job.notes || '') && onUpdate({ notes })}
                rows={4}
                placeholder="Recruiter name, salary discussed, next steps…"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-teal-400"
              />
              <span className="mt-1 block text-[11px] text-slate-400">Saved automatically when you click outside the box.</span>
            </label>
          </div>

          <div className="space-y-3">
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold text-slate-700">Portfolio tracking link</p>
              {job.refCode ? (
                <div className="mt-2 flex items-center gap-2">
                  <code className="min-w-0 flex-1 truncate rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs text-slate-700">{trackedPortfolioUrl(job.refCode)}</code>
                  <button type="button" onClick={copyLink} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-teal-700" aria-label="Copy link">
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button type="button" onClick={copyLink} className="mt-2 text-xs font-semibold text-teal-700 hover:underline">
                  Create &amp; copy tracking link
                </button>
              )}
              <p className="mt-2 text-[11px] leading-5 text-slate-500">
                Put this link in your application. When someone opens it you get a Telegram alert and the visit shows here.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold text-slate-700">Portfolio visits {job.visitCount ? `(${job.visitCount})` : ''}</p>
              {job.visits?.length ? (
                <ul className="mt-2 max-h-40 space-y-1 overflow-y-auto text-xs text-slate-600">
                  {[...job.visits].reverse().slice(0, 20).map((v, i) => (
                    <li key={i} className="flex justify-between gap-3">
                      <span className="truncate font-medium">{v.path}</span>
                      <span className="flex-shrink-0 text-slate-400">{timeAgo(v.at)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-xs text-slate-400">No visits yet.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </article>
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

// ─── Add job modal ────────────────────────────────────────────────────────────

function AddJobModal({ onClose, onAdded }: { onClose: () => void; onAdded: (status: JobStatus) => void }) {
  const [form, setForm] = useState({ title: '', company: '', url: '', location: '', description: '', status: 'saved' as JobStatus })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const set = (key: keyof typeof form, value: string) => setForm((f) => ({ ...f, [key]: value }))

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      await axios.post('/api/admin/jobs', form)
      onAdded(form.status)
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Could not add the job')
    } finally {
      setSaving(false)
    }
  }

  const input = 'w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-teal-400'

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 px-4 py-10 backdrop-blur-sm">
      <form onSubmit={submit} className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Add a job</h2>
            <p className="text-xs text-slate-500">Found on LinkedIn, Facebook, a referral…? Track it here too.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-4 p-6">
          {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-xs font-semibold text-slate-700">Job title *</span>
              <input required value={form.title} onChange={(e) => set('title', e.target.value)} className={input} placeholder="Laravel Developer" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-slate-700">Company</span>
              <input value={form.company} onChange={(e) => set('company', e.target.value)} className={input} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-slate-700">Location</span>
              <input value={form.location} onChange={(e) => set('location', e.target.value)} className={input} placeholder="Remote" />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-xs font-semibold text-slate-700">Job link *</span>
              <input required type="url" value={form.url} onChange={(e) => set('url', e.target.value)} className={input} placeholder="https://" />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-xs font-semibold text-slate-700">Job description</span>
              <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={5} className={input} placeholder="Paste the job description — it makes cover letters and interview prep much better." />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-xs font-semibold text-slate-700">Stage</span>
              <select value={form.status} onChange={(e) => set('status', e.target.value)} className={input}>
                {TABS.filter((t) => t.key !== 'new').map((t) => (
                  <option key={t.key} value={t.key}>{t.label}</option>
                ))}
              </select>
            </label>
          </div>
        </div>
        <div className="flex justify-end gap-2 border-t border-slate-100 px-6 py-4">
          <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-5 py-2 text-sm font-bold text-white hover:bg-teal-600 disabled:opacity-60">
            {saving && <Loader2 className="h-4 w-4 animate-spin" />} Add Job
          </button>
        </div>
      </form>
    </div>
  )
}
