import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { advanceAmount, formatUsd } from '@/lib/proposals'
import { escapeHtml, sendTelegramMessage } from '@/lib/telegram'
import Proposal from '@/models/Proposal'

export const dynamic = 'force-dynamic'

const fail = (message: string, status = 400) => NextResponse.json({ success: false, message }, { status })

/** Client reports that they paid the advance; I confirm or reject it in Telegram. */
export async function POST(request: NextRequest, { params }: { params: { token: string } }) {
  const body = await request.json().catch(() => ({}))
  const method = String(body.method || '').trim().slice(0, 80)
  const reference = String(body.reference || '').trim().slice(0, 120)
  const note = String(body.note || '').trim().slice(0, 300)
  if (!reference) return fail('Please add the transaction ID or reference.')

  try {
    await connectDB()
    const proposal = await Proposal.findOneAndUpdate(
      { token: params.token, status: { $in: ['accepted', 'payment_reported'] } },
      { $set: { status: 'payment_reported', payment: { method, reference, note, reportedAt: new Date() } } },
      { new: true }
    )
    if (!proposal) return fail('Payment can only be reported for an accepted proposal.', 409)

    const price = proposal.accepted?.priceUsd || 0
    await sendTelegramMessage(
      `💰 <b>Payment reported</b> — check your ${escapeHtml(method || 'account')}\n` +
        `${escapeHtml(proposal.accepted?.name || proposal.clientName || 'Client')} · ${escapeHtml(proposal.title)}\n` +
        `Advance due: <b>${formatUsd(advanceAmount(price))}</b> (of ${formatUsd(price)})\n` +
        `Transaction: <code>${escapeHtml(reference)}</code>` +
        (note ? `\nNote: ${escapeHtml(note)}` : ''),
      [
        [
          { text: '✅ Payment received', callback_data: `proposal:paid:${proposal._id}` },
          { text: '❌ Not received', callback_data: `proposal:unpaid:${proposal._id}` },
        ],
      ]
    )
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Report payment error:', error)
    return fail('Something went wrong. Please try again.', 500)
  }
}
