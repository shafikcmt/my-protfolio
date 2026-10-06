'use client'

import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { ArrowLeft, CheckCircle2, Loader2, Save } from 'lucide-react'
import MediaUploadField from './MediaUploadField'

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
  | 'image'
  | 'gallery'
  | 'video'

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
  /** Groups fields into titled cards. Fields without a section go under "Details". */
  section?: string
  /** Render the field in the sticky "Publish" sidebar instead of the main column. */
  side?: boolean
  /** Force the field to span the full width of its section. */
  wide?: boolean
  /**
   * array fields only: legacy array fields folded into this one on load as
   * "## Heading" groups, and cleared on save.
   */
  mergeFrom?: { name: string; heading: string }[]
}

export interface AdminSectionConfig {
  title: string
  description?: string
}

interface AdminCrudFormProps {
  title: string
  resourceName: string
  apiPath: string
  listPath: string
  fields: AdminFieldConfig[]
  id?: string
  defaultValues?: Record<string, any>
  /** Optional ordered section metadata (title -> description). */
  sections?: AdminSectionConfig[]
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

  if (field.type === 'array' || field.type === 'gallery') {
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

/** One item per line; a single line may be comma separated ("Laravel, MySQL"). */
function splitList(value: any) {
  const text = String(value || '')
  return text
    .split(text.includes('\n') ? /\n+/ : /,+/)
    .map((item) => item.trim())
    .filter(Boolean)
}

/** Reads a field's value from a saved item, folding in any legacy `mergeFrom` arrays. */
function readItemValue(field: AdminFieldConfig, item: Record<string, any>) {
  if (!field.mergeFrom?.length) return item[field.name]
  const lines: string[] = Array.isArray(item[field.name]) ? [...item[field.name]] : []
  field.mergeFrom.forEach(({ name, heading }) => {
    const extra = Array.isArray(item[name]) ? item[name].filter(Boolean) : []
    if (!extra.length) return
    if (lines.length) lines.push('')
    lines.push(`## ${heading}`, ...extra)
  })
  return lines
}

function normalizeOutgoingValue(field: AdminFieldConfig, value: any) {
  if (field.type === 'array' || field.type === 'gallery') {
    if (!value) return []
    return splitList(value)
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
  sections = [],
}: AdminCrudFormProps) {
  const router = useRouter()
  const isEditMode = Boolean(id)
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    const initialData: Record<string, any> = {}
    fields.forEach((field) => {
      initialData[field.name] = normalizeIncomingValue(field, readItemValue(field, defaultValues))
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
          nextData[field.name] = normalizeIncomingValue(field, readItemValue(field, item))
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
        // Legacy fields were folded into this one on load, so clear them.
        field.mergeFrom?.forEach(({ name }) => { payload[name] = [] })
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

    if (field.type === 'image' || field.type === 'gallery' || field.type === 'video') {
      return (
        <MediaUploadField
          id={field.name}
          kind={field.type}
          value={value || ''}
          onChange={(next) => handleChange(field.name, next)}
          folder={listPath.split('/').filter(Boolean).pop()}
          placeholder={field.placeholder}
        />
      )
    }

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
        <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
          <input
            id={field.name}
            type="checkbox"
            checked={Boolean(value)}
            onChange={(event) => handleChange(field.name, event.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
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
      <div className="rounded-2xl bg-white p-8 shadow-sm">
        <div className="h-8 w-48 animate-pulse rounded bg-slate-100" />
        <div className="mt-6 space-y-4">
          <div className="h-12 animate-pulse rounded bg-slate-100" />
          <div className="h-32 animate-pulse rounded bg-slate-100" />
          <div className="h-12 animate-pulse rounded bg-slate-100" />
        </div>
      </div>
    )
  }

  const mainFields = fields.filter((field) => !field.side)
  const sideFields = fields.filter((field) => field.side)

  // Preserve declared section order, then any extra sections in field order.
  const sectionOrder = [
    ...sections.map((section) => section.title),
    ...mainFields.map((field) => field.section || 'Details'),
  ].filter((title, index, all) => all.indexOf(title) === index)
  const groupedSections = sectionOrder
    .map((title) => ({
      title,
      description: sections.find((section) => section.title === title)?.description,
      fields: mainFields.filter((field) => (field.section || 'Details') === title),
    }))
    .filter((section) => section.fields.length > 0)

  const renderFieldBlock = (field: AdminFieldConfig, inSidebar = false) => {
    const wide =
      inSidebar ||
      field.wide ||
      ['textarea', 'array', 'image', 'gallery', 'video'].includes(field.type) ||
      field.name === 'description' ||
      field.name === 'content'
    const listItems =
      field.type === 'array'
        ? splitList(formData[field.name]).filter((item) => !item.startsWith('#'))
        : []

    return (
      <div key={field.name} className={wide ? 'md:col-span-2' : ''}>
        {field.type !== 'checkbox' && (
          <label htmlFor={field.name} className="mb-1.5 flex items-center justify-between gap-2 text-sm font-semibold text-slate-800">
            <span>
              {field.label}
              {field.required && <span className="text-red-500"> *</span>}
            </span>
            {field.type === 'array' && listItems.length > 0 && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                {listItems.length} item{listItems.length > 1 ? 's' : ''}
              </span>
            )}
          </label>
        )}
        {renderField(field)}
        {field.helpText && <p className="mt-1.5 text-xs leading-5 text-slate-500">{field.helpText}</p>}
        {field.type === 'array' && listItems.length > 0 && /technolog|tag|skill/i.test(field.name) && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {listItems.slice(0, 20).map((item, index) => (
              <span key={`${item}-${index}`} className="rounded-full border border-teal-100 bg-teal-50 px-2.5 py-0.5 text-xs font-medium text-teal-700">
                {item}
              </span>
            ))}
          </div>
        )}
      </div>
    )
  }

  const actionButtons = (
    <div className="flex flex-col gap-2.5">
      <button
        type="submit"
        disabled={saving}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        {saving ? 'Saving…' : isEditMode ? `Update ${resourceName}` : `Create ${resourceName}`}
      </button>
      <button
        type="button"
        onClick={() => router.push(listPath)}
        className="w-full rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
      >
        Cancel
      </button>
    </div>
  )

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.push(listPath)}
          aria-label="Back to list"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-teal-200 hover:text-teal-700"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-teal-600">{title}</p>
          <h1 className="truncate text-xl font-bold text-slate-900 sm:text-2xl">{pageTitle}</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
        <div className="space-y-6">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          )}
          {success && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              <CheckCircle2 className="h-4 w-4" /> {success}
            </div>
          )}

          {groupedSections.map((section) => (
            <section key={section.title} className="rounded-2xl border border-slate-200/80 bg-white shadow-sm">
              <header className="border-b border-slate-100 px-5 py-4 sm:px-6">
                <h2 className="text-base font-bold text-slate-900">{section.title}</h2>
                {section.description && <p className="mt-0.5 text-xs text-slate-500">{section.description}</p>}
              </header>
              <div className="grid gap-5 p-5 sm:p-6 md:grid-cols-2">
                {section.fields.map((field) => renderFieldBlock(field))}
              </div>
            </section>
          ))}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24">
          <section className="rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            <header className="border-b border-slate-100 px-5 py-4">
              <h2 className="text-base font-bold text-slate-900">Publish</h2>
            </header>
            <div className="space-y-5 p-5">
              {sideFields.map((field) => renderFieldBlock(field, true))}
              {actionButtons}
            </div>
          </section>
        </aside>
      </form>
    </div>
  )
}
