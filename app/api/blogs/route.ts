import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Blog from '@/models/Blog'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const url = new URL(request.url)
    const query = url.searchParams.get('q') || ''

    const filter: any = { published: true }
    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: 'i' } },
        { excerpt: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
      ]
    }

    const blogs = await Blog.find(filter).sort({ createdAt: -1 })
    return NextResponse.json({ success: true, data: blogs })
  } catch (error: any) {
    console.error('Public blog list fetch error:', error)
    return NextResponse.json({ success: false, message: error.message || 'Failed to fetch blogs' }, { status: 500 })
  }
}
