import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { withAdminAuth } from '@/lib/crud'
import { trackedPortfolioUrl } from '@/lib/careerProfile'
import { escapeHtml, sendTelegram } from '@/lib/telegram'
import Job from '@/models/Job'

export const dynamic = 'force-dynamic'

const MAX_VISITS = 100
const ALERT_GAP_MS = 30 * 60 * 1000 // one Telegram alert per visit session

/**
 * Records a portfolio visit that arrived through a job's tracking link
 * (https://shafiqul.dev/?ref=<code>) and alerts me on Telegram.
 * Always answers 204 so the public site never shows errors.
 */
export async function POST(request: NextRequest) {
  const done = new NextResponse(null, { status: 204 })
  try {
    const body = await request.json().catch(() => ({}))
    const ref = String(body.ref || '').toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 40)
    const path = String(body.path || '/').slice(0, 200)
    if (!ref) return done

    // Don't count my own visits while logged in as admin
    if (await withAdminAuth(request)) return done

    await connectDB()
    const job = await Job.findOne({ refCode: ref })
    if (!job) return done

    const now = new Date()
    const isNewSession = !job.lastVisitAt || now.getTime() - new Date(job.lastVisitAt).getTime() > ALERT_GAP_MS

    await Job.updateOne(
      { _id: job._id },
      {
        $inc: { visitCount: 1 },
        $set: { lastVisitAt: now },
        $push: { visits: { $each: [{ at: now, path }], $slice: -MAX_VISITS } },
      }
    )

    if (isNewSession) {
      await sendTelegram(
        `👀 <b>${escapeHtml(job.company || 'A recruiter')}</b> just opened your portfolio!\n` +
          `Job: ${escapeHtml(job.title)}\nPage: ${escapeHtml(path)}\nLink: ${trackedPortfolioUrl(job.refCode)}\n\n` +
          `Good moment to follow up 🙂\nhttps://shafiqul.dev/dashboard/admin/jobs`
      )
    }
  } catch (error) {
    console.error('Track visit error:', error)
  }
  return done
}
