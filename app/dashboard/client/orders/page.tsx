'use client'

import { useEffect, useMemo, useState } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import DashboardLayout from '@/components/DashboardLayout'
import EmptyState from '@/components/EmptyState'
import OrderStatusTimeline from '@/components/OrderStatusTimeline'
import StatusBadge from '@/components/StatusBadge'
import axios from 'axios'
import { IProjectOrder } from '@/types/models'

const orderStatuses = ['pending', 'discussing', 'accepted', 'in_progress', 'testing', 'delivered', 'completed', 'cancelled']

function statusLabel(value?: string) {
  return (value || 'pending').replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export default function ClientOrdersPage() {
  const [orders, setOrders] = useState<IProjectOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [filter, setFilter] = useState('all')
  const [formData, setFormData] = useState({
    projectType: '', companyName: '', clientPhone: '', budgetRange: '',
    deadline: '', preferredTechnology: '', description: '',
    referenceLinks: '', attachmentUrl: '', meetingPreference: 'Google Meet',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => { fetchOrders() }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get('/api/client/orders')
      setOrders(data.data || [])
    } catch (err) {
      console.error('Fetch orders failed:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredOrders = useMemo(() => {
    if (filter === 'all') return orders
    return orders.filter((o) => (o.status || 'pending') === filter)
  }, [orders, filter])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSubmitting(true)
    if (!formData.projectType || !formData.description) {
      setSubmitting(false)
      return setError('Project type and description are required.')
    }
    try {
      const response = await axios.post('/api/client/orders', {
        ...formData,
        referenceLinks: formData.referenceLinks.split(',').map((l) => l.trim()).filter(Boolean),
      })
      setOrders((prev) => [response.data.data, ...prev])
      setSuccess('Project order submitted successfully. You can now track it from this page.')
      setFormData({ projectType: '', companyName: '', clientPhone: '', budgetRange: '', deadline: '', preferredTechnology: '', description: '', referenceLinks: '', attachmentUrl: '', meetingPreference: 'Google Meet' })
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to submit order')
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancel = async (id: string) => {
    if (!confirm('Do you want to cancel this order?')) return
    try {
      const { data } = await axios.put('/api/client/orders', { id, status: 'cancelled' })
      setOrders((prev) => prev.map((o) => (o._id === id ? data.data : o)))
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Cancel order failed')
    }
  }

  return (
    <ProtectedRoute requiredRoles={['client']}>
      <DashboardLayout
        title="Project Orders"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard/client' },
          { label: 'Orders', href: '/dashboard/client/orders' },
        ]}
      >
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.15fr_0.85fr]">

          {/* ── Order list ── */}
          <section className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Order Tracking</h2>
                  <p className="mt-1 text-sm text-slate-500">Follow every step from request to delivery.</p>
                </div>
                <select value={filter} onChange={(e) => setFilter(e.target.value)} className="input-field max-w-xs">
                  <option value="all">All Orders</option>
                  {orderStatuses.map((s) => <option key={s} value={s}>{statusLabel(s)}</option>)}
                </select>
              </div>
            </div>

            {loading ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                <div className="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-teal-500" />
                <p className="mt-4 text-sm text-slate-500">Loading your orders...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <EmptyState title="No project orders found" message="Submit a project request from the form to start tracking your project status." />
            ) : (
              <div className="space-y-5">
                {filteredOrders.map((order) => (
                  <article key={order._id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                          {(order as any).orderNumber || 'Project Order'}
                        </p>
                        <h3 className="mt-2 text-xl font-black text-slate-900">
                          {order.projectType || (order as any).title}
                        </h3>
                        <p className="mt-2 text-sm text-slate-500">
                          {order.description || 'No description provided.'}
                        </p>
                      </div>
                      <StatusBadge status={order.status} />
                    </div>

                    <div className="mb-5 grid grid-cols-2 gap-3 text-sm lg:grid-cols-4">
                      {[
                        { label: 'Budget',     value: order.budgetRange || 'Discussing' },
                        { label: 'Deadline',   value: order.deadline || 'Flexible' },
                        { label: 'Technology', value: order.preferredTechnology || 'Discussing' },
                        { label: 'Progress',   value: `${(order as any).progress || 0}%` },
                      ].map(({ label, value }) => (
                        <div key={label} className="rounded-2xl bg-slate-50 p-4">
                          <p className="text-xs text-slate-500">{label}</p>
                          <p className="mt-1 font-bold text-slate-900">{value}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mb-5">
                      <div className="mb-2 flex items-center justify-between text-xs font-bold text-slate-500">
                        <span>Project progress</span>
                        <span>{(order as any).progress || 0}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                        <div className="h-2 rounded-full bg-teal-600 transition-all" style={{ width: `${(order as any).progress || 0}%` }} />
                      </div>
                    </div>

                    <OrderStatusTimeline status={order.status} />

                    <div className="mt-5 grid grid-cols-1 gap-3 text-sm md:grid-cols-3">
                      {(order as any).meetingLink && (
                        <a href={(order as any).meetingLink} target="_blank" rel="noreferrer"
                          className="rounded-2xl bg-sky-600 px-4 py-3 text-center font-bold text-white hover:bg-sky-700">
                          Open Meeting
                        </a>
                      )}
                      {(order as any).proposalUrl && (
                        <a href={(order as any).proposalUrl} target="_blank" rel="noreferrer"
                          className="rounded-2xl bg-violet-600 px-4 py-3 text-center font-bold text-white hover:bg-violet-700">
                          View Proposal
                        </a>
                      )}
                      {(order as any).deliveryUrl && (
                        <a href={(order as any).deliveryUrl} target="_blank" rel="noreferrer"
                          className="rounded-2xl bg-emerald-600 px-4 py-3 text-center font-bold text-white hover:bg-emerald-700">
                          View Delivery
                        </a>
                      )}
                    </div>

                    {(order as any).adminNote && (
                      <div className="mt-5 rounded-2xl border border-teal-200 bg-teal-50 p-4 text-sm text-slate-700">
                        <strong>Admin Note:</strong> {(order as any).adminNote}
                      </div>
                    )}

                    {!['completed', 'delivered', 'cancelled'].includes(order.status || 'pending') && (
                      <button onClick={() => handleCancel(order._id!)}
                        className="mt-5 rounded-full bg-red-600 px-5 py-2 text-sm font-bold text-white transition hover:bg-red-700">
                        Cancel Order
                      </button>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>

          {/* ── New order form ── */}
          <aside className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black text-slate-900">New Project Order</h2>
              <p className="mt-1 text-sm text-slate-500">Share complete details so the admin can respond faster.</p>
              <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                <input name="projectType" value={formData.projectType} onChange={handleChange} required placeholder="Project type / service name" className="input-field" />
                <input name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Company name" className="input-field" />
                <input name="clientPhone" value={formData.clientPhone} onChange={handleChange} placeholder="Phone / WhatsApp" className="input-field" />
                <div className="grid grid-cols-2 gap-4">
                  <input name="budgetRange" value={formData.budgetRange} onChange={handleChange} placeholder="Budget range" className="input-field" />
                  <input name="deadline" value={formData.deadline} onChange={handleChange} placeholder="Deadline" className="input-field" />
                </div>
                <input name="preferredTechnology" value={formData.preferredTechnology} onChange={handleChange} placeholder="Preferred technology" className="input-field" />
                <textarea name="description" value={formData.description} onChange={handleChange} required rows={5} placeholder="Project description" className="input-field" />
                <input name="referenceLinks" value={formData.referenceLinks} onChange={handleChange} placeholder="Reference links, comma separated" className="input-field" />
                <input name="attachmentUrl" value={formData.attachmentUrl} onChange={handleChange} placeholder="Attachment/design link" className="input-field" />
                <select name="meetingPreference" value={formData.meetingPreference} onChange={handleChange} className="input-field">
                  <option>Google Meet</option>
                  <option>Zoom</option>
                  <option>WhatsApp Call</option>
                  <option>Email first</option>
                </select>

                {error && (
                  <p className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>
                )}
                {success && (
                  <p className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{success}</p>
                )}

                <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
                  {submitting ? 'Submitting...' : 'Submit Order'}
                </button>
              </form>
            </div>
          </aside>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
