'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import PasswordInput from '@/components/PasswordInput'

function ResetPasswordForm() {
  const token = useSearchParams().get('token') || ''
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password.length < 6) return setError('Password must be at least 6 characters')
    if (password !== confirmPassword) return setError('Passwords do not match')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.message || 'Reset failed')
      setDone(true)
    } catch (err: any) {
      setError(err.message || 'Reset failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-[0_4px_28px_rgba(15,23,42,0.10)]">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-black tracking-tight text-slate-900">Reset Password</h1>
            <p className="mt-2 text-sm text-slate-500">Choose a new password for your account</p>
          </div>

          {done ? (
            <div className="space-y-4 text-center">
              <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                Password updated. You can now sign in.
              </div>
              <Link href="/auth/login" className="btn-primary w-full">Go to Sign In</Link>
            </div>
          ) : !token ? (
            <div className="space-y-4 text-center">
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                This reset link is invalid.
              </div>
              <Link href="/auth/forgot-password" className="btn-secondary w-full">Request a new link</Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-slate-700">New Password</label>
                  <PasswordInput id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New password" required className="input-field" />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-semibold text-slate-700">Confirm Password</label>
                  <PasswordInput id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password" required className="input-field" />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50">
                  {loading ? 'Updating...' : 'Reset Password'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  )
}
