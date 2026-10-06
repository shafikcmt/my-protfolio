import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { withAdminAuth } from '@/lib/crud'

/**
 * Returns a signed Cloudinary upload payload so the admin browser can upload
 * images/videos straight to Cloudinary (Vercel's filesystem is read-only and
 * request bodies are capped at ~4.5MB, so files never pass through this API).
 *
 * Required env vars: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
 */
export async function POST(request: NextRequest) {
  const admin = await withAdminAuth(request)
  if (!admin) {
    return NextResponse.json({ success: false, message: 'Unauthorized: Admin access required' }, { status: 401 })
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json(
      {
        success: false,
        message: 'File upload is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in Vercel environment variables — or paste a URL instead.',
      },
      { status: 501 }
    )
  }

  const body = await request.json().catch(() => ({}))
  const resourceType = body?.resourceType === 'video' ? 'video' : 'image'
  const folder = `portfolio/${String(body?.folder || 'uploads').replace(/[^a-z0-9/_-]/gi, '')}`
  const timestamp = Math.round(Date.now() / 1000)

  // Cloudinary signature: sha1 of alphabetically sorted params + api secret
  const signature = crypto
    .createHash('sha1')
    .update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`)
    .digest('hex')

  return NextResponse.json({
    success: true,
    data: {
      uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
      fields: { api_key: apiKey, timestamp: String(timestamp), folder, signature },
    },
  })
}
