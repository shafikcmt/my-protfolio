'use client'

import { useState } from 'react'
import axios from 'axios'
import { Loader2, Send } from 'lucide-react'

/** One-click connection of the Telegram bot's buttons (approve / call / reject) to this site. */
export default function TelegramSetupCard() {
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null)

  const connect = async () => {
    setBusy(true)
    setResult(null)
    try {
      const { data } = await axios.post('/api/admin/telegram-setup')
      setResult({ ok: true, message: data.message })
    } catch (err: any) {
      setResult({ ok: false, message: err?.response?.data?.message || 'Setup failed.' })
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="mx-auto mb-6 max-w-6xl rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">AI sales assistant · Telegram buttons</h2>
          <p className="mt-1 text-sm text-slate-500">
            Run once after adding the Telegram variables in Vercel, so Approve / Call / Not a fit buttons and your replies reach the site.
          </p>
        </div>
        <button
          type="button"
          onClick={connect}
          disabled={busy}
          className="inline-flex flex-shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-teal-600 disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Connect Telegram
        </button>
      </div>
      {result && (
        <p className={`mt-3 rounded-xl px-3 py-2 text-sm ${result.ok ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-700'}`}>{result.message}</p>
      )}
    </section>
  )
}
