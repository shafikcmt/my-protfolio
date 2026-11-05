'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, Clock, Copy, Download, Loader2, ShieldCheck, Star } from 'lucide-react'
import { WHATSAPP_URL } from '@/lib/constants'

export interface ProposalData {
  token: string
  title: string
  summary: string
  clientName: string
  clientEmail: string
  clientPhone: string
  notes: string
  packages: { name: string; priceUsd: number; timeline: string; includes: string[]; recommended: boolean }[]
  createdAt: string
  validUntil: string | null
  /** open | expired | accepted | payment_reported | paid | withdrawn */
  status: string
  acceptedPackage: string | null
  acceptedPrice: number | null
  paymentMethod: string | null
  terms: {
    schedule: { label: string; percent: number }[]
    supportDays: number
    conditions: string[]
    paymentMethods: { name: string; details: string }[]
  }
}

const usd = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`
const date = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '')

export default function ProposalView({ data }: { data: ProposalData }) {
  const [status, setStatus] = useState(data.status)
  const [acceptedName, setAcceptedName] = useState(data.acceptedPackage)
  const [selected, setSelected] = useState(
    data.acceptedPackage || data.packages.find((p) => p.recommended)?.name || data.packages[0]?.name || ''
  )
  const pkg = data.packages.find((p) => p.name === selected) || data.packages[0]
  const price = data.acceptedPrice || pkg?.priceUsd || 0
  const steps = useMemo(
    () => data.terms.schedule.map((s) => ({ ...s, amount: Math.round((price * s.percent) / 100) })),
    [data.terms.schedule, price]
  )
  const advance = steps[0]?.amount || 0
  const locked = status !== 'open'

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 print:bg-white print:py-0">
      <div className="container-custom max-w-4xl space-y-6">
        {/* Header */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 print:border-0 print:shadow-none">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">Project proposal</p>
              <h1 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">{data.title}</h1>
              <p className="mt-2 text-sm text-slate-500">
                {data.clientName ? <>Prepared for <b className="text-slate-700">{data.clientName}</b> · </> : null}
                by Md Shafiqul Islam · {date(data.createdAt)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => window.print()}
              className="no-print inline-flex items-center gap-2 self-start rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Download className="h-4 w-4" /> Download PDF
            </button>
          </div>
          {data.summary && <p className="mt-5 whitespace-pre-line text-[15px] leading-7 text-slate-700">{data.summary}</p>}
          {data.validUntil && status === 'open' && (
            <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
              <Clock className="h-3.5 w-3.5" /> Valid until {date(data.validUntil)}
            </p>
          )}
        </section>

        <StatusBanner status={status} />

        {/* Packages */}
        <section>
          <h2 className="mb-3 text-lg font-black text-slate-900">{locked ? 'Selected package' : 'Choose your package'}</h2>
          <div className={`grid gap-4 ${data.packages.length > 2 ? 'md:grid-cols-3' : data.packages.length === 2 ? 'md:grid-cols-2' : ''}`}>
            {data.packages
              .filter((p) => !locked || !acceptedName || p.name === acceptedName)
              .map((p) => {
                const active = p.name === selected
                return (
                  <button
                    key={p.name}
                    type="button"
                    disabled={locked}
                    onClick={() => setSelected(p.name)}
                    aria-pressed={active}
                    className={`relative flex flex-col rounded-2xl border bg-white p-5 text-left shadow-sm transition disabled:cursor-default ${
                      active ? 'border-teal-500 ring-2 ring-teal-500/20' : 'border-slate-200 hover:border-teal-300'
                    }`}
                  >
                    {p.recommended && (
                      <span className="absolute -top-2.5 left-5 inline-flex items-center gap-1 rounded-full bg-teal-600 px-2.5 py-0.5 text-[11px] font-bold text-white">
                        <Star className="h-3 w-3" /> Recommended
                      </span>
                    )}
                    <span className="text-sm font-bold text-slate-500">{p.name}</span>
                    <span className="mt-1 text-3xl font-black text-slate-900">{usd(p.priceUsd)}</span>
                    {p.timeline && <span className="mt-1 text-xs font-semibold text-slate-500">Estimated {p.timeline}</span>}
                    <ul className="mt-4 space-y-2 text-sm text-slate-700">
                      {p.includes.map((item) => (
                        <li key={item} className="flex gap-2">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-teal-600" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </button>
                )
              })}
          </div>
        </section>

        {/* Payment schedule + terms */}
        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-bold text-slate-900">Payment schedule · {pkg?.name}</h3>
            <ul className="mt-3 divide-y divide-slate-100 text-sm">
              {steps.map((s) => (
                <li key={s.label} className="flex justify-between gap-4 py-2">
                  <span className="text-slate-600">
                    {s.label} <span className="text-slate-400">({s.percent}%)</span>
                  </span>
                  <span className="font-bold text-slate-900">{usd(s.amount)}</span>
                </li>
              ))}
              <li className="flex justify-between gap-4 py-2 font-black text-slate-900">
                <span>Total</span>
                <span>{usd(price)}</span>
              </li>
            </ul>
            <p className="mt-2 text-xs text-slate-500">Clients in Bangladesh can pay the BDT equivalent.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="flex items-center gap-2 font-bold text-slate-900">
              <ShieldCheck className="h-4 w-4 text-teal-600" /> Terms
            </h3>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-slate-600">
              <li>{data.terms.supportDays} days of free bug-fix support after delivery.</li>
              {data.terms.conditions.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            {data.notes && <p className="mt-3 whitespace-pre-line rounded-xl bg-slate-50 p-3 text-sm text-slate-600">{data.notes}</p>}
          </div>
        </section>

        {status === 'open' && pkg && (
          <AcceptForm
            data={data}
            pkg={pkg}
            onAccepted={() => {
              setAcceptedName(pkg.name)
              setStatus('accepted')
            }}
          />
        )}
        {(status === 'accepted' || status === 'payment_reported') && (
          <PaymentSection data={data} advance={advance} reported={status === 'payment_reported'} onReported={() => setStatus('payment_reported')} />
        )}

        <p className="no-print pb-6 text-center text-sm text-slate-500">
          Questions? <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="font-semibold text-teal-700 hover:underline">Message Shafiqul on WhatsApp</a> or{' '}
          <Link href="/contact" className="font-semibold text-teal-700 hover:underline">use the contact page</Link>.
        </p>
      </div>
    </div>
  )
}

function StatusBanner({ status }: { status: string }) {
  const banners: Record<string, { cls: string; text: string }> = {
    accepted: { cls: 'border-teal-200 bg-teal-50 text-teal-900', text: '✅ Proposal accepted. Pay the advance below to start the project.' },
    payment_reported: { cls: 'border-sky-200 bg-sky-50 text-sky-900', text: '⏳ Payment details received. Shafiqul will confirm your payment shortly.' },
    paid: { cls: 'border-emerald-200 bg-emerald-50 text-emerald-900', text: '🎉 Payment confirmed — your project has started. Shafiqul will be in touch with next steps.' },
    withdrawn: { cls: 'border-slate-200 bg-slate-100 text-slate-700', text: 'This proposal is no longer active. Please contact Shafiqul for an updated one.' },
    expired: { cls: 'border-amber-200 bg-amber-50 text-amber-900', text: 'This proposal has expired. Message Shafiqul and he will send an updated one.' },
  }
  const banner = banners[status]
  return banner ? <div className={`rounded-2xl border px-5 py-4 text-sm font-semibold ${banner.cls}`}>{banner.text}</div> : null
}

function AcceptForm({ data, pkg, onAccepted }: { data: ProposalData; pkg: ProposalData['packages'][number]; onAccepted: () => void }) {
  const [form, setForm] = useState({ name: data.clientName, email: data.clientEmail, phone: data.clientPhone, agree: false })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.email.trim() && !form.phone.trim()) return setError('Please add an email or WhatsApp number.')
    if (!form.agree) return setError('Please confirm you agree with the scope and terms.')
    setBusy(true)
    try {
      const res = await fetch(`/api/proposals/${data.token}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageName: pkg.name, name: form.name, email: form.email, phone: form.phone, agree: form.agree }),
      })
      const json = await res.json()
      if (!res.ok || !json.success) throw new Error(json.message || 'Could not accept the proposal.')
      onAccepted()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const input = 'input-field'
  return (
    <form onSubmit={submit} className="no-print rounded-3xl border border-teal-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-lg font-black text-slate-900">Accept this proposal</h2>
      <p className="mt-1 text-sm text-slate-500">
        You’re accepting <b className="text-slate-800">{pkg.name} — {usd(pkg.priceUsd)}</b>. Payment details for the advance appear right after.
      </p>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" aria-label="Your name" className={input} />
        <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" aria-label="Email" className={input} />
        <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="WhatsApp number" aria-label="WhatsApp number" className={input} />
      </div>
      <label className="mt-4 flex items-start gap-3 text-sm text-slate-600">
        <input type="checkbox" checked={form.agree} onChange={(e) => setForm({ ...form, agree: e.target.checked })} className="mt-0.5 h-4 w-4 rounded border-slate-300 text-teal-600" />
        I agree with the scope, payment schedule and terms of this proposal.
      </label>
      {error && <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      <button type="submit" disabled={busy} className="btn-primary mt-5 w-full sm:w-auto">
        <span className="relative z-10 inline-flex items-center gap-2">
          {busy && <Loader2 className="h-4 w-4 animate-spin" />} Accept {pkg.name} — {usd(pkg.priceUsd)}
        </span>
      </button>
    </form>
  )
}

