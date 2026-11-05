import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { withAdminAuth } from '@/lib/crud'
import { runJobFinder } from '@/lib/jobFinder'
import { runDailyOutreach } from '@/lib/outreach'
import { aiAvailable } from '@/lib/ai/provider'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

/**
 * Runs the remote job finder. Called daily by Vercel Cron (see vercel.json,
 * authenticated with CRON_SECRET) or manually from the admin Jobs page.
 */
async function handle(request: NextRequest) {
  const secret = process.env.CRON_SECRET
  const fromCron = Boolean(secret) && request.headers.get('authorization') === `Bearer ${secret}`
  if (!fromCron && !(await withAdminAuth(request))) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  try {
    await connectDB()
    const result = await runJobFinder()
    // Daily client outreach (follow-ups, queued emails, new drafts) rides on the same daily cron
    let outreach: unknown = null
    if (fromCron && (await aiAvailable())) {
      try {
        outreach = await runDailyOutreach()
      } catch (error: any) {
        outreach = { error: error?.message || String(error) }
      }
    }
    return NextResponse.json({ success: true, data: result, outreach })
  } catch (error: any) {
    console.error('Job finder error:', error)
    return NextResponse.json({ success: false, message: error?.message || 'Job finder failed' }, { status: 500 })
  }
}

export const GET = handle
export const POST = handle
