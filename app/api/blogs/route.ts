import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Blog from '@/models/Blog'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const url = new URL(request.url)
    const q = url.searchParams.get('q') || ''
    const category = url.searchParams.get('category') || ''
    const slug = url.searchParams.get('slug') || ''
    const limitParam = url.searchParams.get('limit') || ''
    const limit = limitParam ? parseInt(limitParam, 10) : 0

    const filter: any = { published: true }

    if (slug) {
      // Exact slug lookup for detail page
      filter.slug = slug
    } else {
      if (q) {
        filter.$or = [
          { title: { $regex: q, $options: 'i' } },
          { excerpt: { $regex: q, $options: 'i' } },
          { content: { $regex: q, $options: 'i' } },
          { category: { $regex: q, $options: 'i' } },
        ]
      }
      if (category) {
        filter.category = { $regex: `^${category}$`, $options: 'i' }
      }
    }

    let mongoQuery = Blog.find(filter).sort({ createdAt: -1 })
    if (limit > 0) mongoQuery = mongoQuery.limit(limit)
    const blogs = await mongoQuery

    return NextResponse.json({ success: true, data: blogs })
  } catch (error: any) {
    console.error('Public blog list fetch error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch blogs' },
      { status: 500 }
    )
  }
}
