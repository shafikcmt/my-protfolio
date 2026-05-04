import jwt, { SignOptions, VerifyOptions } from 'jsonwebtoken'
import { DecodedToken, UserRole } from '@/types/auth'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d'

export const generateToken = (id: string, email: string, role: UserRole) => {
  return jwt.sign({ id, email, role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
  } as SignOptions)
}

export const verifyToken = (token: string): DecodedToken | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {} as VerifyOptions) as DecodedToken
    return decoded
  } catch (error) {
    return null
  }
}


export const decodeToken = (token: string): DecodedToken | null => {
  try {
    return jwt.decode(token) as DecodedToken
  } catch (error) {
    return null
  }
}
