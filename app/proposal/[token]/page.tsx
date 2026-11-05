import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { connectDB } from '@/lib/db'
import { verifyToken } from '@/lib/auth'
import { SALES_CONFIG } from '@/lib/salesConfig'
import { escapeHtml, sendTelegram } from '@/lib/telegram'
import { proposalIsOpen } from '@/lib/proposals'
import Proposal from '@/models/Proposal'
import ProposalView, { type ProposalData } from '@/components/ProposalView'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Project proposal',
  robots: { index: false, follow: false },
}

export default async function ProposalPage({ params }: { params: { token: string } }) {
  await connectDB()
  const proposal: any = await Proposal.findOne({ token: params.token }).lean()
  if (!proposal) notFound()

  // First view by the client (not me while logged in as admin) → mark viewed + Telegram alert
  const authToken = cookies().get('token')?.value
  const isAdmin = authToken ? verifyToken(authToken)?.role === 'admin' : false
  if (proposal.status === 'sent' && !isAdmin) {
    await Proposal.updateOne({ _id: proposal._id, status: 'sent' }, { $set: { status: 'viewed', viewedAt: new Date() } })
    proposal.status = 'viewed'
    await sendTelegram(`👀 <b>${escapeHtml(proposal.clientName || 'Client')}</b> opened the proposal “${escapeHtml(proposal.title)}”`)
  }

  const data: ProposalData = {
    token: proposal.token,
    title: proposal.title,
    summary: proposal.summary || '',
    clientName: proposal.clientName || '',
    clientEmail: proposal.clientEmail || '',
    clientPhone: proposal.clientPhone || '',
    notes: proposal.notes || '',
    packages: (proposal.packages || []).map((p: any) => ({
      name: p.name,
      priceUsd: p.priceUsd,
      timeline: p.timeline || '',
      includes: p.includes || [],
      recommended: Boolean(p.recommended),
    })),
    createdAt: new Date(proposal.createdAt).toISOString(),
    validUntil: proposal.validUntil ? new Date(proposal.validUntil).toISOString() : null,
    status: proposal.status === 'viewed' || proposal.status === 'sent' ? (proposalIsOpen(proposal) ? 'open' : 'expired') : proposal.status,
    acceptedPackage: proposal.accepted?.packageName || null,
    acceptedPrice: proposal.accepted?.priceUsd || null,
    paymentMethod: proposal.payment?.method || null,
    terms: {
      schedule: SALES_CONFIG.paymentSchedule.map((s) => ({ label: s.label, percent: s.percent })),
      supportDays: SALES_CONFIG.supportDays,
      conditions: [...SALES_CONFIG.proposalTerms],
      paymentMethods: SALES_CONFIG.paymentMethods.filter((m) => m.details.trim()).map((m) => ({ name: m.name, details: m.details })),
    },
  }

  return <ProposalView data={data} />
}
