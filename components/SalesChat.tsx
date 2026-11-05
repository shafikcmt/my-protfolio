'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Loader2, Send, Sparkles, X } from 'lucide-react'

interface ChatMessage {
  role: 'user' | 'assistant'
  text: string
}

const GREETING: ChatMessage = {
  role: 'assistant',
  text: "Hi! 👋 I'm Sadika, Shafiqul's project assistant. Tell me about your project and I'll help you plan it and prepare a proposal — Shafiqul personally reviews every proposal. বাংলায়ও লিখতে পারেন।",
}

const QUICK_STARTS = ['I need a website', 'Web app, SaaS or ERP', 'Mobile app', 'Automation or AI chatbot', 'Fix or improve my existing software', 'How much will my project cost?']

// While a proposal is with Shafiqul, check for his answer every few seconds
const POLL_MS = 8000

/** Renders links in assistant replies as clickable anchors (text only, no HTML injection). */
function Linkified({ text }: { text: string }) {
  const parts = text.split(/(https?:\/\/[^\s)]+)/g)
  return (
    <>
      {parts.map((part, i) =>
        /^https?:\/\//.test(part) ? (
          <a key={i} href={part} target="_blank" rel="noreferrer" className="break-all font-semibold underline underline-offset-2">
            {part.replace(/^https?:\/\/(www\.)?/, '')}
          </a>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  )
}

export default function SalesChat() {
  const [enabled, setEnabled] = useState(false)
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [status, setStatus] = useState('new')
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const listRef = useRef<HTMLDivElement>(null)

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/chat', { cache: 'no-store' })
      const data = await res.json()
      setEnabled(Boolean(data.enabled))
      if (Array.isArray(data.messages)) setMessages(data.messages)
      if (data.status) setStatus(data.status)
    } catch {
      // chat stays hidden if the API is unreachable
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    if (!open || status !== 'needs_review') return
    const timer = setInterval(load, POLL_MS)
    return () => clearInterval(timer)
  }, [open, status, load])

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, open, sending])

  const send = async (text: string) => {
    const message = text.trim()
    if (!message || sending) return
    setError('')
    setInput('')
    setSending(true)
    setMessages((list) => [...list, { role: 'user', text: message }])
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        setError(data.message || 'Something went wrong. Please try again.')
        setMessages((list) => list.slice(0, -1))
        setInput(message)
        return
      }
      setMessages(data.messages)
      setStatus(data.status)
    } catch {
      setError('Network problem. Please try again.')
      setMessages((list) => list.slice(0, -1))
      setInput(message)
    } finally {
      setSending(false)
    }
  }

  if (!enabled) return null

  const shown = messages.length ? messages : [GREETING]

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="no-print fixed bottom-24 right-6 z-50 flex items-center gap-2 rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-xl shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-slate-800"
          aria-label="Chat with Sadika, Shafiqul's project assistant"
        >
          <Sparkles className="h-4 w-4 text-teal-300" />
          <span className="hidden sm:inline">Get a project estimate</span>
          <span className="sm:hidden">Chat</span>
        </button>
      )}

      {open && (
        <div
          role="dialog"
          aria-label="Project assistant chat"
          className="no-print fixed inset-x-3 bottom-3 z-[60] flex h-[min(620px,calc(100dvh-24px))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-[380px]"
        >
          <header className="flex items-center gap-3 bg-slate-900 px-4 py-3 text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-500/20 text-sm font-black text-teal-300">S</span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold">Sadika · Project Assistant</p>
              <p className="truncate text-[11px] text-slate-300">Usually replies instantly · Shafiqul reviews every proposal</p>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close chat" className="rounded-lg p-1.5 text-slate-300 hover:bg-white/10 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </header>

          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto bg-slate-50 px-4 py-4" aria-live="polite">
            {shown.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-6 ${
                    m.role === 'user' ? 'rounded-br-md bg-teal-700 text-white' : 'rounded-bl-md border border-slate-200 bg-white text-slate-800'
                  }`}
                >
                  {m.role === 'assistant' ? <Linkified text={m.text} /> : m.text}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-500">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Thinking…
                </div>
              </div>
            )}
            {status === 'needs_review' && !sending && (
              <p className="text-center text-[11px] text-slate-500">⏳ Shafiqul is reviewing your proposal — his answer will appear here.</p>
            )}
            {!messages.length && !sending && (
              <div className="flex flex-wrap gap-2 pt-1">
                {QUICK_STARTS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => send(q)}
                    className="rounded-full border border-teal-200 bg-white px-3 py-1.5 text-xs font-semibold text-teal-700 hover:bg-teal-50"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          {error && <p className="border-t border-red-100 bg-red-50 px-4 py-2 text-xs text-red-700">{error}</p>}

          <form
            onSubmit={(e) => {
              e.preventDefault()
              send(input)
            }}
            className="flex items-end gap-2 border-t border-slate-200 bg-white p-3"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  send(input)
                }
              }}
              rows={1}
              maxLength={1500}
              placeholder="Type your message…"
              aria-label="Your message"
              className="max-h-28 min-h-[42px] flex-1 resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal-400"
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              aria-label="Send"
              className="flex h-[42px] w-[42px] flex-shrink-0 items-center justify-center rounded-xl bg-teal-700 text-white transition hover:bg-teal-600 disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  )
}
