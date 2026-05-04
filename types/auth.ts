export type UserRole = 'admin' | 'client' | 'student'

export interface IUser {
  _id?: string
  id?: string
  name: string
  email: string
  password?: string
  role: UserRole
  isActive?: boolean
  createdAt?: string | Date
  updatedAt?: string | Date
  matchPassword?: (enteredPassword: string) => Promise<boolean>
}

export interface DecodedToken {
  id: string
  email: string
  role: UserRole
  iat?: number
  exp?: number
}
