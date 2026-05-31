import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Project from '@/models/Project'
import mongoose from 'mongoose'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const url = new URL(request.url)
    const slug = url.searchParams.get('slug')
    const id = url.searchParams.get('id')
    const lookup = slug || id

    if (lookup) {
      let project: any = null

      if (slug) {
        project = await Project.findOne({ slug, status: 'published' })
      }

      if (!project && mongoose.Types.ObjectId.isValid(lookup)) {
        project = await Project.findOne({ _id: lookup, status: 'published' })
      }

      if (!project) {
        return NextResponse.json({ success: false, message: 'Project not found' }, { status: 404 })
      }

      return NextResponse.json({ success: true, data: project })
    }

    const projects = await Project.find({ status: 'published' }).sort({ featured: -1, createdAt: -1 })
    return NextResponse.json({ success: true, data: projects })
  } catch (error: any) {
    console.error('Public project fetch error:', error)
    return NextResponse.json({ success: false, message: error.message || 'Failed to fetch projects' }, { status: 500 })
  }
}
