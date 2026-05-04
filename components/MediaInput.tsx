'use client'

import { useState } from 'react'

interface MediaInputProps {
  label: string
  value: string
  placeholder?: string
  onChange: (value: string) => void
  disabled?: boolean
}

export default function MediaInput({ label, value, placeholder, onChange, disabled = false }: MediaInputProps) {
  const [fileName, setFileName] = useState('')

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    onChange(URL.createObjectURL(file))
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <div className="grid gap-3 md:grid-cols-[1fr_auto]">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <label className={`inline-flex items-center justify-center rounded-lg border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-dark-800 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer hover:border-primary-600 hover:text-primary-600 transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
          Upload
          <input type="file" accept="image/*,video/*" onChange={handleFile} className="hidden" disabled={disabled} />
        </label>
      </div>
      {fileName && <p className="text-sm text-gray-500 dark:text-gray-400">Selected: {fileName}</p>}
    </div>
  )
}
