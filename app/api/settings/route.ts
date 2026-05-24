import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Setting from '@/models/Setting'

export async function GET() {
  try {
    await connectDB()
    const settings = await Setting.find({})
    const settingsObject = settings.reduce(
      (acc, setting) => ({ ...acc, [setting.key]: setting.value }),
      {} as Record<string, any>
    )
    const siteSettings = settingsObject.site || {}

    return NextResponse.json({
      success: true,
      data: {
        ...siteSettings,
        ...settingsObject,
      },
    })
  } catch (error: any) {
    console.error('Public settings fetch error:', error)
    return NextResponse.json({ success: false, message: error.message || 'Failed to fetch settings' }, { status: 500 })
  }
}
