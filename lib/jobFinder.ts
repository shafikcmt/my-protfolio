/**
 * Remote job finder: pulls jobs from free public job APIs / RSS feeds, scores
 * them against my skills and stores matches in MongoDB. Only official public
 * APIs/feeds are used (no scraping of LinkedIn / Upwork etc.).
 *
 * Edit SKILLS / BLOCKERS below to tune what gets matched.
 */
import Job from '@/models/Job'

export interface RawJob {
  source: string
  externalId: string
  title: string
  company?: string
  url: string
  location?: string
  salary?: string
  tags: string[]
  description: string
  publishedAt?: Date
}

// Skill → [weight, aliases]. Matched against title (counts double) + tags + description.
export const SKILLS: Record<string, [number, string[]]> = {
  Laravel: [4, ['laravel']],
  PHP: [2, ['php']],
  'Next.js': [4, ['next.js', 'nextjs']],
  React: [2, ['react', 'react.js', 'reactjs']],
  'Node.js': [2, ['node.js', 'nodejs', 'node']],
  Express: [1, ['express', 'express.js']],
  MERN: [3, ['mern']],
  MongoDB: [1, ['mongodb', 'mongo']],
  MySQL: [1, ['mysql']],
  TypeScript: [1, ['typescript']],
  JavaScript: [1, ['javascript']],
  Tailwind: [1, ['tailwind', 'tailwindcss']],
  'Full Stack': [3, ['full stack', 'full-stack', 'fullstack']],
  ERP: [4, ['erp']],
  Garments: [5, ['garment', 'garments', 'apparel', 'fashion manufacturing']],
  Textile: [4, ['textile', 'textiles']],
  Merchandising: [3, ['merchandising', 'merchandiser']],
  'Supply Chain': [2, ['supply chain']],
}

// Phrases that mean I probably can't apply (location-locked / clearance).
const BLOCKERS = ['us only', 'usa only', 'us citizens', 'u.s. citizens', 'security clearance', 'eu only', 'uk only', 'canada only']

// Locations that are open to someone in Bangladesh.
const OPEN_LOCATIONS = ['worldwide', 'anywhere', 'global', 'asia', 'bangladesh', 'apac', 'remote']

/** Minimum score for a job to be stored. */
export const MIN_SCORE = 5
/** Minimum score for a Telegram alert. */
export const ALERT_SCORE = 9

const FETCH_TIMEOUT_MS = 12000
const UA = 'Mozilla/5.0 (compatible; ShafiqulPortfolioJobFinder/1.0; +https://shafiqul.dev)'

function stripHtml(html = '') {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(Number(dec)))
    .replace(/\s+/g, ' ')
    .trim()
}

