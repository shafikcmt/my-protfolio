import { CAREER_PROFILE } from '@/lib/careerProfile'

/**
 * Builds prompts I paste into my own Claude (claude.ai) for cover letters and
 * interview prep — free with my subscription, no API key needed.
 */

export interface PromptJob {
  title: string
  company?: string
  location?: string
  url: string
  description?: string
  excerpt?: string
  matchedSkills?: string[]
  tags?: string[]
}

export interface PromptProject {
  title: string
  slug?: string
  shortDescription?: string
  category?: string
  technologies?: string[]
}

function profileBlock() {
  const p = CAREER_PROFILE
  return [
    `Name: ${p.name}`,
    `Role: ${p.role}`,
    `Location: ${p.location}`,
    `Skills: ${p.skills.join(', ')}`,
    `Industry focus: ${p.domain}`,
    p.extras,
    `Email: ${p.email}`,
  ].join('\n')
}

function jobBlock(job: PromptJob) {
  return [
    `Title: ${job.title}`,
    job.company && `Company: ${job.company}`,
    job.location && `Location: ${job.location}`,
    `Job link: ${job.url}`,
    '',
    'Job description:',
    (job.description || job.excerpt || '(not available — open the job link)').slice(0, 4000),
  ]
    .filter((line) => typeof line === 'string')
    .join('\n')
}

/** Picks the projects most relevant to the job (by shared technologies / keywords). */
export function relevantProjects(job: PromptJob, projects: PromptProject[], limit = 3) {
  const haystack = `${job.title} ${job.description || job.excerpt || ''} ${(job.tags || []).join(' ')}`.toLowerCase()
  const scored = projects
    .map((project) => {
      const words = [...(project.technologies || []), project.category || '', ...project.title.split(/\s+/)]
      const score = words.filter((w) => w.length > 2 && haystack.includes(w.toLowerCase())).length
      return { project, score }
    })
    .sort((a, b) => b.score - a.score)
  // Prefer projects that share something with the job; fall back to my top projects
  const matching = scored.filter((s) => s.score > 0)
  return (matching.length ? matching : scored).slice(0, matching.length ? limit : 2).map(({ project }) => project)
}

export function buildCoverLetterPrompt(job: PromptJob, projects: PromptProject[], portfolioUrl: string) {
  const picked = relevantProjects(job, projects)
  const projectLines = picked.length
    ? picked
        .map((p) => `- ${p.title}${p.technologies?.length ? ` (${p.technologies.join(', ')})` : ''}: ${p.shortDescription || ''}`)
        .join('\n')
    : '- (see portfolio)'

  return `Write a short, genuine cover letter / application message for this remote job.

## About me
${profileBlock()}
Portfolio (include this exact link once): ${portfolioUrl}

## My most relevant projects
${projectLines}

## The job
${jobBlock(job)}

## Instructions
- 150–220 words, friendly and confident, plain English (I'm a non-native speaker, keep it natural, not fancy).
- Open with why this specific role/company interests me — no generic "I am writing to apply".
- Connect 2–3 of the job's key requirements to my real skills and the projects above. Only use facts given here; do not invent experience, years or numbers.
- Mention I work remotely from Bangladesh with flexible overlap hours.
- End with a simple call to action (a short call / next step) and my name.
- Also give me a 1-line email subject, and a 2–3 sentence shorter version for platforms with character limits.`
}

export function buildInterviewPrepPrompt(job: PromptJob) {
  return `Help me prepare for an interview for this remote job.

## About me
${profileBlock()}

## The job
${jobBlock(job)}

## Please give me
1. The 8 most likely technical questions for this role (based on the stack in the description), each with a short model answer I can adapt.
2. 5 likely behavioural / remote-work questions (communication, time zones, ownership) with answer tips using my background.
3. A 60-second "tell me about yourself" answer tailored to this job.
4. 3 smart questions I should ask the interviewer.
5. Any gaps between my skills and the requirements, and how to address them honestly.
Keep the language simple and practical.`
}

/**
 * Copies the prompt and opens Claude with it pre-filled (falls back to paste).
 * Returns what worked so the UI can tell me what to do next.
 */
export async function openInClaude(prompt: string) {
  let copied = false
  try {
    await navigator.clipboard.writeText(prompt)
    copied = true
  } catch {
    // Clipboard can be blocked; the pre-filled URL below still works for shorter prompts
  }
  const prefilled = `https://claude.ai/new?q=${encodeURIComponent(prompt)}`
  const win = window.open(prefilled.length < 7500 ? prefilled : 'https://claude.ai/new', '_blank')
  return { copied, opened: Boolean(win) }
}