function PaymentSection({ data, advance, reported, onReported }: { data: ProposalData; advance: number; reported: boolean; onReported: () => void }) {
  const methods = data.terms.paymentMethods
  const [form, setForm] = useState({ method: methods[0]?.name || '', reference: '', note: '' })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState('')

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(text)
      setTimeout(() => setCopied(''), 1500)
    } catch {
      // ignore — the details are visible to copy by hand
    }
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      const res = await fetch(`/api/proposals/${data.token}/payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const json = await res.json()
      if (!res.ok || !json.success) throw new Error(json.message || 'Could not send payment details.')
      onReported()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="no-print rounded-3xl border border-teal-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-lg font-black text-slate-900">Pay the advance to start · {usd(advance)}</h2>
      {methods.length ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {methods.map((m) => (
            <div key={m.name} className="flex items-start justify-between gap-3 rounded-2xl border border-slate-200 p-4">
              <div>
                <p className="text-sm font-bold text-slate-900">{m.name}</p>
                <p className="mt-1 whitespace-pre-line text-sm text-slate-600">{m.details}</p>
              </div>
              <button type="button" onClick={() => copy(m.details)} aria-label={`Copy ${m.name} details`} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-teal-700">
                {copied === m.details ? <CheckCircle2 className="h-4 w-4 text-teal-600" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-sm text-slate-600">Shafiqul will send you the payment details on WhatsApp or email shortly.</p>
      )}

      {reported ? (
        <p className="mt-5 rounded-xl bg-sky-50 px-4 py-3 text-sm text-sky-900">Thanks! Your payment details were sent. You’ll get a confirmation soon.</p>
      ) : (
        <form onSubmit={submit} className="mt-6 space-y-4 border-t border-slate-100 pt-5">
          <p className="text-sm font-semibold text-slate-800">After paying, tell us the transaction details:</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {methods.length ? (
              <select value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value })} aria-label="Payment method" className="input-field">
                {methods.map((m) => (
                  <option key={m.name}>{m.name}</option>
                ))}
              </select>
            ) : (
              <input value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value })} placeholder="Payment method" aria-label="Payment method" className="input-field" />
            )}
            <input required value={form.reference} onChange={(e) => setForm({ ...form, reference: e.target.value })} placeholder="Transaction ID / reference" aria-label="Transaction ID" className="input-field" />
          </div>
          <input value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="Note (optional) — e.g. sender number, amount in BDT" aria-label="Note" className="input-field" />
          {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <button type="submit" disabled={busy} className="btn-primary">
            <span className="relative z-10 inline-flex items-center gap-2">{busy && <Loader2 className="h-4 w-4 animate-spin" />} I’ve paid — send details</span>
          </button>
        </form>
      )}
    </section>
  )
}
