import Anthropic from '@anthropic-ai/sdk'
import Project from '@/models/Project'
import { CAREER_PROFILE } from '@/lib/careerProfile'
import { PROJECT_LIST, SITE_URL } from '@/lib/constants'
import { OUTREACH_CONFIG } from '@/lib/outreachConfig'
import { activeAiProvider, fallbackProvider } from '@/lib/ai/provider'
import { extractJson, geminiGenerate } from '@/lib/ai/gemini'

/**
 * AI side of client prospecting: finds businesses on the web, researches a
 * company's website and drafts short personal emails that I approve before
 * anything is sent (lib/outreach.ts does the sending).
 */

type BetaMessageParam = Anthropic.Beta.BetaMessageParam
type BetaToolUnion = Anthropic.Beta.BetaToolUnion

const MODEL = 'claude-opus-5-5'
export const LINK_PLACEHOLDER = '{{PORTFOLIO_LINK}}'

let client: Anthropic | null = null
function anthropic() {
  if (!client) client = new Anthropic()
  return client
}

const nullableString = { anyOf: [{ type: 'string' }, { type: 'null' }] }

/**
 * Runs the model with server tools (web search/fetch) plus one client tool,
 * and returns the input of the first call to that client tool.
 */
interface StructuredRequest {
  system: string
  prompt: string
  tool: Anthropic.Beta.BetaTool
  search?: number
  fetch?: number
  effort?: 'low' | 'medium' | 'high'
}

/** Runs the request on the configured AI and returns the structured result. */
async function runWithTool<T>(opts: StructuredRequest): Promise<T | null> {
  const provider = await activeAiProvider()
  if (!provider) throw new Error('AI is turned off or has no key')
  const run = (p: 'anthropic' | 'gemini') => (p === 'gemini' ? runWithGemini<T>(opts) : runWithClaude<T>(opts))
  try {
    return await run(provider)
  } catch (error: any) {
    const backup = fallbackProvider(provider)
    if (!backup) throw error
    console.error(`Outreach AI: ${provider} failed (${error?.message}); using ${backup}`)
    return run(backup)
  }
}

/**
 * Gemini (free tier): Google Search grounding / URL context for research,
 * and the result as JSON in the answer text (matching the tool's schema).
 */
async function runWithGemini<T>(opts: StructuredRequest): Promise<T | null> {
  const prompt =
    opts.prompt.replace(/(then )?call (the )?save_\w+( tool)?( now)?( with[^.]*)?\.?/gi, '').trim() +
    `\n\nReply with ONLY one JSON object (no other text) matching this JSON Schema:\n${JSON.stringify(opts.tool.input_schema)}`
  for (let attempt = 0; attempt < 2; attempt++) {
    const res = await geminiGenerate({
      system: opts.system.replace(/web_fetch/g, 'reading the page').replace(/web_search/g, 'Google Search'),
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      googleSearch: Boolean(opts.search),
      urlContext: Boolean(opts.fetch),
      maxOutputTokens: 8000,
    })
    if (res.blocked) return null
    const json = extractJson<T>(res.text)
    if (json) return json
  }
  return null
}

async function runWithClaude<T>(opts: StructuredRequest): Promise<T | null> {
  const tools: BetaToolUnion[] = [{ ...opts.tool, strict: true }]
  if (opts.search) tools.push({ type: 'web_search_20260209', name: 'web_search', max_uses: opts.search })
  if (opts.fetch) tools.push({ type: 'web_fetch_20260209', name: 'web_fetch', max_uses: opts.fetch })

  const messages: BetaMessageParam[] = [{ role: 'user', content: opts.prompt }]
  for (let round = 0; round < 8; round++) {
    const response = await anthropic().beta.messages.create({
      model: MODEL,
      max_tokens: 8000,
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      output_config: { effort: opts.effort || 'medium' },
      system: opts.system,
      tools,
      messages,
    })

    const call = response.content.find((b): b is Anthropic.Beta.BetaToolUseBlock => b.type === 'tool_use' && b.name === opts.tool.name)
    if (call) return call.input as T
    if (response.stop_reason === 'refusal') return null

    messages.push({ role: 'assistant', content: response.content as Anthropic.Beta.BetaContentBlockParam[] })
    if (response.stop_reason === 'pause_turn') continue // long server-tool turn: let it continue
    // Finished without calling the tool: ask once more, explicitly
    messages.push({ role: 'user', content: `Please call the ${opts.tool.name} tool now with your result.` })
  }
  return null
}

