import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import User from '@/models/User'

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json()
    if (!token || typeof token !== 'string' || !password || typeof password !== 'string') {
      return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 })
    }
    if (password.length < 6) {
      return NextResponse.json({ success: false, message: 'Password must be at least 6 characters' }, { status: 400 })
    }

    await connectDB()
    const hashed = crypto.createHash('sha256').update(token).digest('hex')
    const user = await User.findOne({
      resetPasswordToken: hashed,
      resetPasswordExpires: { $gt: new Date() },
    }).select('+password +resetPasswordToken +resetPasswordExpires')

    if (!user) {
      return NextResponse.json({ success: false, message: 'This reset link is invalid or has expired' }, { status: 400 })
    }

    user.password = password // hashed by the model's pre-save hook
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    await user.save()

    return NextResponse.json({ success: true, message: 'Password updated. You can now sign in.' })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json({ success: false, message: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
