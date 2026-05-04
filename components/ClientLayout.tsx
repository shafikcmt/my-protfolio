'use client'

import { ReactNode, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { AuthProvider } from '@/contexts/AuthContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'

export default function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [maintenance, setMaintenance] = useState(false)
  const [maintenanceMessage, setMaintenanceMessage] = useState('')

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings')
        const json = await response.json()
        if (json.success) {
          setMaintenance(Boolean(json.data?.maintenanceMode))
          setMaintenanceMessage(json.data?.maintenanceMessage || 'The site is currently in maintenance mode. Please check back soon.')
        }
      } catch (error) {
        console.error('Failed to fetch site settings:', error)
      }
    }

    fetchSettings()
  }, [])

  const isDashboard = pathname.startsWith('/dashboard')
  const isAuth = pathname.startsWith('/auth')
  const showLayout = !isDashboard && !isAuth

  return (
    <AuthProvider>
      {showLayout && <Navbar />}
      <main className="min-h-screen relative">
        {maintenance && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 text-center p-6">
            <div className="rounded-3xl bg-white dark:bg-dark-900 border border-gray-200 dark:border-gray-700 p-8 max-w-xl">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Maintenance Mode Enabled</h2>
              <p className="text-gray-600 dark:text-gray-400">{maintenanceMessage}</p>
            </div>
          </div>
        )}
        {children}
      </main>
      {showLayout && <Footer />}
      {showLayout && <WhatsAppButton />}
    </AuthProvider>
  )
}
