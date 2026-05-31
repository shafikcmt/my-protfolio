'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import { Pencil, Plus, RefreshCw, Search, Trash2 } from 'lucide-react'
import ProtectedRoute from '@/components/ProtectedRoute'
import DashboardLayout from '@/components/DashboardLayout'
import EmptyState from '@/components/EmptyState'
import LoadingSpinner from '@/components/LoadingSpinner'
import {
  getAdminResourceConfig,
  type AdminResourceColumn,
} from '@/components/admin/adminResourceConfig'

// ─── Badge colour map ─────────────────────────────────────────────────────────
const BADGE_COLORS: Record<string, string> = {
  draft:         'bg-slate-100 text-slate-700',
  published:     'bg-emerald-100 text-emerald-700',
  archived:      'bg-amber-100 text-amber-700',
  pending:       'bg-amber-100 text-amber-700',
  discussing:    'bg-sky-100 text-sky-700',
  accepted:      'bg-teal-100 text-teal-700',
  in_progress:   'bg-violet-100 text-violet-700',
  testing:       'bg-orange-100 text-orange-700',
  delivered:     'bg-cyan-100 text-cyan-700',
  completed:     'bg-emerald-100 text-emerald-700',
  cancelled:     'bg-red-100 text-red-700',
  scheduled:     'bg-sky-100 text-sky-700',
  live:          'bg-emerald-100 text-emerald-700',
  ended:         'bg-slate-100 text-slate-600',
  active:        'bg-emerald-100 text-emerald-700',
  beginner:      'bg-sky-100 text-sky-700',
  intermediate:  'bg-violet-100 text-violet-700',
  advanced:      'bg-amber-100 text-amber-700',
  expert:        'bg-rose-100 text-rose-700',
  new:           'bg-sky-100 text-sky-700',
  read:          'bg-slate-100 text-slate-600',
  replied:       'bg-emerald-100 text-emerald-700',
  admin:         'bg-rose-100 text-rose-700',
  client:        'bg-violet-100 text-violet-700',
  student:       'bg-sky-100 text-sky-700',
  requested:     'bg-amber-100 text-amber-700',
  approved:      'bg-teal-100 text-teal-700',
  confirmed:     'bg-teal-100 text-teal-700',
  rejected:      'bg-red-100 text-red-700',
}

