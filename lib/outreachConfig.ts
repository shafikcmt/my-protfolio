import { AUTHOR_EMAIL, AUTHOR_NAME, SITE_URL, WHATSAPP_DISPLAY } from '@/lib/constants'

/**
 * Settings for client prospecting (lib/outreach.ts). Keep volumes low: a few
 * personal, relevant emails a day protect your domain's reputation.
 */
export const OUTREACH_CONFIG = {
  /** Max emails (first emails + follow-ups) sent per day. */
  dailySendLimit: 15,
  /** How many new prospects the daily run researches and drafts automatically. */
  dailyAutoDrafts: 3,
  /** Follow-ups after the first email, in days (only if they haven't replied). */
  followUpDays: [4, 9],
  /** Max companies found per "Find clients" search. */
  maxDiscoverPerRun: 10,

  sender: {
    name: AUTHOR_NAME,
    title: 'Full Stack Developer',
    website: SITE_URL,
    whatsapp: WHATSAPP_DISPLAY,
    location: 'Dhaka, Bangladesh',
  },
  /** Verified sender address in Resend, e.g. hello@shafiqul.dev */
  fromEmail: process.env.OUTREACH_FROM_EMAIL || '',
  /** Where replies go. */
  replyTo: process.env.OUTREACH_REPLY_TO || AUTHOR_EMAIL,
}

export function outreachSendingConfigured() {
  return Boolean(process.env.RESEND_API_KEY && OUTREACH_CONFIG.fromEmail)
}
