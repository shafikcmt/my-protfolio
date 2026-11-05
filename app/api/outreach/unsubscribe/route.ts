import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { escapeHtml, sendTelegram } from '@/lib/telegram'
import Prospect from '@/models/Prospect'

export const dynamic = 'force-dynamic'

/** Stops all outreach to the recipient. GET from the email link; POST for one-click unsubscribe (RFC 8058). */
async function unsubscribe(request: NextRequest) {
  const token = new URL(request.url).searchParams.get('t') || ''
  let company = ''
  if (token) {
    try {
      await connectDB()
      const prospect = await Prospect.findOne({ unsubscribeToken: token })
      if (prospect && prospect.status !== 'unsubscribed') {
        prospect.status = 'unsubscribed'
        prospect.nextSendAt = undefined
        await prospect.save()
        company = prospect.company
        await sendTelegram(`🚫 ${escapeHtml(prospect.company)} unsubscribed from outreach.`)
      }
    } catch (error) {
      console.error('Unsubscribe error:', error)
    }
  }
  return company
}

export async function GET(request: NextRequest) {
  await unsubscribe(request)
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Unsubscribed</title></head>
<body style="font-family:Arial,Helvetica,sans-serif;background:#f8fafc;margin:0;display:flex;min-height:100vh;align-items:center;justify-content:center">
<div style="background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:32px;max-width:420px;text-align:center">
<h1 style="font-size:20px;margin:0 0 8px">You're unsubscribed</h1>
<p style="color:#475569;margin:0">You won't receive any more emails from Md Shafiqul Islam. Sorry for the interruption.</p>
</div></body></html>`
  return new NextResponse(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })
}

export async function POST(request: NextRequest) {
  await unsubscribe(request)
  return NextResponse.json({ ok: true })
}