// ─── Cell renderer ────────────────────────────────────────────────────────────
function renderCell(col: AdminResourceColumn, value: unknown, _row: Record<string, unknown>) {
  const { type } = col

  if (type === 'boolean') {
    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
          value ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
        }`}
      >
        {value ? 'Yes' : 'No'}
      </span>
    )
  }

  if (type === 'badge') {
    const str = String(value ?? '').toLowerCase().replace(/[\s-]/g, '_')
    const colorClass = BADGE_COLORS[str] ?? 'bg-slate-100 text-slate-700'
    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${colorClass}`}
      >
        {String(value ?? '').replace(/[_-]/g, ' ')}
      </span>
    )
  }

  if (type === 'date') {
    if (!value) return <span className="text-slate-400">—</span>
    try {
      return (
        <span className="whitespace-nowrap text-slate-600">
          {new Date(value as string).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </span>
      )
    } catch {
      return <span className="text-slate-400">—</span>
    }
  }

  if (type === 'array') {
    const arr: string[] = Array.isArray(value) ? (value as string[]) : []
    if (!arr.length) return <span className="text-slate-400">—</span>
    return (
      <div className="flex flex-wrap gap-1">
        {arr.slice(0, 3).map((item, i) => (
          <span
            key={i}
            className="rounded-md bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600"
          >
            {item}
          </span>
        ))}
        {arr.length > 3 && (
          <span className="text-xs text-slate-400">+{arr.length - 3}</span>
        )}
      </div>
    )
  }

  if (type === 'relation') {
    if (!value) return <span className="text-slate-400">—</span>
    if (typeof value === 'object' && value !== null) {
      const obj = value as Record<string, unknown>
      const label = obj.title ?? obj.name ?? obj.email
      return (
        <span className="text-sm text-slate-700">
          {label ? String(label) : String(obj._id ?? '').slice(-8)}
        </span>
      )
    }
    return (
      <span className="font-mono text-xs text-slate-500">{String(value).slice(-8)}</span>
    )
  }

  if (type === 'email') {
    return <span className="text-sm text-slate-700">{String(value ?? '—')}</span>
  }

  if (value === null || value === undefined || value === '') {
    return <span className="text-slate-400">—</span>
  }

  const str = String(value)
  return (
    <span className="block max-w-[220px] truncate text-slate-700" title={str}>
      {str}
    </span>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminResourceListPage() {
  const params = useParams()
  const router = useRouter()
  const resource = String(params.resource ?? '')
  const config = getAdminResourceConfig(resource)

  const [items, setItems] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState('')
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')

  const fetchItems = useCallback(async () => {
    if (!config) return
    try {
      setLoading(true)
      setError('')
      const { data } = await axios.get(config.apiPath)
      setItems(data.data ?? [])
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } }
      setError(axiosErr?.response?.data?.message ?? `Failed to load ${config.title.toLowerCase()}`)
    } finally {
      setLoading(false)
    }
  }, [config])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const filtered = useMemo(() => {
    if (!search.trim()) return items
    const q = search.toLowerCase()
    return items.filter((item) =>
      config?.columns.some((col) => {
        const val = item[col.key]
        return val != null && String(val).toLowerCase().includes(q)
      })
    )
  }, [items, search, config])

  const handleDelete = async (id: string) => {
    if (!confirm(`Delete this ${config?.singular.toLowerCase()}? This cannot be undone.`)) return
    try {
      setDeletingId(id)
      await axios.delete(config!.apiPath, { data: { id } })
      setItems((prev) => prev.filter((item) => String(item._id ?? item.id) !== id))
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } }
      alert(axiosErr?.response?.data?.message ?? 'Failed to delete item')
    } finally {
      setDeletingId('')
    }
  }

  if (!config) {
    return (
      <ProtectedRoute requiredRoles={['admin']}>
        <DashboardLayout title="Admin">
          <EmptyState
            title="Resource not found"
            message="This admin resource page does not exist."
            actionLabel="Back to Dashboard"
            onAction={() => router.push('/dashboard/admin')}
          />
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute requiredRoles={['admin']}>
      <DashboardLayout
        title={config.title}
        breadcrumbs={[
          { label: 'Admin Dashboard', href: '/dashboard/admin' },
          { label: config.title, href: config.listPath },
        ]}
      >
        <div className="space-y-5">

          {/* ── Header ── */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900">
                {config.title}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                {loading ? 'Loading…' : `${items.length} total`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={fetchItems}
                disabled={loading}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-teal-300 hover:text-teal-600 disabled:opacity-40"
                title="Refresh"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <Link
                href={`${config.listPath}/new`}
                className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-teal-500"
              >
                <Plus className="h-4 w-4" />
                {config.addLabel ?? `Add ${config.singular}`}
              </Link>
            </div>
          </div>

          {/* ── Search ── */}
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${config.title.toLowerCase()}…`}
              className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
            />
          </div>

          {/* ── Error ── */}
          {error && (
            <div className="flex items-center justify-between rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <span>{error}</span>
              <button onClick={fetchItems} className="font-semibold underline">
                Retry
              </button>
            </div>
          )}

          {/* ── Content ── */}
          {loading ? (
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-14 text-center shadow-sm">
              <LoadingSpinner />
              <p className="mt-4 text-sm text-slate-500">
                Loading {config.title.toLowerCase()}…
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              title={
                search
                  ? `No results for "${search}"`
                  : `No ${config.title.toLowerCase()} yet`
              }
              message={
                search
                  ? 'Try a different search term.'
                  : `Add your first ${config.singular.toLowerCase()} to get started.`
              }
              actionLabel={
                !search ? (config.addLabel ?? `Add ${config.singular}`) : undefined
              }
              onAction={
                !search
                  ? () => router.push(`${config.listPath}/new`)
                  : undefined
              }
            />
          ) : (
            <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px]">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/80">
                      {config.columns.map((col) => (
                        <th
                          key={col.key}
                          className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-[0.14em] text-slate-500"
                        >
                          {col.label}
                        </th>
                      ))}
                      <th className="px-5 py-3.5 text-right text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.map((item) => {
                      const id = String(item._id ?? item.id ?? '')
                      const isDeleting = deletingId === id
                      return (
                        <tr
                          key={id}
                          className={`transition hover:bg-slate-50/60 ${isDeleting ? 'opacity-40' : ''}`}
                        >
                          {config.columns.map((col) => (
                            <td
                              key={`${id}-${col.key}`}
                              className="px-5 py-3.5 text-sm"
                            >
                              {renderCell(col, item[col.key], item)}
                            </td>
                          ))}
                          <td className="px-5 py-3.5">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                href={`${config.listPath}/${id}`}
                                className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700 transition hover:bg-teal-100"
                              >
                                <Pencil className="h-3 w-3" />
                                Edit
                              </Link>
                              <button
                                onClick={() => handleDelete(id)}
                                disabled={isDeleting}
                                className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                              >
                                <Trash2 className="h-3 w-3" />
                                {isDeleting ? '…' : 'Delete'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <div className="border-t border-slate-100 px-5 py-3 text-xs text-slate-400">
                Showing {filtered.length} of {items.length}{' '}
                {config.title.toLowerCase()}
                {search ? ' (filtered)' : ''}
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
