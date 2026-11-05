/**
 * Which AI powers Sadika and outreach.
 * - "anthropic": Claude (paid API credits, best quality) — used when ANTHROPIC_API_KEY is set.
 * - "gemini": Google Gemini free tier (GEMINI_API_KEY from aistudio.google.com) — used otherwise.
 * Set AI_PROVIDER=anthropic|gemini to force one when both keys exist.
 */
export type AiProvider = 'anthropic' | 'gemini'

export function activeAiProvider(): AiProvider | null {
  const forced = process.env.AI_PROVIDER
  const hasClaude = Boolean(process.env.ANTHROPIC_API_KEY)
  const hasGemini = Boolean(process.env.GEMINI_API_KEY)
  if (forced === 'gemini' && hasGemini) return 'gemini'
  if (forced === 'anthropic' && hasClaude) return 'anthropic'
  if (hasClaude) return 'anthropic'
  if (hasGemini) return 'gemini'
  return null
}

export function aiAvailable() {
  return activeAiProvider() !== null
}

export const AI_SETUP_MESSAGE =
  'No AI key yet. Add ANTHROPIC_API_KEY (Claude) or a free GEMINI_API_KEY (aistudio.google.com) in Vercel, then redeploy.'