async function getJson(url: string) {
  const res = await fetch(url, {
    headers: { 'User-Agent': UA, Accept: 'application/json' },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return res.json()
}

async function getText(url: string) {
  const res = await fetch(url, {
    headers: { 'User-Agent': UA },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return res.text()
}

function toDate(value: unknown) {
  if (!value) return undefined
  const date = typeof value === 'number' ? new Date(value < 1e12 ? value * 1000 : value) : new Date(String(value))
  return Number.isNaN(date.getTime()) ? undefined : date
}

function money(min?: number, max?: number, currency = 'USD') {
  if (!min && !max) return undefined
  const fmt = (n: number) => `${Math.round(n / 1000)}k`
  return min && max ? `${currency} ${fmt(min)}–${fmt(max)}` : `${currency} ${fmt((min || max) as number)}`
}

// ─── Sources ──────────────────────────────────────────────────────────────────

export function parseRemotive(data: any): RawJob[] {
  return (data?.jobs || []).map((j: any) => ({
    source: 'Remotive',
    externalId: String(j.id),
    title: j.title,
    company: j.company_name,
    url: j.url,
    location: j.candidate_required_location,
    salary: j.salary || undefined,
    tags: j.tags || [],
    description: stripHtml(j.description),
    publishedAt: toDate(j.publication_date),
  }))
}

export function parseRemoteOk(data: any): RawJob[] {
  return (Array.isArray(data) ? data : [])
    .filter((j: any) => j && j.id && j.position)
    .map((j: any) => ({
      source: 'RemoteOK',
      externalId: String(j.id),
      title: j.position,
      company: j.company,
      url: j.url || `https://remoteok.com/remote-jobs/${j.id}`,
      location: j.location,
      salary: money(j.salary_min, j.salary_max),
      tags: j.tags || [],
      description: stripHtml(j.description),
      publishedAt: toDate(j.epoch || j.date),
    }))
}

export function parseArbeitnow(data: any): RawJob[] {
  return (data?.data || [])
    .filter((j: any) => j.remote)
    .map((j: any) => ({
      source: 'Arbeitnow',
      externalId: String(j.slug),
      title: j.title,
      company: j.company_name,
      url: j.url,
      location: j.location,
      tags: [...(j.tags || []), ...(j.job_types || [])],
      description: stripHtml(j.description),
      publishedAt: toDate(j.created_at),
    }))
}

export function parseJobicy(data: any): RawJob[] {
  return (data?.jobs || []).map((j: any) => ({
    source: 'Jobicy',
    externalId: String(j.id),
    title: stripHtml(j.jobTitle),
    company: j.companyName,
    url: j.url,
    location: j.jobGeo,
    salary: money(j.annualSalaryMin, j.annualSalaryMax, j.salaryCurrency || 'USD'),
    tags: [...[].concat(j.jobIndustry || []), ...[].concat(j.jobType || [])].map((t: any) => stripHtml(String(t))),
    description: stripHtml(j.jobDescription || j.jobExcerpt),
    publishedAt: toDate(j.pubDate),
  }))
}

export function parseWeWorkRemotely(xml: string): RawJob[] {
  const tag = (block: string, name: string) => {
    const m = block.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`))
    return m ? m[1].replace(/^<!\[CDATA\[|\]\]>$/g, '').trim() : ''
  }
  return (xml.match(/<item>[\s\S]*?<\/item>/g) || []).map((item) => {
    const fullTitle = stripHtml(tag(item, 'title'))
    const [company, ...rest] = fullTitle.split(':')
    const link = tag(item, 'link') || tag(item, 'guid')
    return {
      source: 'WeWorkRemotely',
      externalId: link,
      title: rest.length ? rest.join(':').trim() : fullTitle,
      company: rest.length ? company.trim() : undefined,
      url: link,
      location: stripHtml(tag(item, 'region')) || undefined,
      tags: [stripHtml(tag(item, 'category'))].filter(Boolean),
      description: stripHtml(tag(item, 'description')),
      publishedAt: toDate(tag(item, 'pubDate')),
    }
  })
}

const SOURCES: { name: string; load: () => Promise<RawJob[]> }[] = [
  { name: 'Remotive', load: async () => parseRemotive(await getJson('https://remotive.com/api/remote-jobs?category=software-dev&limit=150')) },
  { name: 'RemoteOK', load: async () => parseRemoteOk(await getJson('https://remoteok.com/api')) },
  { name: 'Arbeitnow', load: async () => parseArbeitnow(await getJson('https://www.arbeitnow.com/api/job-board-api')) },
  { name: 'Jobicy', load: async () => parseJobicy(await getJson('https://jobicy.com/api/v2/remote-jobs?count=100&industry=dev')) },
  {
    name: 'WeWorkRemotely',
    load: async () => parseWeWorkRemotely(await getText('https://weworkremotely.com/categories/remote-full-stack-programming-jobs.rss')),
  },
]

// ─── Scoring ──────────────────────────────────────────────────────────────────

function hasWord(haystack: string, keyword: string) {
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`(^|[^a-z0-9])${escaped}($|[^a-z0-9])`, 'i').test(haystack)
}

export function scoreJob(job: RawJob) {
  const title = job.title.toLowerCase()
  const body = `${job.tags.join(' ')} ${job.description}`.toLowerCase()
  const location = (job.location || '').toLowerCase()
  const matched: string[] = []
  let score = 0

  for (const [skill, [weight, aliases]] of Object.entries(SKILLS)) {
    const inTitle = aliases.some((alias) => hasWord(title, alias))
    const inBody = inTitle || aliases.some((alias) => hasWord(body, alias))
    if (inBody) {
      score += weight * (inTitle ? 2 : 1)
      matched.push(skill)
    }
  }

  if (!location || OPEN_LOCATIONS.some((l) => location.includes(l))) score += 2
  // Location-locked / clearance jobs are never a match
  if (BLOCKERS.some((b) => location.includes(b) || body.includes(b))) return { score: 0, matchedSkills: matched }
  if (/\b(senior|sr\.?|lead|principal|staff)\b/i.test(job.title)) score -= 1

  return { score, matchedSkills: matched }
}

// ─── Runner ───────────────────────────────────────────────────────────────────

export interface JobRunResult {
  fetched: number
  matched: number
  inserted: number
  alerted: number
  errors: string[]
}

async function sendTelegram(jobs: any[]) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId || !jobs.length) return 0

  const lines = jobs
    .slice(0, 10)
    .map((j) => `⭐ ${j.score} · <b>${escapeHtml(j.title)}</b>${j.company ? ` — ${escapeHtml(j.company)}` : ''}\n${escapeHtml(j.location || 'Remote')} · ${j.source}\n${j.url}`)
  const text = `🔎 <b>${jobs.length} new matching remote job${jobs.length > 1 ? 's' : ''}</b>\n\n${lines.join('\n\n')}\n\nAll jobs: https://shafiqul.dev/dashboard/admin/jobs`

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: true }),
  })
  return res.ok ? Math.min(jobs.length, 10) : 0
}

function escapeHtml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/** Fetch all sources, score, upsert into MongoDB and alert. Assumes connectDB() was called. */
export async function runJobFinder(): Promise<JobRunResult> {
  const result: JobRunResult = { fetched: 0, matched: 0, inserted: 0, alerted: 0, errors: [] }

  const settled = await Promise.allSettled(SOURCES.map((s) => s.load()))
  const raw: RawJob[] = []
  settled.forEach((outcome, i) => {
    if (outcome.status === 'fulfilled') raw.push(...outcome.value)
    else result.errors.push(`${SOURCES[i].name}: ${outcome.reason?.message || outcome.reason}`)
  })
  result.fetched = raw.length

  const twoWeeksAgo = Date.now() - 14 * 24 * 60 * 60 * 1000
  const matches = raw
    .filter((job) => job.title && job.url && job.externalId)
    .filter((job) => !job.publishedAt || job.publishedAt.getTime() > twoWeeksAgo)
    .map((job) => ({ job, ...scoreJob(job) }))
    .filter((m) => m.score >= MIN_SCORE)
  result.matched = matches.length

  if (matches.length) {
    const ops = matches.map(({ job, score, matchedSkills }) => ({
      updateOne: {
        filter: { source: job.source, externalId: job.externalId },
        update: {
          // Only set on first insert so my status (saved/applied/rejected) is never overwritten
          $setOnInsert: {
            source: job.source,
            externalId: job.externalId,
            title: job.title,
            company: job.company,
            url: job.url,
            location: job.location,
            salary: job.salary,
            tags: job.tags.slice(0, 12),
            excerpt: job.description.slice(0, 600),
            publishedAt: job.publishedAt,
            score,
            matchedSkills,
            status: 'new',
            notified: false,
          },
        },
        upsert: true,
      },
    }))
    const write = await Job.bulkWrite(ops, { ordered: false })
    result.inserted = write.upsertedCount || 0
  }

  const toAlert = await Job.find({ notified: false, score: { $gte: ALERT_SCORE } }).sort({ score: -1 }).limit(10).lean()
  try {
    result.alerted = await sendTelegram(toAlert)
  } catch (error: any) {
    result.errors.push(`Telegram: ${error?.message || error}`)
  }
  // Mark everything pending as handled so a failed/unconfigured alert doesn't resend old jobs forever
  await Job.updateMany({ notified: false }, { $set: { notified: true } })

  return result
}
