import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { withAdminAuth } from '@/lib/crud'
import Job, { JOB_STATUSES } from '@/models/Job'

export const dynamic = 'force-dynamic'

const STATUSES: readonly string[] = JOB_STATUSES
const FOLLOW_UP_DAYS = 6

function unauthorized() {
  return NextResponse.json({ success: false, message: 'Unauthorized: Admin access required' }, { status: 401 })
}

function fail(error: any, fallback: string) {
  return NextResponse.json({ success: false, message: error?.message || fallback }, { status: 500 })
}

/** Short, readable tracking code, e.g. "stitchly-4f2a". */
function makeRefCode(company?: string) {
  const base = (company || 'job').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 20) || 'job'
  return `${base}-${crypto.randomBytes(2).toString('hex')}`
}

function toDateOrNull(value: unknown) {
  if (!value) return null
  const date = new Date(String(value))
  return Number.isNaN(date.getTime()) ? null : date
}

export async function GET(request: NextRequest) {
  if (!(await withAdminAuth(request))) return unauthorized()
  try {
    await connectDB()
    const params = new URL(request.url).searchParams
    const status = params.get('status') || 'new'
    const q = (params.get('q') || '').trim()

    const filter: Record<string, any> = {}
    if (STATUSES.includes(status)) filter.status = status
    if (q) {
      const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
      filter.$or = [{ title: rx }, { company: rx }, { matchedSkills: rx }]
    }

    // Pipeline stages sort by most recent activity; the inbox sorts by match score
    const sort: Record<string, 1 | -1> = ['new', 'saved', 'rejected'].includes(status)
      ? { score: -1, publishedAt: -1 }
      : { updatedAt: -1 }

    const [jobs, counts, lastJob] = await Promise.all([
      Job.find(filter).sort(sort).limit(200).lean(),
      Job.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Job.findOne({ source: { $ne: 'Manual' } }).sort({ createdAt: -1 }).select('createdAt').lean(),
    ])

    const stats = Object.fromEntries(STATUSES.map((s) => [s, 0]))
    counts.forEach((c: any) => { stats[c._id] = c.count })

    return NextResponse.json({ success: true, data: jobs, stats, lastFoundAt: (lastJob as any)?.createdAt || null })
  } catch (error) {
    return fail(error, 'Failed to load jobs')
  }
}

/** Add a job manually (found on LinkedIn, Facebook, a referral…). */
export async function POST(request: NextRequest) {
  if (!(await withAdminAuth(request))) return unauthorized()
  try {
    await connectDB()
    const body = await request.json()
    const title = String(body.title || '').trim()
    const url = String(body.url || '').trim()
    if (!title || !url) {
      return NextResponse.json({ success: false, message: 'Job title and link are required' }, { status: 400 })
    }
    const status = STATUSES.includes(body.status) ? body.status : 'saved'
    const description = String(body.description || '').trim()
    const job = await Job.create({
      source: 'Manual',
      externalId: crypto.randomUUID(),
      title,
      url,
      company: String(body.company || '').trim() || undefined,
      location: String(body.location || '').trim() || undefined,
      description: description.slice(0, 5000) || undefined,
      excerpt: description.slice(0, 600) || undefined,
      status,
      notified: true,
      ...(status === 'applied' ? { appliedAt: new Date(), followUpAt: new Date(Date.now() + FOLLOW_UP_DAYS * 86_400_000) } : {}),
    })
    return NextResponse.json({ success: true, data: job })
  } catch (error) {
    return fail(error, 'Failed to add job')
  }
}

/**
 * Update a job: { id, status?, notes?, followUpAt?, interviewAt?, ensureRef? }.
 * ensureRef creates the portfolio tracking code if the job doesn't have one yet.
 */
export async function PATCH(request: NextRequest) {
  if (!(await withAdminAuth(request))) return unauthorized()
  try {
    await connectDB()
    const body = await request.json()
    const job = body.id ? await Job.findById(body.id) : null
    if (!job) return NextResponse.json({ success: false, message: 'Job not found' }, { status: 404 })

    if (body.status !== undefined) {
      if (!STATUSES.includes(body.status)) {
        return NextResponse.json({ success: false, message: 'Invalid status' }, { status: 400 })
      }
      if (body.status === 'applied' && !job.appliedAt) {
        job.appliedAt = new Date()
        if (!job.followUpAt) job.followUpAt = new Date(Date.now() + FOLLOW_UP_DAYS * 86_400_000)
      }
      if (body.status !== 'applied') job.followUpAt = undefined
      job.status = body.status
    }
    if (body.notes !== undefined) job.notes = String(body.notes).slice(0, 5000)
    if (body.followUpAt !== undefined) job.followUpAt = toDateOrNull(body.followUpAt) ?? undefined
    if (body.interviewAt !== undefined) {
      job.interviewAt = toDateOrNull(body.interviewAt) ?? undefined
      job.interviewReminded = false
    }
    if (body.ensureRef && !job.refCode) {
      job.refCode = makeRefCode(job.company)
    }

    await job.save()
    return NextResponse.json({ success: true, data: job })
  } catch (error) {
    return fail(error, 'Failed to update job')
  }
}
