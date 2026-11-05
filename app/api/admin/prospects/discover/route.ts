import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { withAdminAuth } from '@/lib/crud'
import { AI_SETUP_MESSAGE, aiAvailable } from '@/lib/ai/provider'
import { domainOf, isValidEmail } from '@/lib/outreach'
import { discoverCompanies } from '@/lib/outreachAgent'
import Prospect from '@/models/Prospect'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

/** "Find clients": the AI searches the web for businesses matching a target description. */
export async function POST(request: NextRequest) {
  if (!(await withAdminAuth(request))) {
    return NextResponse.json({ success: false, message: 'Unauthorized: Admin access required' }, { status: 401 })
  }
  if (!aiAvailable()) {
    return NextResponse.json({ success: false, message: AI_SETUP_MESSAGE }, { status: 400 })
  }

  const body = await request.json().catch(() => ({}))
  const target = String(body.target || '').trim().slice(0, 300)
  const count = Number(body.count) || 5
  if (target.length < 5) return NextResponse.json({ success: false, message: 'Describe who you want to find.' }, { status: 400 })

  try {
    await connectDB()
    const known = await Prospect.find().select('domain').lean()
    const exclude = known.map((p: any) => p.domain).filter(Boolean)
    const companies = await discoverCompanies(target, count, exclude)

    let added = 0
    for (const c of companies) {
      const domain = domainOf(c.website)
      const email = isValidEmail(c.email) ? String(c.email).toLowerCase() : undefined
      if (!c.company || !domain) continue
      if (await Prospect.exists({ $or: [{ domain }, ...(email ? [{ email }] : [])] })) continue
      await Prospect.create({
        company: String(c.company).slice(0, 150),
        website: c.website,
        domain,
        email,
        industry: c.industry || undefined,
        country: c.country || undefined,
        source: 'discovered',
        sourceNote: `${target} — ${c.why}`.slice(0, 300),
      })
      added++
    }
    return NextResponse.json({ success: true, data: { found: companies.length, added } })
  } catch (error: any) {
    console.error('Discover error:', error)
    return NextResponse.json({ success: false, message: error?.message || 'Search failed' }, { status: 500 })
  }
}
