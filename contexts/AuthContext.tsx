'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { IUser, UserRole } from '@/types/auth'
import axios from 'axios'

interface AuthContextType {
  user: IUser | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string, role: UserRole) => Promise<void>
  logout: () => Promise<void>
  fetchUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get('/api/auth/profile')
      const profile = data.user || data.data || null
      setUser(profile)
      setIsAuthenticated(Boolean(profile))
      setError(null)
    } catch (err: any) {
      setUser(null)
      setIsAuthenticated(false)
      if (err.response?.status !== 401) {
        setError(err.response?.data?.message || 'Failed to fetch user')
      }
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)
      const { data } = await axios.post('/api/auth/login', { email, password })
      setUser(data.user || data.data)
      setIsAuthenticated(true)
    } catch (err: any) {
      const message = err.response?.data?.message || 'Login failed'
      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }

  const register = async (email: string, password: string, name: string, role: UserRole) => {
    try {
      setLoading(true)
      setError(null)
      const { data } = await axios.post('/api/auth/register', {
        email,
        password,
        name,
        role,
      })
      setUser(data.user || data.data)
      setIsAuthenticated(true)
    } catch (err: any) {
      const message = err.response?.data?.message || 'Registration failed'
      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setLoading(true)
      await axios.post('/api/auth/logout')
      setUser(null)
      setIsAuthenticated(false)
      setError(null)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Logout failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isAuthenticated,
        login,
        register,
        logout,
        fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
