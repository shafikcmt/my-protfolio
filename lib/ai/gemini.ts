/**
 * Minimal Google Gemini REST client (free tier via an AI Studio key).
 * Used as the free alternative to Claude for the project assistant and outreach.
 *
 * Note: on Gemini's free tier Google may use prompts and responses to improve
 * its products, and rate limits are low — use Claude for heavier, private use.
 */

/**
 * Models tried in order. Free-tier quota differs per model and project (newer
 * preview models often have none), so on a quota / not-found error the next
 * one is tried and the one that worked is remembered for a while.
 * Set GEMINI_MODEL to put your own choice first.
 */
const MODEL_CHAIN = Array.from(
  new Set([process.env.GEMINI_MODEL, 'gemini-2.5-flash', 'gemini-flash-latest', 'gemini-2.5-flash-lite', 'gemini-flash-lite-latest'].filter(Boolean) as string[])
)
export const GEMINI_MODEL = MODEL_CHAIN[0]

const REMEMBER_MS = 30 * 60 * 1000
let preferred: { model: string; at: number } | null = null

function modelsToTry() {
  if (preferred && Date.now() - preferred.at < REMEMBER_MS) {
    return [preferred.model, ...MODEL_CHAIN.filter((m) => m !== preferred!.model)]
  }
  return MODEL_CHAIN
}

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

  const body = JSON.stringify({
    systemInstruction: { parts: [{ text: req.system }] },
    contents: req.contents,
    ...(tools.length ? { tools } : {}),
    generationConfig: { maxOutputTokens: req.maxOutputTokens || 4000 },
  })

  let json: any = null
  let usedModel = ''
  const failures: string[] = []
  for (const model of modelsToTry()) {
    const res = await fetch(`${BASE_URL}/models/${model}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body,
      signal: AbortSignal.timeout(90_000),
    })
    const data: any = await res.json().catch(() => ({}))
    if (res.ok) {
      json = data
      usedModel = model
      break
    }
    const message = data?.error?.message || `Gemini error ${res.status}`
    // Quota exhausted / model not available for this key → try the next model
    if (res.status === 429 || res.status === 404 || (res.status === 400 && /not (found|supported)/i.test(message))) {
      failures.push(`${model}: ${res.status === 429 ? 'no free quota left' : 'not available'}`)
      continue
    }
    throw new Error(message)
  }
  if (!json) {
    throw new Error(`Gemini free-tier limit reached on every model, try again later (${failures.join('; ')})`)
  }
  preferred = { model: usedModel, at: Date.now() }

  const candidate = json?.candidates?.[0]
  const content: GeminiContent = candidate?.content?.parts ? { role: 'model', parts: candidate.content.parts } : { role: 'model', parts: [] }
  const text = content.parts
    .filter((p) => typeof p.text === 'string' && !p.thought)
    .map((p) => p.text)
    .join('')
    .trim()
  const functionCalls = content.parts.filter((p) => p.functionCall).map((p) => p.functionCall!)
  const blocked = Boolean(json?.promptFeedback?.blockReason) || candidate?.finishReason === 'SAFETY'
  return { content, text, functionCalls, blocked, model: usedModel }
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
