import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Service from '@/models/Service'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const url = new URL(request.url)
    const slug = url.searchParams.get('slug')
    const filter: any = {}
    if (slug) {
      filter.slug = slug
    }
    const services = await Service.find(filter).sort({ createdAt: -1 })
    return NextResponse.json({ success: true, data: services })
  } catch (error: any) {
    console.error('Public services fetch error:', error)
    return NextResponse.json({ success: false, message: error.message || 'Failed to fetch services' }, { status: 500 })
  }
}