async function portfolioHighlights() {
  let projects: any[] = []
  try {
    projects = await Project.find({ status: 'published' }).select('title slug category shortDescription').limit(12).lean()
  } catch {
    // fall back below
  }
  if (!projects.length) projects = PROJECT_LIST as any[]
  return projects
    .map((p) => `- ${p.title}${p.category ? ` (${p.category})` : ''}: ${p.shortDescription || ''}${p.slug ? ` — ${SITE_URL}/projects/${p.slug}` : ''}`)
    .join('\n')
}

const ABOUT_ME = () => `About Shafiqul (the sender):
- ${CAREER_PROFILE.name}, ${CAREER_PROFILE.role}, ${CAREER_PROFILE.location}
- Builds any kind of software or web project with modern AI-assisted development: websites, web apps, SaaS, ERP, ecommerce, mobile apps, APIs/integrations, automation, bots and AI features, bug fixes and maintenance.
- Industry depth: ${CAREER_PROFILE.domain}
- Portfolio: ${SITE_URL}`

// ─── Discovery ───────────────────────────────────────────────────────────────

export interface DiscoveredCompany {
  company: string
  website: string
  email: string | null
  country: string | null
  industry: string | null
  why: string
}

export async function discoverCompanies(target: string, count: number, exclude: string[]) {
  const n = Math.max(1, Math.min(count, OUTREACH_CONFIG.maxDiscoverPerRun))
  const result = await runWithTool<{ companies: DiscoveredCompany[] }>({
    system: `You research potential B2B clients for a freelance software developer.
${ABOUT_ME()}

Rules:
- Only real, currently operating businesses or organisations with their own website. No individuals, no job posts, no directories/marketplaces as the company itself.
- Prefer small and medium businesses that plausibly need custom software, a better website, automation or integrations.
- Email: only a business contact address published on the company's own website (prefer generic ones like info@, contact@, sales@, hello@). Never guess or construct an address; use null if none is published. Skip personal addresses of private individuals.
- Skip businesses whose site asks not to be contacted for sales/marketing.
- Verify with web_fetch on the company's site when you can. Do not invent anything.`,
    prompt: `Find up to ${n} businesses matching this target: "${target}".
Do not include these (already in my list): ${exclude.slice(0, 200).join(', ') || 'none'}.
For each, give a one-sentence reason why they may need software help. Then call save_companies.`,
    tool: {
      name: 'save_companies',
      description: 'Save the companies you found.',
      input_schema: {
        type: 'object',
        properties: {
          companies: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                company: { type: 'string' },
                website: { type: 'string', description: 'Homepage URL' },
                email: { ...nullableString, description: 'Published business contact email, or null' },
                country: nullableString,
                industry: nullableString,
                why: { type: 'string' },
              },
              required: ['company', 'website', 'email', 'country', 'industry', 'why'],
              additionalProperties: false,
            },
          },
        },
        required: ['companies'],
        additionalProperties: false,
      },
    },
    search: 8,
    fetch: 15,
  })
  return (result?.companies || []).slice(0, n)
}

// ─── Research + first email ──────────────────────────────────────────────────

export interface EmailDraft {
  summary: string
  likely_needs: string[]
  fit: 'good' | 'maybe' | 'poor'
  contact_name: string | null
  better_email: string | null
  subject: string
  body: string
}

const EMAIL_RULES = `Email rules:
- Written by Shafiqul in the first person, plain text, 80–130 words, no markdown, no emojis.
- Open with one specific, true observation about their business or website (from your research). No flattery, no fake familiarity, no "I hope this finds you well".
- Offer one concrete, relevant way he could help, and mention one relevant past project only if it truly fits.
- Include the portfolio link exactly once, written as ${LINK_PLACEHOLDER} (it is replaced with a tracking link).
- End with a low-pressure question, e.g. a short call or a reply. One call to action only.
- Never invent clients, numbers, results or prices. No discounts, no spam words ("guaranteed", "free money", "act now").
- Subject: 3–7 words, specific, not clickbait.
- Sign off with just "Shafiqul" — the signature and unsubscribe line are added automatically.
- Write in English unless the company clearly communicates in Bangla.`

