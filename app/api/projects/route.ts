import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Project from '@/models/Project'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const url = new URL(request.url)
    const slug = url.searchParams.get('slug')
    const filter: any = {}
    if (slug) {
      filter.slug = slug
    }
    const projects = await Project.find(filter).sort({ featured: -1, createdAt: -1 })
    return NextResponse.json({ success: true, data: projects })
  } catch (error: any) {
    console.error('Public project fetch error:', error)
    return NextResponse.json({ success: false, message: error.message || 'Failed to fetch projects' }, { status: 500 })
  }
}
