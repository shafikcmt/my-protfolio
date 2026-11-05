import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { advanceAmount, formatUsd, proposalIsOpen } from '@/lib/proposals'
import { escapeHtml, sendTelegram } from '@/lib/telegram'
import Lead from '@/models/Lead'
import Proposal from '@/models/Proposal'

export const dynamic = 'force-dynamic'

const fail = (message: string, status = 400) => NextResponse.json({ success: false, message }, { status })

/** Client accepts one package of their proposal. */
export async function POST(request: NextRequest, { params }: { params: { token: string } }) {
  const body = await request.json().catch(() => ({}))
  const name = String(body.name || '').trim().slice(0, 100)
  const email = String(body.email || '').trim().slice(0, 150)
  const phone = String(body.phone || '').trim().slice(0, 40)
  if (!name) return fail('Please add your name.')
  if (!email && !phone) return fail('Please add an email or WhatsApp number.')
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail('Please check the email address.')
  if (body.agree !== true) return fail('Please confirm you agree with the terms.')

  try {
    await connectDB()
    const proposal = await Proposal.findOne({ token: params.token })
    if (!proposal) return fail('Proposal not found.', 404)
    if (!proposalIsOpen(proposal)) return fail('This proposal can no longer be accepted. Please contact Shafiqul for an updated one.', 409)

    const pkg = proposal.packages.find((p: any) => p.name === body.packageName)
    if (!pkg) return fail('Please choose a package.')

    // Only the first accept wins (no double acceptance from two tabs)
    const updated = await Proposal.findOneAndUpdate(
      { _id: proposal._id, status: { $in: ['sent', 'viewed'] } },
      {
        $set: {
          status: 'accepted',
          accepted: {
            packageName: pkg.name,
            priceUsd: pkg.priceUsd,
            name,
            email,
            phone,
            at: new Date(),
            ip: request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown',
          },
        },
      },
      { new: true }
    )
    if (!updated) return fail('This proposal was already accepted.', 409)

    if (proposal.leadId) {
      await Lead.updateOne(
        { _id: proposal.leadId },
        {
          $set: { status: 'approved', name, ...(email ? { email } : {}), ...(phone ? { phone } : {}) },
          $push: { transcript: { role: 'assistant', text: `✅ You accepted the ${pkg.name} package (${formatUsd(pkg.priceUsd)}). Pay the advance on the proposal page to start the project.`, at: new Date() } },
        }
      )
    }

    await sendTelegram(
      `🎉 <b>Proposal accepted!</b>\n${escapeHtml(name)}${email ? ` · ${escapeHtml(email)}` : ''}${phone ? ` · ${escapeHtml(phone)}` : ''}\n` +
        `${escapeHtml(proposal.title)}\nPackage: <b>${escapeHtml(pkg.name)} — ${formatUsd(pkg.priceUsd)}</b>\nAdvance due: <b>${formatUsd(advanceAmount(pkg.priceUsd))}</b>`
    )
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Accept proposal error:', error)
    return fail('Something went wrong. Please try again.', 500)
  }
}
