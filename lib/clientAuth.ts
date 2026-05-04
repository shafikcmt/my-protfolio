import { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { DecodedToken } from '@/types/auth'

export function withClientAuth(request: NextRequest): DecodedToken | null {
  const token = request.cookies.get('token')?.value
  if (!token) return null

  const decoded = verifyToken(token)
  if (!decoded || decoded.role !== 'client') return null

  return decoded
}

export function withStudentAuth(request: NextRequest): DecodedToken | null {
  const token = request.cookies.get('token')?.value
  if (!token) return null

  const decoded = verifyToken(token)
  if (!decoded || decoded.role !== 'student') return null

  return decoded
}

export function withAnyAuth(request: NextRequest): DecodedToken | null {
  const token = request.cookies.get('token')?.value
  if (!token) return null

  return verifyToken(token)
}
