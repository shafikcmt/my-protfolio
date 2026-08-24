'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import {
  MessageSquare,
  Search,
  RefreshCw,
  Eye,
  Trash2,
  X,
  Mail,
  Phone,
  MessageCircle,
  Tag,
  DollarSign,
  Clock,
  FileText,
  StickyNote,
  ChevronDown,
  Inbox,
} from 'lucide-react'
import ProtectedRoute from '@/components/ProtectedRoute'
import DashboardLayout from '@/components/DashboardLayout'
import LoadingSpinner from '@/components/LoadingSpinner'
import EmptyState from '@/components/EmptyState'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ContactInquiry {
  _id: string
  name: string
  email?: string
  phone?: string
  inquiryType?: string
  serviceNeeded?: string
  budget?: string
  timeline?: string
  subject: string
  message: string
  preferredContact?: string
  status: string
  read: boolean
  adminNote?: string
  createdAt: string
  updatedAt: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_OPTIONS = [
  { value: 'new', label: 'New' },
  { value: 'read', label: 'Read' },
  { value: 'replied', label: 'Replied' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'closed', label: 'Closed' },
]

const INQUIRY_TYPE_OPTIONS = [
  { value: '', label: 'All Types' },
  { value: 'hire_me', label: 'Hire Me' },
  { value: 'project_inquiry', label: 'Project Inquiry' },
  { value: 'course_training', label: 'Course / Training' },
  { value: 'consultation', label: 'Consultation' },
  { value: 'support', label: 'Support' },
  { value: 'other', label: 'Other' },
]

const INQUIRY_TYPE_LABELS: Record<string, string> = {
  hire_me: 'Hire Me',
  project_inquiry: 'Project Inquiry',
  course_training: 'Course / Training',
  consultation: 'Consultation',
  support: 'Support',
  other: 'Other',
}

const STATUS_BADGE: Record<string, { bg: string; text: string }> = {
  new:         { bg: 'bg-sky-50',     text: 'text-sky-700' },
  read:        { bg: 'bg-slate-100',  text: 'text-slate-600' },
  replied:     { bg: 'bg-emerald-50', text: 'text-emerald-700' },
  in_progress: { bg: 'bg-violet-50',  text: 'text-violet-700' },
  converted:   { bg: 'bg-teal-50',    text: 'text-teal-700' },
  closed:      { bg: 'bg-slate-100',  text: 'text-slate-500' },
  archived:    { bg: 'bg-amber-50',   text: 'text-amber-700' },
}

const INQUIRY_BADGE: Record<string, { bg: string; text: string }> = {
  hire_me:         { bg: 'bg-violet-50',  text: 'text-violet-700' },
  project_inquiry: { bg: 'bg-sky-50',     text: 'text-sky-700' },
  course_training: { bg: 'bg-amber-50',   text: 'text-amber-700' },
  consultation:    { bg: 'bg-indigo-50',  text: 'text-indigo-700' },
  support:         { bg: 'bg-rose-50',    text: 'text-rose-700' },
  other:           { bg: 'bg-slate-100',  text: 'text-slate-600' },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDate(d: string) {
  try {
    return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return '—'
  }
}

function fmtDateTime(d: string) {
  try {
    return new Date(d).toLocaleString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  } catch {
    return '—'
  }
}

function StatusBadge({ status }: { status: string }) {
  const c = STATUS_BADGE[status] ?? { bg: 'bg-slate-100', text: 'text-slate-600' }
  const label = STATUS_OPTIONS.find((s) => s.value === status)?.label ?? status
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${c.bg} ${c.text}`}>
      {label}
    </span>
  )
}

function InquiryBadge({ type }: { type?: string }) {
  if (!type) return <span className="text-slate-400">—</span>
  const c = INQUIRY_BADGE[type] ?? { bg: 'bg-slate-100', text: 'text-slate-600' }
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${c.bg} ${c.text}`}>
      {INQUIRY_TYPE_LABELS[type] ?? type}
    </span>
  )
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────

function DetailModal({
  item,
  onClose,
  onStatusUpdate,
  onDelete,
}: {
  item: ContactInquiry
  onClose: () => void
  onStatusUpdate: (id: string, status: string, adminNote: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
}) {
  const [status, setStatus] = useState(item.status)
  const [adminNote, setAdminNote] = useState(item.adminNote ?? '')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      await onStatusUpdate(item._id, status, adminNote)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this inquiry? This cannot be undone.')) return
    setDeleting(true)
    try {
      await onDelete(item._id)
      onClose()
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 px-4 py-8 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-[1.75rem] border border-slate-200 bg-white shadow-2xl">

        {/* Modal header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-7 py-5">
          <div>
            <h2 className="text-lg font-black text-slate-900">{item.name}</h2>
            <p className="mt-0.5 text-sm text-slate-500">{fmtDateTime(item.createdAt)}</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-7 py-6 space-y-6">

          {/* Contact info row */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {item.email && (
              <a href={`mailto:${item.email}`} className="group flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition hover:border-teal-200 hover:bg-teal-50">
                <Mail className="h-4 w-4 text-slate-400 group-hover:text-teal-500" />
                <div className="min-w-0">
                  <p className="text-xs text-slate-400">Email</p>
                  <p className="truncate text-sm font-medium text-slate-800">{item.email}</p>
                </div>
              </a>
            )}
            {item.phone && (
              <a href={`tel:${item.phone}`} className="group flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition hover:border-teal-200 hover:bg-teal-50">
                <Phone className="h-4 w-4 text-slate-400 group-hover:text-teal-500" />
                <div>
                  <p className="text-xs text-slate-400">Phone</p>
                  <p className="text-sm font-medium text-slate-800">{item.phone}</p>
                </div>
              </a>
            )}
            {item.preferredContact && (
              <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <MessageCircle className="h-4 w-4 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-400">Prefers</p>
                  <p className="text-sm font-medium capitalize text-slate-800">{item.preferredContact}</p>
                </div>
              </div>
            )}
          </div>

          {/* Inquiry details */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl bg-slate-50 px-4 py-3">
              <p className="mb-1 flex items-center gap-1.5 text-xs text-slate-400"><Tag className="h-3 w-3" /> Type</p>
              <InquiryBadge type={item.inquiryType} />
            </div>
            {item.serviceNeeded && (
              <div className="rounded-xl bg-slate-50 px-4 py-3">
                <p className="mb-1 text-xs text-slate-400">Service</p>
                <p className="text-sm font-medium text-slate-800">{item.serviceNeeded}</p>
              </div>
            )}
            {item.budget && (
              <div className="rounded-xl bg-slate-50 px-4 py-3">
                <p className="mb-1 flex items-center gap-1.5 text-xs text-slate-400"><DollarSign className="h-3 w-3" /> Budget</p>
                <p className="text-sm font-medium text-slate-800">{item.budget}</p>
              </div>
            )}
            {item.timeline && (
              <div className="rounded-xl bg-slate-50 px-4 py-3">
                <p className="mb-1 flex items-center gap-1.5 text-xs text-slate-400"><Clock className="h-3 w-3" /> Timeline</p>
                <p className="text-sm font-medium text-slate-800">{item.timeline}</p>
              </div>
            )}
          </div>

          {/* Subject + Message */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
            <div className="mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4 text-slate-400" />
              <p className="text-sm font-bold text-slate-900">{item.subject}</p>
            </div>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600">{item.message}</p>
          </div>

          {/* Status update */}
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">Update Status</label>
            <div className="relative">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 pr-9 text-sm text-slate-800 outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-100"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          {/* Admin Note */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
              <StickyNote className="h-4 w-4 text-amber-500" />
              Internal Admin Note
            </label>
            <textarea
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              rows={3}
              placeholder="Add a private note about this inquiry (not visible to sender)..."
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-100"
            />
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-7 py-5">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center gap-1.5 rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Close
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-5 py-2 text-sm font-bold text-white transition hover:bg-teal-500 disabled:opacity-60"
            >
              {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ContactMessagesPage() {
  const [items, setItems] = useState<ContactInquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [selected, setSelected] = useState<ContactInquiry | null>(null)

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const { data } = await axios.get('/api/admin/contact-messages')
      setItems(data.data ?? [])
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Failed to load inquiries')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const handleStatusUpdate = async (id: string, status: string, adminNote: string) => {
    await axios.put('/api/admin/contact-messages', { id, status, adminNote })
    setItems((prev) =>
      prev.map((item) => (item._id === id ? { ...item, status, adminNote, read: status !== 'new' } : item))
    )
    if (selected?._id === id) {
      setSelected((prev) => prev ? { ...prev, status, adminNote, read: status !== 'new' } : null)
    }
  }

  const handleDelete = async (id: string) => {
    await axios.delete('/api/admin/contact-messages', { data: { id } })
    setItems((prev) => prev.filter((item) => item._id !== id))
  }

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (statusFilter && item.status !== statusFilter) return false
      if (typeFilter && item.inquiryType !== typeFilter) return false
      if (search.trim()) {
        const q = search.toLowerCase()
        return (
          item.name.toLowerCase().includes(q) ||
          (item.email ?? '').toLowerCase().includes(q) ||
          (item.phone ?? '').toLowerCase().includes(q) ||
          item.subject.toLowerCase().includes(q) ||
          item.message.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [items, search, statusFilter, typeFilter])

  const newCount = useMemo(() => items.filter((i) => i.status === 'new').length, [items])
  const inProgressCount = useMemo(() => items.filter((i) => i.status === 'in_progress').length, [items])
  const repliedCount = useMemo(() => items.filter((i) => i.status === 'replied').length, [items])

  return (
    <ProtectedRoute requiredRoles={['admin']}>
      <DashboardLayout
        title="Contact Inquiries"
        breadcrumbs={[
          { label: 'Admin Dashboard', href: '/dashboard/admin' },
          { label: 'Contact Inquiries', href: '/dashboard/admin/contact-messages' },
        ]}
      >
        <div className="space-y-6">

          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900">
                Contact Inquiries
                {newCount > 0 && (
                  <span className="ml-2.5 inline-flex items-center rounded-full bg-sky-100 px-2.5 py-0.5 text-sm font-bold text-sky-700">
                    {newCount} new
                  </span>
                )}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                {loading ? 'Loading…' : `${items.length} total inquiries`}
              </p>
            </div>
            <button
              onClick={fetchItems}
              disabled={loading}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-teal-300 hover:text-teal-600 disabled:opacity-40"
              title="Refresh"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: 'Total', count: items.length, color: 'text-slate-700', bg: 'bg-slate-50' },
              { label: 'New', count: newCount, color: 'text-sky-700', bg: 'bg-sky-50' },
              { label: 'In Progress', count: inProgressCount, color: 'text-violet-700', bg: 'bg-violet-50' },
              { label: 'Replied', count: repliedCount, color: 'text-emerald-700', bg: 'bg-emerald-50' },
            ].map((stat) => (
              <div
                key={stat.label}
                className={`rounded-2xl border border-slate-200 ${stat.bg} px-5 py-4`}
              >
                <p className={`text-2xl font-black ${stat.color}`}>{stat.count}</p>
                <p className="text-xs font-medium text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Search + Filters */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, phone, subject…"
                className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
              />
            </div>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none rounded-2xl border border-slate-200 bg-white py-3 pl-4 pr-9 text-sm text-slate-700 shadow-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
              >
                <option value="">All Statuses</option>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
            <div className="relative">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="appearance-none rounded-2xl border border-slate-200 bg-white py-3 pl-4 pr-9 text-sm text-slate-700 shadow-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
              >
                {INQUIRY_TYPE_OPTIONS.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center justify-between rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <span>{error}</span>
              <button onClick={fetchItems} className="font-semibold underline">Retry</button>
            </div>
          )}

          {/* Content */}
          {loading ? (
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-14 text-center shadow-sm">
              <LoadingSpinner />
              <p className="mt-4 text-sm text-slate-500">Loading inquiries…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
              <EmptyState
                title={search || statusFilter || typeFilter ? 'No results found' : 'No inquiries yet'}
                message={
                  search || statusFilter || typeFilter
                    ? 'Try adjusting your search or filters.'
                    : 'Contact inquiries from the website will appear here.'
                }
              />
            </div>
          ) : (
            <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/80">
                      {['Name', 'Contact', 'Type', 'Service', 'Budget', 'Status', 'Received', 'Action'].map((h) => (
                        <th
                          key={h}
                          className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-[0.14em] text-slate-500 last:text-right"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.map((item) => (
                      <tr
                        key={item._id}
                        className={`transition hover:bg-slate-50/60 ${!item.read ? 'bg-sky-50/30' : ''}`}
                      >
                        {/* Name */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            {!item.read && (
                              <span className="h-2 w-2 flex-shrink-0 rounded-full bg-sky-400" title="Unread" />
                            )}
                            <span className="block max-w-[150px] truncate text-sm font-semibold text-slate-800" title={item.name}>
                              {item.name}
                            </span>
                          </div>
                        </td>
                        {/* Contact */}
                        <td className="px-5 py-3.5">
                          <div className="space-y-0.5">
                            {item.email && (
                              <p className="truncate text-xs text-slate-600" title={item.email}>{item.email}</p>
                            )}
                            {item.phone && (
                              <p className="text-xs text-slate-500">{item.phone}</p>
                            )}
                          </div>
                        </td>
                        {/* Type */}
                        <td className="px-5 py-3.5">
                          <InquiryBadge type={item.inquiryType} />
                        </td>
                        {/* Service */}
                        <td className="px-5 py-3.5">
                          <span className="block max-w-[120px] truncate text-sm text-slate-600" title={item.serviceNeeded}>
                            {item.serviceNeeded || <span className="text-slate-400">—</span>}
                          </span>
                        </td>
                        {/* Budget */}
                        <td className="px-5 py-3.5 text-sm text-slate-600">
                          {item.budget || <span className="text-slate-400">—</span>}
                        </td>
                        {/* Status */}
                        <td className="px-5 py-3.5">
                          <StatusBadge status={item.status} />
                        </td>
                        {/* Date */}
                        <td className="whitespace-nowrap px-5 py-3.5 text-sm text-slate-500">
                          {fmtDate(item.createdAt)}
                        </td>
                        {/* Action */}
                        <td className="px-5 py-3.5 text-right">
                          <button
                            onClick={() => setSelected(item)}
                            className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700 transition hover:bg-teal-100"
                          >
                            <Eye className="h-3 w-3" />
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="border-t border-slate-100 px-5 py-3 text-xs text-slate-400">
                Showing {filtered.length} of {items.length} inquiries
                {(search || statusFilter || typeFilter) ? ' (filtered)' : ''}
              </div>
            </div>
          )}
        </div>

        {/* Detail modal */}
        {selected && (
          <DetailModal
            item={selected}
            onClose={() => setSelected(null)}
            onStatusUpdate={handleStatusUpdate}
            onDelete={handleDelete}
          />
        )}
      </DashboardLayout>
    </ProtectedRoute>
  )
}
