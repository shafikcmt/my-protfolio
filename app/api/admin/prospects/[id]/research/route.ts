import mongoose from 'mongoose'
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { withAdminAuth } from '@/lib/crud'
import { AI_SETUP_MESSAGE, aiAvailable } from '@/lib/ai/provider'
import { researchProspect } from '@/lib/outreach'
import Prospect from '@/models/Prospect'

export const dynamic = 'force-dynamic'
export const maxDuration = 120

/** Research one company now and draft its first email (also sent to Telegram for approval). */
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  if (!(await withAdminAuth(request))) {
    return NextResponse.json({ success: false, message: 'Unauthorized: Admin access required' }, { status: 401 })
  }
  if (!(await aiAvailable())) {
    return NextResponse.json({ success: false, message: AI_SETUP_MESSAGE }, { status: 400 })
  }
  try {
    await connectDB()
    const prospect = mongoose.Types.ObjectId.isValid(params.id) ? await Prospect.findById(params.id) : null
    if (!prospect) return NextResponse.json({ success: false, message: 'Prospect not found' }, { status: 404 })
    const result = await researchProspect(prospect)
    if (!result) return NextResponse.json({ success: false, message: 'Could not research this company. Check the website address.' }, { status: 502 })
    return NextResponse.json({ success: true, data: await Prospect.findById(prospect._id).lean() })
  } catch (error: any) {
    console.error('Research error:', error)
    return NextResponse.json({ success: false, message: error?.message || 'Research failed' }, { status: 500 })
  }
}
