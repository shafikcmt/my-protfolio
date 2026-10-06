import { AUTHOR_EMAIL, AUTHOR_NAME, SITE_URL } from '@/lib/constants'

/**
 * My career summary used to build Claude prompts (cover letters, interview prep)
 * on the admin Job Finder page. Edit this to keep prompts accurate.
 */
export const CAREER_PROFILE = {
  name: AUTHOR_NAME,
  email: AUTHOR_EMAIL,
  portfolio: SITE_URL,
  role: 'Full Stack Developer (Laravel · Next.js · MERN)',
  location: 'Bangladesh (GMT+6), working remotely with flexible overlap for EU / US hours',
  skills: [
    'Laravel / PHP', 'Next.js', 'React', 'Node.js / Express', 'MongoDB', 'MySQL',
    'TypeScript', 'Tailwind CSS', 'REST APIs', 'ERP systems', 'Admin dashboards',
  ],
  domain:
    'Garments & apparel industry software — merchandising and order tracking (TNA), production and line output, store / inventory, commercial export documents, HR and payroll.',
  extras: 'Also a web development trainer: I teach Laravel, MERN and Next.js and explain technical work clearly to non-technical clients.',
}

/** Tracked portfolio URL for a job's ref code. */
export function trackedPortfolioUrl(refCode?: string) {
  return refCode ? `${SITE_URL}/?ref=${refCode}` : SITE_URL
}
