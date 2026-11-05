import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { withAdminAuth } from '@/lib/crud'
import { approveAndSend, domainOf, isValidEmail, sentTodayCount } from '@/lib/outreach'
import { OUTREACH_CONFIG, outreachSendingConfigured } from '@/lib/outreachConfig'
import Prospect, { PROSPECT_STATUSES } from '@/models/Prospect'
import { activeAiProvider } from '@/lib/ai/provider'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const unauthorized = () => NextResponse.json({ success: false, message: 'Unauthorized: Admin access required' }, { status: 401 })
const fail = (message: string, status = 400) => NextResponse.json({ success: false, message }, { status })

const GROUPS: Record<string, string[]> = {
  review: ['draft', 'needs_email'],
  queue: ['new', 'approved'],
  sent: ['sent', 'followup_1', 'followup_2'],
  replied: ['replied'],
  closed: ['stopped', 'unsubscribed', 'skipped', 'failed'],
}

export async function GET(request: NextRequest) {
  if (!(await withAdminAuth(request))) return unauthorized()
  try {
    await connectDB()
    const group = new URL(request.url).searchParams.get('group') || 'review'
    const statuses = GROUPS[group] || GROUPS.review
    const [items, counts, sentToday] = await Promise.all([
      Prospect.find({ status: { $in: statuses } }).sort({ updatedAt: -1 }).limit(200).lean(),
      Prospect.aggregate([{ $group: { _id: '$status', n: { $sum: 1 } } }]),
      sentTodayCount(),
    ])
    const byStatus = Object.fromEntries(counts.map((c: any) => [c._id, c.n]))
    const stats = Object.fromEntries(Object.entries(GROUPS).map(([g, list]) => [g, list.reduce((sum, s) => sum + (byStatus[s] || 0), 0)]))
    return NextResponse.json({
      success: true,
      data: items,
      stats,
      sending: { configured: outreachSendingConfigured(), sentToday, dailyLimit: OUTREACH_CONFIG.dailySendLimit },
      ai: await activeAiProvider(),
    })
  } catch (error: any) {
    return fail(error?.message || 'Failed to load prospects', 500)
  }
}

/** Add prospects: one ({ company, website, email, ... }) or many ({ rows: [...] } from CSV). */
export async function POST(request: NextRequest) {
  if (!(await withAdminAuth(request))) return unauthorized()
  try {
    await connectDB()
    const body = await request.json()
    const rows: any[] = Array.isArray(body.rows) ? body.rows.slice(0, 500) : [body]
    let added = 0
    let skipped = 0
    for (const row of rows) {
      const company = String(row.company || '').trim().slice(0, 150)
      const website = String(row.website || '').trim().slice(0, 300)
      const email = String(row.email || '').trim().toLowerCase().slice(0, 150)
      if (!company || (!website && !email)) {
        skipped++
        continue
      }
      const domain = domainOf(website) || (email.includes('@') ? email.split('@')[1] : '')
      const exists = await Prospect.exists({ $or: [...(domain ? [{ domain }] : []), ...(email ? [{ email }] : [])] })
      if (exists) {
        skipped++
        continue
      }
      await Prospect.create({
        company,
        website: website || undefined,
        domain: domain || undefined,
        email: isValidEmail(email) ? email : undefined,
        contactName: String(row.contactName || row.contact || '').trim().slice(0, 100) || undefined,
        industry: String(row.industry || '').trim().slice(0, 100) || undefined,
        country: String(row.country || '').trim().slice(0, 60) || undefined,
        source: rows.length > 1 ? 'csv' : 'manual',
        sourceNote: String(row.note || '').trim().slice(0, 300) || undefined,
      })
      added++
    }
    return NextResponse.json({ success: true, data: { added, skipped } })
  } catch (error: any) {
    return fail(error?.message || 'Failed to add prospects', 500)
  }
}

/**
 * Actions on one prospect: { id, action: 'send' | 'skip' | 'replied' | 'stop' | 'reopen' | 'save', draft?, email? }
 */
export async function PATCH(request: NextRequest) {
  if (!(await withAdminAuth(request))) return unauthorized()
  try {
    await connectDB()
    const body = await request.json()
    const prospect = body.id ? await Prospect.findById(body.id) : null
    if (!prospect) return fail('Prospect not found', 404)

    if (body.email !== undefined) {
      const email = String(body.email).trim().toLowerCase()
      if (email && !isValidEmail(email)) return fail('Please enter a valid email address')
      prospect.email = email || undefined
      if (prospect.status === 'needs_email' && email) prospect.status = 'draft'
    }
    if (body.draft) {
      prospect.draft = { subject: String(body.draft.subject || '').slice(0, 150), body: String(body.draft.body || '').slice(0, 3000) }
    }

    let message = 'Saved'
    switch (body.action) {
      case 'manual':
        // Write the email myself (no AI): start from a simple template
        if (!prospect.draft?.body) {
          prospect.draft = {
            subject: `Software help for ${prospect.company}`.slice(0, 150),
            body: `Hi${prospect.contactName ? ` ${prospect.contactName}` : ''},\n\n[Write 2–4 sentences: what you noticed about their business and how you can help.]\n\nYou can see my work here: {{PORTFOLIO_LINK}}\n\nWould a short call next week be useful?\n\nShafiqul`,
          }
        }
        prospect.status = prospect.email ? 'draft' : 'needs_email'
        await prospect.save()
        message = 'Template ready — edit it under "To review"'
        break
      case 'send': {
        await prospect.save()
        const result = await approveAndSend(prospect)
        if (!result.ok && !(result as any).limited) return fail((result as any).error)
        message = result.ok ? 'Email sent' : 'Daily limit reached — queued for tomorrow'
        break
      }
      case 'skip':
      case 'replied':
      case 'stop':
        prospect.status = body.action === 'skip' ? 'skipped' : body.action === 'replied' ? 'replied' : 'stopped'
        prospect.nextSendAt = undefined
        await prospect.save()
        message = `Marked ${prospect.status}`
        break
      case 'reopen':
        prospect.status = prospect.draft?.body ? (prospect.email ? 'draft' : 'needs_email') : 'new'
        await prospect.save()
        message = 'Reopened'
        break
      default:
        if (!PROSPECT_STATUSES.includes(prospect.status)) prospect.status = 'new'
        await prospect.save()
    }
    return NextResponse.json({ success: true, message, data: await Prospect.findById(prospect._id).lean() })
  } catch (error: any) {
    return fail(error?.message || 'Failed to update prospect', 500)
  }
}
