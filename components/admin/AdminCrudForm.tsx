'use client'

import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export type AdminFieldType =
  | 'text'
  | 'email'
  | 'url'
  | 'textarea'
  | 'number'
  | 'checkbox'
  | 'select'
  | 'array'
  | 'date'
  | 'datetime'

export interface AdminFieldOption {
  label: string
  value: string
}

export interface AdminFieldConfig {
  name: string
  label: string
  type: AdminFieldType
  required?: boolean
  placeholder?: string
  helpText?: string
  rows?: number
  options?: AdminFieldOption[]
}

interface AdminCrudFormProps {
  title: string
  resourceName: string
  apiPath: string
  listPath: string
  fields: AdminFieldConfig[]
  id?: string
  defaultValues?: Record<string, any>
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

function formatDateTimeLocal(value: any) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  const offset = date.getTimezoneOffset()
  const localDate = new Date(date.getTime() - offset * 60 * 1000)
  return localDate.toISOString().slice(0, 16)
}

function normalizeIncomingValue(field: AdminFieldConfig, value: any) {
  if (value === undefined || value === null) {
    return field.type === 'checkbox' ? false : ''
  }

  if (field.type === 'array') {
    return Array.isArray(value) ? value.join('\n') : String(value)
  }

  if (field.type === 'datetime') {
    return formatDateTimeLocal(value)
  }

  if (field.type === 'date') {
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? String(value) : date.toISOString().slice(0, 10)
  }

  return value
}

function normalizeOutgoingValue(field: AdminFieldConfig, value: any) {
  if (field.type === 'array') {
    if (!value) return []
    return String(value)
      .split(/[\n,]+/)
      .map((item) => item.trim())
      .filter(Boolean)
  }

  if (field.type === 'number') {
    if (value === '' || value === null || value === undefined) return undefined
    const numberValue = Number(value)
    return Number.isNaN(numberValue) ? undefined : numberValue
  }

  if (field.type === 'checkbox') {
    return Boolean(value)
  }

  if (value === '') {
    return undefined
  }

  return value
}

export default function AdminCrudForm({
  title,
  resourceName,
  apiPath,
  listPath,
  fields,
  id,
  defaultValues = {},
}: AdminCrudFormProps) {
  const router = useRouter()
  const isEditMode = Boolean(id)
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    const initialData: Record<string, any> = {}
    fields.forEach((field) => {
      initialData[field.name] = normalizeIncomingValue(field, defaultValues[field.name])
    })
    return initialData
  })
  const [loading, setLoading] = useState(isEditMode)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const pageTitle = useMemo(() => {
    return `${isEditMode ? 'Edit' : 'Create'} ${resourceName}`
  }, [isEditMode, resourceName])

  useEffect(() => {
    if (!id) return

    const fetchItem = async () => {
      try {
        setLoading(true)
        setError('')
        const { data } = await axios.get(`${apiPath}?id=${id}`)
        const item = data.data || {}
        const nextData: Record<string, any> = {}
        fields.forEach((field) => {
          nextData[field.name] = normalizeIncomingValue(field, item[field.name])
        })
        setFormData(nextData)
      } catch (err: any) {
        setError(err?.response?.data?.message || `Failed to load ${resourceName.toLowerCase()}`)
      } finally {
        setLoading(false)
      }
    }

    fetchItem()
  }, [apiPath, fields, id, resourceName])

  const handleChange = (name: string, value: any) => {
    setFormData((previous) => {
      const nextData = { ...previous, [name]: value }

      if (name === 'title' && 'slug' in nextData && !previous.slug) {
        nextData.slug = slugify(String(value))
      }

      return nextData
    })
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const payload: Record<string, any> = {}

      fields.forEach((field) => {
        payload[field.name] = normalizeOutgoingValue(field, formData[field.name])
      })

      if (!payload.slug && payload.title) {
        payload.slug = slugify(String(payload.title))
      }

      if (isEditMode) {
        await axios.put(apiPath, { id, ...payload })
        setSuccess(`${resourceName} updated successfully`)
      } else {
        await axios.post(apiPath, payload)
        setSuccess(`${resourceName} created successfully`)
      }

      setTimeout(() => {
        router.push(listPath)
        router.refresh()
      }, 700)
    } catch (err: any) {
      setError(err?.response?.data?.message || `Failed to save ${resourceName.toLowerCase()}`)
    } finally {
      setSaving(false)
    }
  }

  const renderField = (field: AdminFieldConfig) => {
    const value = formData[field.name]
    const baseClass = 'input-field'

    if (field.type === 'textarea' || field.type === 'array') {
      return (
        <textarea
          id={field.name}
          value={value || ''}
          onChange={(event) => handleChange(field.name, event.target.value)}
          required={field.required}
          placeholder={field.placeholder}
          rows={field.rows || (field.type === 'array' ? 5 : 4)}
          className={baseClass}
        />
      )
    }

    if (field.type === 'select') {
      return (
        <select
          id={field.name}
          value={value || ''}
          onChange={(event) => handleChange(field.name, event.target.value)}
          required={field.required}
          className={baseClass}
        >
          <option value="">Select {field.label}</option>
          {(field.options || []).map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )
    }

    if (field.type === 'checkbox') {
      return (
        <label className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 dark:border-gray-700 dark:bg-dark-900 dark:text-gray-300">
          <input
            id={field.name}
            type="checkbox"
            checked={Boolean(value)}
            onChange={(event) => handleChange(field.name, event.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span>{field.placeholder || field.label}</span>
        </label>
      )
    }

    const inputType = field.type === 'datetime' ? 'datetime-local' : field.type

    return (
      <input
        id={field.name}
        type={inputType}
        value={value || ''}
        onChange={(event) => handleChange(field.name, event.target.value)}
        required={field.required}
        placeholder={field.placeholder}
        className={baseClass}
      />
    )
  }

  if (loading) {
    return (
      <div className="rounded-2xl bg-white p-8 shadow dark:bg-dark-800">
        <div className="h-8 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="mt-6 space-y-4">
          <div className="h-12 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-12 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-primary-600 dark:text-primary-400">
            {title}
          </p>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{pageTitle}</h1>
        </div>
        <button
          type="button"
          onClick={() => router.push(listPath)}
          className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-dark-700"
        >
          Back to list
        </button>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-6 shadow dark:bg-dark-800 sm:p-8">
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900/60 dark:bg-green-950/30 dark:text-green-300">
            {success}
          </div>
        )}

        <div className="grid gap-5 md:grid-cols-2">
          {fields.map((field) => {
            const wide = field.type === 'textarea' || field.type === 'array' || field.name === 'description' || field.name === 'content'

            return (
              <div key={field.name} className={wide ? 'md:col-span-2' : ''}>
                {field.type !== 'checkbox' && (
                  <label htmlFor={field.name} className="mb-2 block text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {field.label}
                    {field.required && <span className="text-red-500"> *</span>}
                  </label>
                )}
                {renderField(field)}
                {field.helpText && (
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{field.helpText}</p>
                )}
              </div>
            )
          })}
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => router.push(listPath)}
            className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-dark-700"
          >
            Cancel
          </button>
          <button type="submit" disabled={saving} className="btn-primary disabled:cursor-not-allowed disabled:opacity-60">
            {saving ? 'Saving...' : isEditMode ? `Update ${resourceName}` : `Create ${resourceName}`}
          </button>
        </div>
      </form>
    </div>
  )
}
