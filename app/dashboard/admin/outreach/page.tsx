'use client'

import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { AlertTriangle, ExternalLink, Eye, Loader2, Mail, Plus, Search, Send, Sparkles, Upload } from 'lucide-react'
import ProtectedRoute from '@/components/ProtectedRoute'
import DashboardLayout from '@/components/DashboardLayout'

type Group = 'review' | 'queue' | 'sent' | 'replied' | 'closed'

interface ProspectItem {
  _id: string
  company: string
  website?: string
  email?: string
  contactName?: string
  industry?: string
  country?: string
  source: string
  sourceNote?: string
  summary?: string
  likelyNeeds?: string[]
  fit?: 'good' | 'maybe' | 'poor'
  status: string
  draft?: { subject?: string; body?: string }
  emails?: { kind: string; subject: string; sentAt: string }[]
  nextSendAt?: string
  lastError?: string
  visitCount?: number
  lastVisitAt?: string
}

const TABS: { key: Group; label: string; hint: string }[] = [
  { key: 'review', label: 'To review', hint: 'Drafted emails waiting for your approval' },
  { key: 'queue', label: 'Queue', hint: 'Found companies (researched daily) and approved emails waiting for the daily limit' },
  { key: 'sent', label: 'Sent', hint: 'Emails sent; follow-ups go out automatically unless they reply' },
  { key: 'replied', label: 'Replied', hint: 'Continue these conversations from your inbox' },
  { key: 'closed', label: 'Closed', hint: 'Skipped, stopped, unsubscribed or failed' },
]

const STATUS_LABEL: Record<string, string> = {
  new: 'Not researched yet',
  draft: 'Draft ready',
  needs_email: 'Needs an email address',
  approved: 'Approved · waiting for daily limit',
  sent: 'First email sent',
  followup_1: 'Follow-up 1 sent',
  followup_2: 'Sequence finished',
  replied: 'Replied',
  stopped: 'Stopped',
  unsubscribed: 'Unsubscribed',
  skipped: 'Skipped',
  failed: 'Research failed',
}

const fmtDate = (iso?: string) => (iso ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '')

/** "company,website,email,industry,country" per line (header row optional). */
function parseCsv(text: string) {
  return text
    .split(/\r?\n/)
    .map((line) => line.split(/[,\t]/).map((cell) => cell.trim().replace(/^"|"$/g, '')))
    .filter((cells) => cells[0] && !/^company$/i.test(cells[0]))
    .map(([company, website, email, industry, country]) => ({ company, website, email, industry, country }))
}

