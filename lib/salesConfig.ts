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
  /** Upfront payment before work starts. */
  advancePercent: 40,
  bookingUrl: '/book-consultation',
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
