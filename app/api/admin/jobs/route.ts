import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { withAdminAuth } from '@/lib/crud'
import Job from '@/models/Job'

export const dynamic = 'force-dynamic'

const STATUSES = ['new', 'saved', 'applied', 'rejected']

function unauthorized() {
  return NextResponse.json({ success: false, message: 'Unauthorized: Admin access required' }, { status: 401 })
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

    const [jobs, counts, lastJob] = await Promise.all([
      Job.find(filter).sort({ score: -1, publishedAt: -1 }).limit(200).lean(),
      Job.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Job.findOne().sort({ createdAt: -1 }).select('createdAt').lean(),
    ])

    const stats = Object.fromEntries(STATUSES.map((s) => [s, 0]))
    counts.forEach((c: any) => { stats[c._id] = c.count })

    return NextResponse.json({ success: true, data: jobs, stats, lastFoundAt: (lastJob as any)?.createdAt || null })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || 'Failed to load jobs' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  if (!(await withAdminAuth(request))) return unauthorized()
  try {
    await connectDB()
    const { id, status } = await request.json()
    if (!id || !STATUSES.includes(status)) {
      return NextResponse.json({ success: false, message: 'id and a valid status are required' }, { status: 400 })
    }
    const job = await Job.findByIdAndUpdate(id, { status }, { new: true })
    if (!job) return NextResponse.json({ success: false, message: 'Job not found' }, { status: 404 })
    return NextResponse.json({ success: true, data: job })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || 'Failed to update job' }, { status: 500 })
  }
}
