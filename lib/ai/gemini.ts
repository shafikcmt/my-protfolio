/**
 * Minimal Google Gemini REST client (free tier via an AI Studio key).
 * Used as the free alternative to Claude for Sadika and outreach.
 *
 * Note: on Gemini's free tier Google may use prompts and responses to improve
 * its products, and rate limits are low — use Claude for heavier, private use.
 */

export const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-flash-latest'
const BASE_URL = process.env.GEMINI_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta'

export interface GeminiPart {
  text?: string
  thought?: boolean
  functionCall?: { name: string; args?: Record<string, any> }
  functionResponse?: { name: string; response: Record<string, any> }
  [key: string]: unknown // e.g. thoughtSignature — must be sent back unchanged
}

export interface GeminiContent {
  role: 'user' | 'model'
  parts: GeminiPart[]
}

export interface GeminiFunctionDeclaration {
  name: string
  description: string
  parameters: Record<string, any>
}

export interface GeminiRequest {
  system: string
  contents: GeminiContent[]
  functions?: GeminiFunctionDeclaration[]
  googleSearch?: boolean
  urlContext?: boolean
  maxOutputTokens?: number
}

export async function geminiGenerate(req: GeminiRequest) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY is not set')

  const tools: Record<string, unknown>[] = []
  if (req.functions?.length) tools.push({ functionDeclarations: req.functions })
  if (req.googleSearch) tools.push({ googleSearch: {} })
  if (req.urlContext) tools.push({ urlContext: {} })

  const res = await fetch(`${BASE_URL}/models/${GEMINI_MODEL}:generateContent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: req.system }] },
      contents: req.contents,
      ...(tools.length ? { tools } : {}),
      generationConfig: { maxOutputTokens: req.maxOutputTokens || 4000 },
    }),
    signal: AbortSignal.timeout(90_000),
  })
  const json: any = await res.json().catch(() => ({}))
  if (!res.ok) {
    const message = json?.error?.message || `Gemini error ${res.status}`
    throw new Error(res.status === 429 ? `Gemini free-tier limit reached, try again later (${message})` : message)
  }

  const candidate = json?.candidates?.[0]
  const content: GeminiContent = candidate?.content?.parts ? { role: 'model', parts: candidate.content.parts } : { role: 'model', parts: [] }
  const text = content.parts
    .filter((p) => typeof p.text === 'string' && !p.thought)
    .map((p) => p.text)
    .join('')
    .trim()
  const functionCalls = content.parts.filter((p) => p.functionCall).map((p) => p.functionCall!)
  const blocked = Boolean(json?.promptFeedback?.blockReason) || candidate?.finishReason === 'SAFETY'
  return { content, text, functionCalls, blocked }
}

/** Pulls the first JSON object out of a model's text answer (it may wrap it in ```json fences or prose). */
export function extractJson<T>(text: string): T | null {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  const candidate = fenced ? fenced[1] : text
  const start = candidate.indexOf('{')
  const end = candidate.lastIndexOf('}')
  if (start === -1 || end <= start) return null
  try {
    return JSON.parse(candidate.slice(start, end + 1)) as T
  } catch {
    return null
  }
}
