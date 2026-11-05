import crypto from 'crypto'
import mongoose from 'mongoose'
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { runSalesAgent, salesAssistantEnabled, type LeadDoc } from '@/lib/salesAgent'
import { escapeHtml, sendTelegram } from '@/lib/telegram'
import Lead from '@/models/Lead'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const COOKIE = 'sales_chat_sid'
const MAX_MESSAGE_CHARS = 1500
const MAX_MESSAGES_PER_CONVERSATION = 40
const MAX_NEW_CONVERSATIONS_PER_IP_PER_DAY = 5
// Hard daily cap on AI replies across the whole site, to keep API spend predictable
const DAILY_REPLY_LIMIT = Number(process.env.CHAT_DAILY_REPLY_LIMIT || 150)

const ChatUsage =
  mongoose.models.ChatUsage ||
  mongoose.model('ChatUsage', new mongoose.Schema({ day: { type: String, unique: true }, replies: { type: Number, default: 0 } }))

function today() {
  return new Date().toISOString().slice(0, 10)
}

function publicView(lead: any) {
  return {
    status: lead.status,
    messages: (lead.transcript || [])
      .filter((m: any) => m.role !== 'note')
      .map((m: any) => ({ role: m.role, text: m.text, at: m.at })),
  }
}

/** Whether the assistant is on, plus the visitor's conversation (for restoring and polling). */
export async function GET(request: NextRequest) {
  if (!salesAssistantEnabled()) return NextResponse.json({ success: true, enabled: false })
  const sid = request.cookies.get(COOKIE)?.value
  if (!sid) return NextResponse.json({ success: true, enabled: true, status: 'new', messages: [] })
  try {
    await connectDB()
    const lead = await Lead.findOne({ sessionId: sid }).select('status transcript').lean()
    return NextResponse.json({ success: true, enabled: true, ...(lead ? publicView(lead) : { status: 'new', messages: [] }) })
  } catch {
    return NextResponse.json({ success: true, enabled: true, status: 'new', messages: [] })
  }
}

/** Visitor sends a message; the assistant replies. */
export async function POST(request: NextRequest) {
  if (!salesAssistantEnabled()) {
    return NextResponse.json({ success: false, message: 'Chat is not available right now.' }, { status: 503 })
  }

  const body = await request.json().catch(() => ({}))
  const text = String(body.message || '').trim().slice(0, MAX_MESSAGE_CHARS)
  if (!text) return NextResponse.json({ success: false, message: 'Message is empty.' }, { status: 400 })

  try {
    await connectDB()
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown'
    let sid = request.cookies.get(COOKIE)?.value
    let lead: any = sid ? await Lead.findOne({ sessionId: sid }) : null
    const isNew = !lead

    if (isNew) {
      const dayStart = new Date(`${today()}T00:00:00.000Z`)
      const recent = await Lead.countDocuments({ ip, createdAt: { $gte: dayStart } })
      if (recent >= MAX_NEW_CONVERSATIONS_PER_IP_PER_DAY) {
        return NextResponse.json({ success: false, message: 'Too many new chats today. Please use the contact form or WhatsApp.' }, { status: 429 })
      }
      sid = crypto.randomBytes(18).toString('hex')
      lead = new Lead({ sessionId: sid, ip, transcript: [], apiMessages: [] })
    }

    if (lead.clientMessageCount >= MAX_MESSAGES_PER_CONVERSATION) {
      return NextResponse.json(
        { success: false, message: 'This chat has reached its limit. Shafiqul will continue with you directly — please use the contact form or WhatsApp.' },
        { status: 429 }
      )
    }

    const usage = await ChatUsage.findOneAndUpdate({ day: today() }, { $inc: { replies: 1 } }, { upsert: true, new: true })
    if (usage.replies > DAILY_REPLY_LIMIT) {
      return NextResponse.json(
        { success: false, message: 'The assistant is busy right now. Please leave your details on the contact page and Shafiqul will reply personally.' },
        { status: 503 }
      )
    }

    lead.transcript.push({ role: 'user', text, at: new Date() })
    lead.clientMessageCount += 1

    let reply: string
    try {
      reply = await runSalesAgent(lead as LeadDoc, { client: text })
    } catch (error: any) {
      console.error('Sales agent error:', error?.status, error?.message)
      reply = 'Sorry, I had a problem answering just now. Please try again in a moment, or message Shafiqul on WhatsApp.'
    }

    lead.transcript.push({ role: 'assistant', text: reply, at: new Date() })
    await lead.save()

    if (isNew) {
      await sendTelegram(`💬 <b>New AI chat started</b>\n“${escapeHtml(text.slice(0, 200))}”`)
    }

    const response = NextResponse.json({ success: true, reply, ...publicView(lead) })
    if (isNew && sid) {
      response.cookies.set(COOKIE, sid, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 60 * 60 * 24 * 30, path: '/' })
    }
    return response
  } catch (error) {
    console.error('Chat route error:', error)
    return NextResponse.json({ success: false, message: 'Chat is temporarily unavailable.' }, { status: 500 })
  }
}
