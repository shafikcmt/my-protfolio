import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { withAdminAuth } from '@/lib/crud'
import { aiKeys, clearAiSettingsCache, getAiSettings, resolveProvider, type AiChoice } from '@/lib/ai/provider'
import { geminiGenerate, GEMINI_MODEL } from '@/lib/ai/gemini'
import { SALES_MODEL } from '@/lib/salesAgent'
import AiSetting from '@/models/AiSetting'

export const dynamic = 'force-dynamic'

const CHOICES: AiChoice[] = ['auto', 'anthropic', 'gemini', 'off']
const unauthorized = () => NextResponse.json({ success: false, message: 'Unauthorized: Admin access required' }, { status: 401 })

async function view() {
  const settings = await getAiSettings()
  return { ...settings, keys: aiKeys(), active: resolveProvider(settings.provider) }
}

export async function GET(request: NextRequest) {
  if (!(await withAdminAuth(request))) return unauthorized()
  return NextResponse.json({ success: true, data: await view() })
}

/** Save { provider, assistantName }. */
export async function PUT(request: NextRequest) {
  if (!(await withAdminAuth(request))) return unauthorized()
  const body = await request.json().catch(() => ({}))
  const provider = CHOICES.includes(body.provider) ? body.provider : 'auto'
  const assistantName = String(body.assistantName || '').replace(/[^\p{L}\p{N} .'-]/gu, '').trim().slice(0, 30)
  try {
    await connectDB()
    await AiSetting.findOneAndUpdate({ key: 'main' }, { $set: { provider, assistantName } }, { upsert: true })
    clearAiSettingsCache()
    return NextResponse.json({ success: true, message: 'Saved', data: await view() })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || 'Could not save' }, { status: 500 })
  }
}

/** Test a key with a tiny request: { provider: 'anthropic' | 'gemini' }. */
export async function POST(request: NextRequest) {
  if (!(await withAdminAuth(request))) return unauthorized()
  const { provider } = await request.json().catch(() => ({}))
  try {
    if (provider === 'anthropic') {
      if (!process.env.ANTHROPIC_API_KEY) return NextResponse.json({ success: false, message: 'ANTHROPIC_API_KEY is not set in Vercel.' })
      const res = await new Anthropic().messages.create({
        model: SALES_MODEL,
        max_tokens: 64,
        output_config: { effort: 'low' },
        messages: [{ role: 'user', content: 'Reply with just: OK' }],
      })
      const text = res.content.find((b) => b.type === 'text')
      return NextResponse.json({ success: true, message: `Claude works ✅ (${SALES_MODEL}) — replied “${text && 'text' in text ? text.text.trim().slice(0, 20) : 'OK'}”` })
    }
    if (provider === 'gemini') {
      if (!process.env.GEMINI_API_KEY) return NextResponse.json({ success: false, message: 'GEMINI_API_KEY is not set in Vercel.' })
      const res = await geminiGenerate({ system: 'Answer briefly.', contents: [{ role: 'user', parts: [{ text: 'Reply with just: OK' }] }], maxOutputTokens: 64 })
      return NextResponse.json({ success: true, message: `Gemini works ✅ (${GEMINI_MODEL}) — replied “${res.text.slice(0, 20) || 'OK'}”` })
    }
    return NextResponse.json({ success: false, message: 'Unknown provider' }, { status: 400 })
  } catch (error: any) {
    const message = String(error?.message || error)
    const hint = /credit balance/i.test(message)
      ? 'No credit left — add funds in the Claude Console (Billing).'
      : /api[ _-]?key|authentication|401|permission/i.test(message)
        ? 'The key is wrong or was deleted — create a new one and update Vercel.'
        : message
    return NextResponse.json({ success: false, message: `${provider === 'anthropic' ? 'Claude' : 'Gemini'} failed: ${hint}` })
  }
}
