'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { CheckCircle2, Loader2, Sparkles, XCircle } from 'lucide-react'

type Choice = 'auto' | 'anthropic' | 'gemini' | 'off'

interface AiView {
  provider: Choice
  assistantName: string
  keys: { anthropic: boolean; gemini: boolean }
  active: 'anthropic' | 'gemini' | null
}

const OPTIONS: { value: Choice; title: string; text: string }[] = [
  { value: 'auto', title: 'Auto', text: 'Claude when its key exists, otherwise Gemini' },
  { value: 'anthropic', title: 'Claude', text: 'Best quality · paid credits' },
  { value: 'gemini', title: 'Gemini (free)', text: 'Free tier · daily limits' },
  { value: 'off', title: 'Off', text: 'Hide the chat, stop AI drafts' },
]

const NAME_IDEAS = ['Mira', 'Ayra', 'Nora', 'Zara', 'Lina', 'Aria']

const ACTIVE_LABEL = { anthropic: 'Claude', gemini: 'Gemini (free)' }

/** Admin → Settings: choose which AI runs the assistant and outreach, and the assistant's name. */
export default function AiSettingsCard() {
  const [data, setData] = useState<AiView | null>(null)
  const [provider, setProvider] = useState<Choice>('auto')
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState('')
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null)

  useEffect(() => {
    axios
      .get('/api/admin/ai-settings')
      .then(({ data }) => {
        setData(data.data)
        setProvider(data.data.provider)
        setName(data.data.assistantName)
      })
      .catch(() => setResult({ ok: false, message: 'Could not load AI settings.' }))
  }, [])

  const save = async () => {
    setSaving(true)
    setResult(null)
    try {
      const { data } = await axios.put('/api/admin/ai-settings', { provider, assistantName: name })
      setData(data.data)
      setResult({ ok: true, message: data.data.active ? `Saved — now using ${ACTIVE_LABEL[data.data.active as 'anthropic' | 'gemini']}.` : 'Saved — AI is off (or no key is set).' })
    } catch (err: any) {
      setResult({ ok: false, message: err?.response?.data?.message || 'Could not save.' })
    } finally {
      setSaving(false)
    }
  }

  const test = async (which: 'anthropic' | 'gemini') => {
    setTesting(which)
    setResult(null)
    try {
      const { data } = await axios.post('/api/admin/ai-settings', { provider: which })
      setResult({ ok: data.success, message: data.message })
    } catch (err: any) {
      setResult({ ok: false, message: err?.response?.data?.message || 'Test failed.' })
    } finally {
      setTesting('')
    }
  }

  return (
    <section className="mx-auto mb-6 max-w-6xl rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
          <Sparkles className="h-4 w-4 text-teal-600" /> AI &amp; Assistant
        </h2>
        {data && (
          <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${data.active ? 'bg-teal-50 text-teal-800' : 'bg-amber-50 text-amber-800'}`}>
            {data.active ? `Now using: ${ACTIVE_LABEL[data.active]}` : 'AI is off'}
          </span>
        )}
      </div>
      <p className="mt-1 text-sm text-slate-500">Which AI runs the website chat assistant and client outreach. If the chosen one fails (e.g. no credit), the other key is used automatically.</p>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {OPTIONS.map((o) => {
          const missing = (o.value === 'anthropic' && data && !data.keys.anthropic) || (o.value === 'gemini' && data && !data.keys.gemini)
          return (
            <label
              key={o.value}
              className={`cursor-pointer rounded-xl border p-3 transition ${provider === o.value ? 'border-teal-500 bg-teal-50/60 ring-2 ring-teal-500/15' : 'border-slate-200 hover:border-teal-300'}`}
            >
              <input type="radio" name="ai-provider" value={o.value} checked={provider === o.value} onChange={() => setProvider(o.value)} className="sr-only" />
              <span className="block text-sm font-bold text-slate-900">{o.title}</span>
              <span className="mt-0.5 block text-xs text-slate-500">{o.text}</span>
              {missing && <span className="mt-1 block text-[11px] font-semibold text-amber-700">Key not added in Vercel</span>}
            </label>
          )
        })}
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="assistant-name" className="mb-1.5 block text-sm font-semibold text-slate-800">Assistant name</label>
          <input id="assistant-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={30} className="input-field" placeholder="Mira" />
          <div className="mt-2 flex flex-wrap gap-1.5">
            {NAME_IDEAS.map((idea) => (
              <button key={idea} type="button" onClick={() => setName(idea)} className="rounded-full border border-slate-200 px-2.5 py-0.5 text-xs text-slate-600 hover:border-teal-300 hover:text-teal-700">
                {idea}
              </button>
            ))}
          </div>
          <p className="mt-1.5 text-xs text-slate-500">Shown in the chat. If a client sincerely asks, the assistant says honestly that it is an AI.</p>
        </div>
        <div>
          <p className="mb-1.5 text-sm font-semibold text-slate-800">Keys in Vercel</p>
          {data &&
            (['anthropic', 'gemini'] as const).map((k) => (
              <div key={k} className="mb-2 flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-3 py-2">
                <span className="flex items-center gap-2 text-sm text-slate-700">
                  {data.keys[k] ? <CheckCircle2 className="h-4 w-4 text-teal-600" /> : <XCircle className="h-4 w-4 text-slate-300" />}
                  {k === 'anthropic' ? 'ANTHROPIC_API_KEY' : 'GEMINI_API_KEY'}
                </span>
                <button
                  type="button"
                  onClick={() => test(k)}
                  disabled={!data.keys[k] || testing !== ''}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:border-teal-300 disabled:opacity-40"
                >
                  {testing === k && <Loader2 className="h-3 w-3 animate-spin" />} Test
                </button>
              </div>
            ))}
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button type="button" onClick={save} disabled={saving || !data} className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-teal-600 disabled:opacity-60">
          {saving && <Loader2 className="h-4 w-4 animate-spin" />} Save
        </button>
        {result && <p className={`rounded-xl px-3 py-2 text-sm ${result.ok ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-700'}`}>{result.message}</p>}
      </div>
    </section>
  )
}
