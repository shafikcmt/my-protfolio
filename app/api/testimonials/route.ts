import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Testimonial from '@/models/Testimonial'

export async function GET() {
  try {
    await connectDB()
    const testimonials = await Testimonial.find({}).sort({ featured: -1, createdAt: -1 })
    return NextResponse.json({ success: true, data: testimonials })
  } catch (error: any) {
    console.error('Public testimonials fetch error:', error)
    return NextResponse.json({ success: false, message: error.message || 'Failed to fetch testimonials' }, { status: 500 })
  }
}
