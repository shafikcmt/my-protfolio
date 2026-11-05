import { connectDB } from '@/lib/db'
import { SALES_CONFIG } from '@/lib/salesConfig'
import AiSetting from '@/models/AiSetting'

/**
 * Which AI powers the assistant and outreach.
 * - "anthropic": Claude (paid API credits, best quality) — ANTHROPIC_API_KEY
 * - "gemini": Google Gemini free tier — GEMINI_API_KEY (aistudio.google.com)
 * The choice is made in Admin → Settings → AI & Assistant (auto / Claude / Gemini / off).
 * AI_PROVIDER in the environment still works as an override for the "auto" setting.
 */
export type AiProvider = 'anthropic' | 'gemini'
export type AiChoice = 'auto' | AiProvider | 'off'

export interface AiSettings {
  provider: AiChoice
  assistantName: string
}

const CACHE_MS = 30_000
let cache: { at: number; value: AiSettings } | null = null

export function aiKeys() {
  return { anthropic: Boolean(process.env.ANTHROPIC_API_KEY), gemini: Boolean(process.env.GEMINI_API_KEY) }
}

/** Dashboard settings (cached for 30s; saved settings clear the cache). */
export async function getAiSettings(): Promise<AiSettings> {
  if (cache && Date.now() - cache.at < CACHE_MS) return cache.value
  let value: AiSettings = { provider: 'auto', assistantName: SALES_CONFIG.assistantName }
  try {
    await connectDB()
    const doc: any = await AiSetting.findOne({ key: 'main' }).lean()
    if (doc) value = { provider: doc.provider || 'auto', assistantName: doc.assistantName?.trim() || SALES_CONFIG.assistantName }
  } catch {
    // database unavailable → defaults
  }
  cache = { at: Date.now(), value }
  return value
}

export function clearAiSettingsCache() {
  cache = null
}

/** Resolves a choice to a provider that actually has a key, or null. */
export function resolveProvider(choice: AiChoice): AiProvider | null {
  const keys = aiKeys()
  if (choice === 'off') return null
  if (choice === 'anthropic') return keys.anthropic ? 'anthropic' : keys.gemini ? 'gemini' : null
  if (choice === 'gemini') return keys.gemini ? 'gemini' : keys.anthropic ? 'anthropic' : null
  const forced = process.env.AI_PROVIDER
  if (forced === 'gemini' && keys.gemini) return 'gemini'
  if (forced === 'anthropic' && keys.anthropic) return 'anthropic'
  return keys.anthropic ? 'anthropic' : keys.gemini ? 'gemini' : null
}

export async function activeAiProvider(): Promise<AiProvider | null> {
  return resolveProvider((await getAiSettings()).provider)
}

export async function aiAvailable() {
  return (await activeAiProvider()) !== null
}

/** The other provider to try when the active one fails (no credit, bad key, rate limit). */
export function fallbackProvider(failed: AiProvider): AiProvider | null {
  const keys = aiKeys()
  return failed === 'anthropic' ? (keys.gemini ? 'gemini' : null) : keys.anthropic ? 'anthropic' : null
}

export const AI_SETUP_MESSAGE =
  'AI is off or has no key. Turn it on in Admin → Settings → AI & Assistant, with ANTHROPIC_API_KEY (Claude) or a free GEMINI_API_KEY in Vercel.'
