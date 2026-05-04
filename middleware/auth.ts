import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { UserRole } from '@/types/auth'

export async function withAuth(request: NextRequest, allowedRoles?: UserRole[]) {
  try {
    const token = request.cookies.get('token')?.value

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: No token provided' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Invalid token' },
        { status: 401 }
      )
    }

    if (allowedRoles && !allowedRoles.includes(decoded.role)) {
      return NextResponse.json(
        { success: false, message: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      )
    }

    return decoded
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Authentication failed' },
      { status: 401 }
    )
  }
}

export function createAuthResponse(
  success: boolean,
  message: string,
  data?: any,
  statusCode = 200
) {
  return NextResponse.json(
    {
      success,
      message,
      data,
    },
    { status: statusCode }
  )
}
