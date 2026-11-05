import crypto from 'crypto'
import { SITE_URL } from '@/lib/constants'
import { SALES_CONFIG } from '@/lib/salesConfig'
import { escapeHtml, sendTelegramMessage } from '@/lib/telegram'
import Proposal from '@/models/Proposal'

export interface ProposalPackage {
  name: string
  priceUsd: number
  timeline: string
  includes: string[]
  recommended?: boolean
}

export function proposalUrl(token: string) {
  return `${SITE_URL}/proposal/${token}`
}

export function formatUsd(value: number) {
  return `$${Math.round(value).toLocaleString('en-US')}`
}

/** Advance amount (first payment step) for a package price. */
export function advanceAmount(priceUsd: number) {
  return Math.round((priceUsd * SALES_CONFIG.advancePercent) / 100)
}

/** Proposal is still open for the client to accept. */
export function proposalIsOpen(proposal: { status: string; validUntil?: Date | string | null }) {
  const notExpired = !proposal.validUntil || new Date(proposal.validUntil).getTime() > Date.now()
  return ['sent', 'viewed'].includes(proposal.status) && notExpired
}

/**
 * Creates the proposal page for a lead, links it on the lead and tells me on
 * Telegram (with a Withdraw button in case anything is wrong).
 */
export async function createProposal(
  lead: any,
  input: { title: string; summary?: string; packages: ProposalPackage[]; notes?: string }
) {
  const packages = input.packages
    .filter((p) => p && p.name && Number(p.priceUsd) > 0)
    .slice(0, 3)
    .map((p) => ({
      name: String(p.name).slice(0, 60),
      priceUsd: Math.round(Number(p.priceUsd)),
      timeline: String(p.timeline || '').slice(0, 60),
      includes: (p.includes || []).map((i) => String(i).slice(0, 200)).filter(Boolean).slice(0, 12),
      recommended: Boolean(p.recommended),
    }))
  if (!packages.length) throw new Error('A proposal needs at least one package with a price.')
  if (!packages.some((p) => p.recommended)) packages[Math.min(1, packages.length - 1)].recommended = true

  const proposal = await Proposal.create({
    token: crypto.randomBytes(12).toString('base64url'),
    leadId: lead._id,
    clientName: lead.name,
    clientEmail: lead.email,
    clientPhone: lead.phone,
    title: String(input.title || lead.projectType || 'Project proposal').slice(0, 150),
    summary: String(input.summary || lead.summary || '').slice(0, 2000),
    packages,
    notes: input.notes ? String(input.notes).slice(0, 1000) : undefined,
    validUntil: new Date(Date.now() + SALES_CONFIG.proposalValidDays * 86_400_000),
  })

  lead.proposalToken = proposal.token
  const url = proposalUrl(proposal.token)
  await sendTelegramMessage(
    `📄 <b>Proposal published</b> for ${escapeHtml(lead.name || 'the client')}\n${escapeHtml(proposal.title)}\n` +
      packages.map((p) => `• ${escapeHtml(p.name)}: ${formatUsd(p.priceUsd)}${p.recommended ? ' ⭐' : ''}`).join('\n') +
      `\n\n${url}`,
    [[{ text: '↩️ Withdraw proposal', callback_data: `proposal:withdraw:${proposal._id}` }]]
  )
  return { proposal, url }
}