export default function OutreachPage() {
  const [group, setGroup] = useState<Group>('review')
  const [items, setItems] = useState<ProspectItem[]>([])
  const [stats, setStats] = useState<Record<string, number>>({})
  const [sending, setSending] = useState<{ configured: boolean; sentToday: number; dailyLimit: number } | null>(null)
  const [ai, setAi] = useState<'anthropic' | 'gemini' | null | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')

  const [target, setTarget] = useState('')
  const [count, setCount] = useState(5)
  const [discovering, setDiscovering] = useState(false)
  const [showAdd, setShowAdd] = useState(false)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      const { data } = await axios.get('/api/admin/prospects', { params: { group } })
      setItems(data.data || [])
      setStats(data.stats || {})
      setSending(data.sending || null)
      setAi(data.ai ?? null)
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load')
    } finally {
      setLoading(false)
    }
  }, [group])

  useEffect(() => {
    load()
  }, [load])

  const discover = async () => {
    setDiscovering(true)
    setError('')
    setNotice('')
    try {
      const { data } = await axios.post('/api/admin/prospects/discover', { target, count })
      setNotice(`Found ${data.data.found} companies · ${data.data.added} new added to the Queue. Research a few now, or the daily run drafts 3 per day automatically.`)
      setGroup('queue')
      load()
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Search failed')
    } finally {
      setDiscovering(false)
    }
  }

  const replace = (updated: ProspectItem) => setItems((list) => list.map((p) => (p._id === updated._id ? updated : p)))
  const remove = (id: string) => setItems((list) => list.filter((p) => p._id !== id))

  return (
    <ProtectedRoute requiredRoles={['admin']}>
      <DashboardLayout
        title="Client Outreach"
        breadcrumbs={[
          { label: 'Admin Dashboard', href: '/dashboard/admin' },
          { label: 'Client Outreach', href: '/dashboard/admin/outreach' },
        ]}
      >
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-teal-600">Find clients</p>
              <h1 className="text-2xl font-bold text-slate-900">Client Outreach</h1>
              <p className="mt-1 text-sm text-slate-500">
                The AI finds companies, reads their websites and drafts personal emails. Nothing is sent until you approve it here or in Telegram.
              </p>
            </div>
            <div className="flex flex-shrink-0 flex-wrap gap-2">
            {ai !== undefined && (
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${ai ? 'bg-slate-100 text-slate-700' : 'bg-amber-50 text-amber-800'}`}>
                <Sparkles className="h-3.5 w-3.5" />
                {ai === 'anthropic' ? 'AI: Claude' : ai === 'gemini' ? 'AI: Gemini (free)' : 'AI not set up'}
              </span>
            )}
            {sending && (
              <span className={`inline-flex flex-shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${sending.configured ? 'bg-teal-50 text-teal-800' : 'bg-amber-50 text-amber-800'}`}>
                <Mail className="h-3.5 w-3.5" />
                {sending.configured ? `Sent today: ${sending.sentToday} / ${sending.dailyLimit}` : 'Email sending not set up'}
              </span>
            )}
            </div>
          </div>

          {sending && !sending.configured && (
            <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <span>Add <b>RESEND_API_KEY</b> and <b>OUTREACH_FROM_EMAIL</b> in Vercel (see docs/OUTREACH.md). You can still find companies and prepare drafts now.</span>
            </div>
          )}
          {ai === null && (
            <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <span>
                No AI key yet — add companies yourself and use <b>Write email myself</b>. For AI search and drafts, add a free <b>GEMINI_API_KEY</b>{' '}
                (aistudio.google.com) or <b>ANTHROPIC_API_KEY</b> in Vercel.
              </span>
            </div>
          )}
          {notice && <div className="rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-800">{notice}</div>}
          {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

          {/* Find clients */}
          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <h2 className="flex items-center gap-2 font-bold text-slate-900">
              <Sparkles className="h-4 w-4 text-teal-600" /> Find new clients with AI
            </h2>
            <p className="mt-1 text-xs text-slate-500">Describe who you want to work with — industry, place, size, problem. Takes 1–3 minutes.</p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <input
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="e.g. Garment buying houses in Dhaka · Dental clinics in London without online booking · Schools in Chittagong"
                className="flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal-400"
              />
              <select value={count} onChange={(e) => setCount(Number(e.target.value))} aria-label="How many" className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm">
                {[3, 5, 10].map((n) => (
                  <option key={n} value={n}>{n} companies</option>
                ))}
              </select>
              <button
                type="button"
                onClick={discover}
                disabled={discovering || !ai || target.trim().length < 5}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-teal-600 disabled:opacity-50"
              >
                {discovering ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />} {discovering ? 'Searching the web…' : 'Find'}
              </button>
            </div>
            <button type="button" onClick={() => setShowAdd((v) => !v)} className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:underline">
              <Plus className="h-3.5 w-3.5" /> Add companies yourself (one or a CSV list)
            </button>
            {showAdd && <AddProspects onAdded={(msg) => { setNotice(msg); setGroup('queue'); load() }} onError={setError} />}
          </section>

          {/* Tabs */}
          <div className="flex gap-1 overflow-x-auto rounded-2xl border border-slate-200/80 bg-white p-2 shadow-sm">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setGroup(t.key)}
                title={t.hint}
                className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-3.5 py-2 text-sm font-semibold transition ${group === t.key ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                {t.label}
                <span className={`rounded-full px-2 py-0.5 text-[11px] ${group === t.key ? 'bg-white/20' : 'bg-slate-100 text-slate-500'}`}>{stats[t.key] || 0}</span>
              </button>
            ))}
          </div>
          <p className="-mt-3 text-xs text-slate-500">{TABS.find((t) => t.key === group)?.hint}</p>

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-14 text-center text-sm text-slate-500">Nothing here yet.</div>
          ) : (
            <div className="space-y-3">
              {items.map((p) => (
                <ProspectCard key={p._id} prospect={p} aiReady={Boolean(ai)} onUpdated={replace} onRemoved={remove} onNotice={setNotice} onError={setError} />
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}

function AddProspects({ onAdded, onError }: { onAdded: (msg: string) => void; onError: (msg: string) => void }) {
  const [one, setOne] = useState({ company: '', website: '', email: '' })
  const [csv, setCsv] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (rows: any[] | null) => {
    setBusy(true)
    try {
      const { data } = await axios.post('/api/admin/prospects', rows ? { rows } : one)
      onAdded(`${data.data.added} added · ${data.data.skipped} skipped (duplicates or missing website/email).`)
      setOne({ company: '', website: '', email: '' })
      setCsv('')
    } catch (err: any) {
      onError(err?.response?.data?.message || 'Could not add')
    } finally {
      setBusy(false)
    }
  }

  const input = 'rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-400'
  return (
    <div className="mt-4 grid gap-5 border-t border-slate-100 pt-4 md:grid-cols-2">
      <div className="space-y-2">
        <p className="text-xs font-semibold text-slate-700">One company</p>
        <input value={one.company} onChange={(e) => setOne({ ...one, company: e.target.value })} placeholder="Company name" className={`${input} w-full`} />
        <input value={one.website} onChange={(e) => setOne({ ...one, website: e.target.value })} placeholder="Website" className={`${input} w-full`} />
        <input value={one.email} onChange={(e) => setOne({ ...one, email: e.target.value })} placeholder="Business email (optional)" className={`${input} w-full`} />
        <button type="button" disabled={busy || !one.company} onClick={() => submit(null)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-teal-300 disabled:opacity-50">
          Add
        </button>
      </div>
      <div className="space-y-2">
        <p className="text-xs font-semibold text-slate-700">CSV list — one per line: company, website, email, industry, country</p>
        <textarea value={csv} onChange={(e) => setCsv(e.target.value)} rows={6} placeholder={'Rahim Knit, rahimknit.com, info@rahimknit.com, Garments, Bangladesh\nSmile Dental, smiledental.co.uk, , Dental clinic, UK'} className={`${input} w-full font-mono text-xs`} />
        <button type="button" disabled={busy || !csv.trim()} onClick={() => submit(parseCsv(csv))} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-teal-300 disabled:opacity-50">
          <Upload className="h-4 w-4" /> Import {csv.trim() ? parseCsv(csv).length : ''}
        </button>
      </div>
    </div>
  )
}

function ProspectCard({
  prospect: p,
  aiReady,
  onUpdated,
  onRemoved,
  onNotice,
  onError,
}: {
  prospect: ProspectItem
  aiReady: boolean
  onUpdated: (p: ProspectItem) => void
  onRemoved: (id: string) => void
  onNotice: (msg: string) => void
  onError: (msg: string) => void
}) {
  const [subject, setSubject] = useState(p.draft?.subject || '')
  const [body, setBody] = useState(p.draft?.body || '')
  const [email, setEmail] = useState(p.email || '')
  const [busy, setBusy] = useState('')

  useEffect(() => {
    setSubject(p.draft?.subject || '')
    setBody(p.draft?.body || '')
    setEmail(p.email || '')
  }, [p])

  const act = async (action: string) => {
    setBusy(action)
    onError('')
    try {
      const payload: any = { id: p._id, action }
      if (['draft', 'needs_email'].includes(p.status)) payload.draft = { subject, body }
      if (email !== (p.email || '')) payload.email = email
      const { data } = await axios.patch('/api/admin/prospects', payload)
      onNotice(`${p.company}: ${data.message}`)
      if (['send', 'skip', 'replied', 'stop', 'reopen', 'manual'].includes(action)) onRemoved(p._id)
      else onUpdated(data.data)
    } catch (err: any) {
      onError(err?.response?.data?.message || 'Action failed')
    } finally {
      setBusy('')
    }
  }

  const research = async () => {
    setBusy('research')
    onError('')
    try {
      const { data } = await axios.post(`/api/admin/prospects/${p._id}/research`)
      onNotice(`${p.company}: draft ready (also sent to Telegram). Find it under "To review".`)
      onUpdated(data.data)
    } catch (err: any) {
      onError(err?.response?.data?.message || 'Research failed')
    } finally {
      setBusy('')
    }
  }

  const editable = ['draft', 'needs_email', 'approved'].includes(p.status)
  const fitCls = p.fit === 'good' ? 'bg-emerald-50 text-emerald-700' : p.fit === 'poor' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
  const btn = 'inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-teal-200 hover:text-teal-700 disabled:opacity-50'

  return (
    <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <h2 className="font-bold text-slate-900">{p.company}</h2>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
            {p.website && (
              <a href={/^https?:/.test(p.website) ? p.website : `https://${p.website}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-teal-700">
                {p.website.replace(/^https?:\/\/(www\.)?/, '')} <ExternalLink className="h-3 w-3" />
              </a>
            )}
            {p.industry && <span>{p.industry}</span>}
            {p.country && <span>{p.country}</span>}
            <span>{STATUS_LABEL[p.status] || p.status}</span>
            {p.nextSendAt && ['sent', 'followup_1'].includes(p.status) && <span>Next follow-up {fmtDate(p.nextSendAt)}</span>}
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {p.fit && p.summary && <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${fitCls}`}>Fit: {p.fit}</span>}
          {(p.visitCount || 0) > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700">
              <Eye className="h-3 w-3" /> Opened portfolio {p.visitCount}×
            </span>
          )}
        </div>
      </div>

      {(p.summary || p.sourceNote) && <p className="mt-2 text-sm leading-6 text-slate-600">{p.summary || p.sourceNote}</p>}
      {!!p.likelyNeeds?.length && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {p.likelyNeeds.map((n) => (
            <span key={n} className="rounded-full border border-teal-100 bg-teal-50 px-2.5 py-0.5 text-xs text-teal-700">{n}</span>
          ))}
        </div>
      )}
      {p.lastError && <p className="mt-2 rounded-lg bg-red-50 px-3 py-1.5 text-xs text-red-700">{p.lastError}</p>}

      {editable && (
        <div className="mt-4 space-y-2 rounded-xl bg-slate-50 p-3">
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Recipient email" aria-label="Recipient email" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm" />
          <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" aria-label="Subject" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold" />
          <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={8} aria-label="Email body" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm leading-6" />
          <p className="text-[11px] text-slate-500">{'{{PORTFOLIO_LINK}}'} becomes your tracking link. Signature and unsubscribe line are added automatically.</p>
        </div>
      )}

      {!!p.emails?.length && (
        <ul className="mt-3 space-y-1 text-xs text-slate-500">
          {p.emails.map((e) => (
            <li key={`${e.kind}-${e.sentAt}`}>📤 {fmtDate(e.sentAt)} · {e.kind.replace('_', ' ')} · “{e.subject}”</li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
        {['new', 'failed'].includes(p.status) && (
          <>
            <button type="button" onClick={research} disabled={!!busy || !aiReady} title={aiReady ? '' : 'Add an AI key to use this'} className="inline-flex items-center gap-1.5 rounded-lg bg-teal-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-teal-600 disabled:opacity-50">
              {busy === 'research' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />} Research & draft email
            </button>
            <button type="button" onClick={() => act('manual')} disabled={!!busy} className={btn}>
              ✍️ Write email myself
            </button>
          </>
        )}
        {editable && (
          <>
            <button type="button" onClick={() => act('send')} disabled={!!busy || !email || !subject || !body} className="inline-flex items-center gap-1.5 rounded-lg bg-teal-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-teal-600 disabled:opacity-50">
              {busy === 'send' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />} Approve & send
            </button>
            <button type="button" onClick={() => act('save')} disabled={!!busy} className={btn}>Save changes</button>
          </>
        )}
        {['sent', 'followup_1', 'followup_2'].includes(p.status) && (
          <>
            <button type="button" onClick={() => act('replied')} disabled={!!busy} className={btn}>💬 They replied</button>
            <button type="button" onClick={() => act('stop')} disabled={!!busy} className={btn}>🛑 Stop follow-ups</button>
          </>
        )}
        {['new', 'draft', 'needs_email', 'approved', 'failed'].includes(p.status) && (
          <button type="button" onClick={() => act('skip')} disabled={!!busy} className={btn}>Skip</button>
        )}
        {['skipped', 'stopped', 'failed'].includes(p.status) && (
          <button type="button" onClick={() => act('reopen')} disabled={!!busy} className={btn}>Reopen</button>
        )}
      </div>
    </article>
  )
}
