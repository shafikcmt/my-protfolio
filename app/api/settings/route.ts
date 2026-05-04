import { NextResponse, NextRequest } from 'next/server'
import { connectDB } from '@/lib/db'
import Setting from '@/models/Setting'

export async function GET() {
  try {
    await connectDB()
    const settings = await Setting.find({})
    const settingsObject = settings.reduce((acc, setting) => ({ ...acc, [setting.key]: setting.value }), {})
    return NextResponse.json({ success: true, data: settingsObject })
  } catch (error: any) {
    console.error('Public settings fetch error:', error)
    return NextResponse.json({ success: false, message: error.message || 'Failed to fetch settings' }, { status: 500 })
  }
}
