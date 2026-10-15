import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import User from '@/models/User'
import { SITE_URL } from '@/lib/constants'

const GENERIC_MESSAGE = 'If an account exists for this email, a password reset link has been sent.'
const TOKEN_TTL_MS = 30 * 60 * 1000

async function sendResetEmail(to: string, link: string) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    // No provider configured: keep the link in the server log so the owner can still recover access.
    console.log(`[password-reset] RESEND_API_KEY not set. Reset link for ${to}: ${link}`)
    return
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM || 'Shafiqul <onboarding@resend.dev>',
      to,
      subject: 'Reset your password',
      html: `<p>We received a request to reset your password.</p>
<p><a href="${link}">Reset password</a></p>
<p>This link expires in 30 minutes. If you did not request it, you can ignore this email.</p>`,
    }),
  })
  if (!res.ok) console.error('[password-reset] Email provider error:', res.status, await res.text())
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ success: false, message: 'Please provide your email' }, { status: 400 })
    }

    await connectDB()
    const user = await User.findOne({ email: email.trim().toLowerCase() })

    if (user && user.isActive) {
      const token = crypto.randomBytes(32).toString('hex')
      // Only the hash is stored; the raw token exists only in the emailed link.
      user.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex')
      user.resetPasswordExpires = new Date(Date.now() + TOKEN_TTL_MS)
      await user.save({ validateBeforeSave: false })

      const base = process.env.NEXT_PUBLIC_SITE_URL || SITE_URL
      await sendResetEmail(user.email, `${base}/auth/reset-password?token=${token}`)
    }

    // Same answer whether or not the account exists, so emails cannot be probed.
    return NextResponse.json({ success: true, message: GENERIC_MESSAGE })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json({ success: false, message: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
