import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { withAdminAuth } from '@/lib/crud'
import Setting from '@/models/Setting'
import WebsiteSetting from '@/models/WebsiteSetting'

function cleanSettings(body: Record<string, any>) {
  const payload = { ...body }
  delete payload.id
  delete payload._id
  delete payload.createdAt
  delete payload.updatedAt
  delete payload.__v
  return payload
}

async function getSiteSettings() {
  const [siteSetting, websiteSetting] = await Promise.all([
    Setting.findOne({ key: 'site' }).lean(),
    WebsiteSetting.findOne({}).sort({ updatedAt: -1 }).lean(),
  ])

  return {
    ...((websiteSetting as any) || {}),
    ...(((siteSetting as any)?.value as Record<string, any>) || {}),
  }
}

async function ensureAdmin(request: NextRequest) {
  const admin = await withAdminAuth(request)
  if (!admin) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized: Admin access required' },
      { status: 401 }
    )
  }
  return null
}

export async function GET(request: NextRequest) {
  try {
    const unauthorized = await ensureAdmin(request)
    if (unauthorized) return unauthorized

    await connectDB()
    const data = await getSiteSettings()
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error('Admin settings fetch error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const unauthorized = await ensureAdmin(request)
    if (unauthorized) return unauthorized

    await connectDB()
    const payload = cleanSettings(await request.json())

    await WebsiteSetting.findOneAndUpdate(
      {},
      { $set: payload },
      { upsert: true, new: true, setDefaultsOnInsert: true, sort: { updatedAt: -1 } }
    )

    await Setting.findOneAndUpdate(
      { key: 'site' },
      { key: 'site', value: payload },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )

    await Setting.findOneAndUpdate(
      { key: 'contact' },
      {
        key: 'contact',
        value: {
          email: payload.email,
          phone: payload.phone,
          whatsapp: payload.whatsapp,
          address: payload.address,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )

    const data = await getSiteSettings()
    return NextResponse.json({ success: true, message: 'Settings updated successfully', data })
  } catch (error: any) {
    console.error('Admin settings update error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update settings' },
      { status: 500 }
    )
  }
}