export async function researchAndDraft(prospect: { company: string; website?: string; email?: string; industry?: string; country?: string; sourceNote?: string }) {
  return runWithTool<EmailDraft>({
    system: `You help a freelance software developer write a first outreach email to a company.
${ABOUT_ME()}

Relevant projects (only mention one if it fits):
${await portfolioHighlights()}

${EMAIL_RULES}

fit: "good" if they very likely need software help, "maybe" if unclear, "poor" if they clearly don't (e.g. already have a large in-house tech team or the site is a simple personal page). Still draft the email for "poor".`,
    prompt: `Company: ${prospect.company}
Website: ${prospect.website || 'unknown'}
Known email: ${prospect.email || 'none'}
Industry: ${prospect.industry || 'unknown'} · Country: ${prospect.country || 'unknown'}
Note: ${prospect.sourceNote || '-'}

Read their website (web_fetch) to understand what they do and where software could help, then call save_email_draft.
If the site shows a business contact email and none is known, put it in better_email; if a named decision maker is listed, put their name in contact_name.`,
    tool: {
      name: 'save_email_draft',
      description: 'Save the research summary and the email draft.',
      input_schema: {
        type: 'object',
        properties: {
          summary: { type: 'string', description: 'What the company does and where software could help (2–3 sentences).' },
          likely_needs: { type: 'array', items: { type: 'string' } },
          fit: { type: 'string', enum: ['good', 'maybe', 'poor'] },
          contact_name: nullableString,
          better_email: nullableString,
          subject: { type: 'string' },
          body: { type: 'string' },
        },
        required: ['summary', 'likely_needs', 'fit', 'contact_name', 'better_email', 'subject', 'body'],
        additionalProperties: false,
      },
    },
    fetch: 3,
    search: 1,
  })
}

// ─── Follow-ups and revisions ────────────────────────────────────────────────

const SIMPLE_EMAIL_TOOL: Anthropic.Beta.BetaTool = {
  name: 'save_email',
  description: 'Save the email.',
  input_schema: {
    type: 'object',
    properties: { subject: { type: 'string' }, body: { type: 'string' } },
    required: ['subject', 'body'],
    additionalProperties: false,
  },
}

export async function draftFollowUp(prospect: { company: string; summary?: string }, previous: { subject: string; body: string }[], number: 1 | 2) {
  return runWithTool<{ subject: string; body: string }>({
    system: `You write a short follow-up to an outreach email from freelance developer Shafiqul that got no reply.
${number === 1 ? 'Follow-up 1: 40–70 words, add one new, useful idea for their business, keep it friendly.' : 'Follow-up 2 (last one): 30–50 words, polite close — say this is the last message and he is available if things change.'}
Plain text, first person, no markdown, no guilt-tripping, no fake urgency. Include ${LINK_PLACEHOLDER} at most once. Sign off "Shafiqul". Subject: "Re: " + the original subject.`,
    prompt: `Company: ${prospect.company}\nResearch: ${prospect.summary || '-'}\n\nEarlier emails:\n${previous.map((e) => `Subject: ${e.subject}\n${e.body}`).join('\n---\n')}\n\nCall save_email.`,
    tool: SIMPLE_EMAIL_TOOL,
    effort: 'low',
  })
}

export async function reviseDraft(draft: { subject: string; body: string }, instructions: string) {
  return runWithTool<{ subject: string; body: string }>({
    system: `You edit an outreach email from freelance developer Shafiqul according to his instructions. Keep everything else unchanged unless needed. Plain text, keep ${LINK_PLACEHOLDER} if present, sign off "Shafiqul".\n\n${EMAIL_RULES}`,
    prompt: `Current email:\nSubject: ${draft.subject}\n${draft.body}\n\nShafiqul's instructions: ${instructions}\n\nCall save_email with the revised email.`,
    tool: SIMPLE_EMAIL_TOOL,
    effort: 'low',
  })
}
