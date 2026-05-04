'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { IUser, UserRole } from '@/types/auth'
import axios from 'axios'

axios.defaults.withCredentials = true

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

  const normalizeUser = (data: any): IUser | null => {
    return data?.user || data?.data?.user || data?.data || null
  }

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true)
      const { data } = await axios.get('/api/auth/profile')
      const profileUser = normalizeUser(data)

      if (profileUser) {
        setUser(profileUser)
        setIsAuthenticated(true)
        setError(null)
      } else {
        setUser(null)
        setIsAuthenticated(false)
      }
    } catch (err: any) {
      setUser(null)
      setIsAuthenticated(false)
      if (err.response?.status !== 401) {
        setError(err.response?.data?.message || 'Failed to fetch user')
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)
      const { data } = await axios.post('/api/auth/login', { email, password })
      const loggedInUser = normalizeUser(data)

      if (!loggedInUser) {
        throw new Error('Login response did not include user data')
      }

      setUser(loggedInUser)
      setIsAuthenticated(true)
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Login failed'
      setUser(null)
      setIsAuthenticated(false)
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
      const registeredUser = normalizeUser(data)

      if (!registeredUser) {
        throw new Error('Registration response did not include user data')
      }

      setUser(registeredUser)
      setIsAuthenticated(true)
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Registration failed'
      setUser(null)
      setIsAuthenticated(false)
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
    } catch (err: any) {
      setError(err.response?.data?.message || 'Logout failed')
    } finally {
      setUser(null)
      setIsAuthenticated(false)
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
