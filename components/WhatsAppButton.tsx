'use client'

import { AUTHOR_NAME } from '@/lib/constants'

export default function WhatsAppButton() {
  const phone = '+1234567890'
  const message = encodeURIComponent(`Hi ${AUTHOR_NAME}, I would like to discuss a new project opportunity.`)
  const href = `https://wa.me/${phone.replace(/\D/g, '')}?text=${message}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full bg-green-600 px-4 py-3 text-white shadow-xl shadow-green-500/20 hover:bg-green-700 transition-colors"
      aria-label="Contact via WhatsApp"
    >
      <span className="text-xl">💬</span>
      <span className="hidden sm:inline-block font-medium">WhatsApp</span>
    </a>
  )
}
