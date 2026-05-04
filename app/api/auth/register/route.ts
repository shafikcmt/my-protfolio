import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import User from '@/models/User'
import { generateToken } from '@/lib/auth'
import { UserRole } from '@/types/auth'

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const { email, password, name, role } = await request.json()

    // Validation
    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, message: 'Please provide all required fields' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Email already in use' },
        { status: 400 }
      )
    }

    // Create new user
    const userRole: UserRole = (role as UserRole) || 'student'
    const newUser = await User.create({
      email,
      password,
      name,
      role: userRole,
    })

    // Generate token
    const token = generateToken(newUser._id.toString(), newUser.email, newUser.role as UserRole)

    // Create response with cookie
    const response = NextResponse.json(
      {
        success: true,
        message: 'User registered successfully',
        user: {
          id: newUser._id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
        },
      },
      { status: 201 }
    )

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return response
  } catch (error: any) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Registration failed' },
      { status: 500 }
    )
  }
}
