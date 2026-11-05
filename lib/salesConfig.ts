/**
 * Sales rules for the AI sales assistant (lib/salesAgent.ts).
 * Edit these numbers to match how you price — the assistant never quotes a
 * final price itself; it proposes packages that you approve in Telegram.
 */

export const SALES_CONFIG = {
  currency: 'USD',
  /** Lowest price for any custom project. The assistant never proposes less without your approval. */
  minimumProjectPrice: 800,
  /** Typical ranges shown to clients as "similar projects usually cost…" (wide on purpose). */
  typicalRanges: [
    { type: 'Business / company website', from: 800, to: 1500 },
    { type: 'Ecommerce store', from: 1000, to: 3500 },
    { type: 'LMS / online course or exam platform', from: 1200, to: 5000 },
    { type: 'Custom web app / SaaS / dashboard', from: 1500, to: 6000 },
    { type: 'ERP or garments software module (merchandising, production, inventory)', from: 2000, to: 8000 },
    { type: 'Mobile app (React Native)', from: 2000, to: 6000 },
    { type: 'Automation, bots, integrations or AI features', from: 800, to: 4000 },
    { type: 'Any other custom software', from: 800, to: 6000 },
  ],
  /** Small jobs (bug fixes, small changes) below the project minimum. */
  smallJobs: 'Bug fixes and small changes can be quoted per task after Shafiqul reviews them.',
  /** Upfront payment before work starts (first step of paymentSchedule). */
  advancePercent: 40,
  bookingUrl: '/book-consultation',

  /** Default assistant name; change it in Admin → Settings → AI & Assistant. */
  assistantName: 'Mira',

  // ── Proposals (/proposal/<link>) ──
  proposalValidDays: 14,
  /** Must add up to 100. */
  paymentSchedule: [
    { label: 'Advance to start the project', percent: 40 },
    { label: 'After the main features are demonstrated', percent: 30 },
    { label: 'On final delivery and handover', percent: 30 },
  ],
  /** Free bug-fix support after delivery, in days. */
  supportDays: 30,
  /**
   * How clients pay the advance. Fill in your real details — methods with an
   * empty `details` are hidden. Bangladeshi clients pay the BDT equivalent.
   */
  paymentMethods: [
    { name: 'bKash (Personal)', details: '' },
    { name: 'Nagad', details: '' },
    { name: 'Bank transfer', details: '' },
    { name: 'Payoneer / Wise (international)', details: '' },
  ],
  /** Shown on every proposal. Review these and adjust to your own terms. */
  proposalTerms: [
    'Work starts after the advance payment is received.',
    'Timelines are estimates and start from the advance payment; they depend on timely feedback and content from the client.',
    'Changes or new features outside this scope are quoted separately before work on them begins.',
    'Includes free bug-fix support after delivery for the period stated above.',
    'Source code and full ownership are handed over after the final payment.',
  ],
} as const

export function pricingRulesText() {
  const c = SALES_CONFIG
  return [
    `Currency: ${c.currency}. Minimum for any custom project: $${c.minimumProjectPrice}.`,
    'Typical ranges (for orientation only — real price depends on scope):',
    ...c.typicalRanges.map((r) => `- ${r.type}: $${r.from.toLocaleString('en-US')} – $${r.to.toLocaleString('en-US')}+`),
    c.smallJobs,
    `Payment terms: ${c.advancePercent}% advance, the rest by milestones / on delivery.`,
  ].join('\n')
}
