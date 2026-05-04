'use client'

import { useEffect, useMemo, useState } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import DashboardLayout from '@/components/DashboardLayout'
import EmptyState from '@/components/EmptyState'
import OrderStatusTimeline from '@/components/OrderStatusTimeline'
import StatusBadge from '@/components/StatusBadge'
import { IProjectOrder } from '@/types/models'
import axios from 'axios'

const statusOptions = ['pending', 'discussing', 'accepted', 'in_progress', 'testing', 'delivered', 'completed', 'cancelled']

function statusLabel(value: string) {
  return value.replace(/[-_]/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<IProjectOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get('/api/admin/orders')
      setOrders(data.data || [])
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredOrders = useMemo(() => {
    if (filter === 'all') return orders
    return orders.filter((order) => (order.status || 'pending') === filter)
  }, [orders, filter])

  const updateOrder = async (id: string, updateData: Record<string, any>) => {
    try {
      setSavingId(id)
      const { data } = await axios.put('/api/admin/orders', { id, ...updateData })
      setOrders((prev) => prev.map((order) => (order._id === id ? data.data : order)))
    } catch (error: any) {
      alert(error?.response?.data?.message || 'Failed to update order')
    } finally {
      setSavingId('')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this order?')) return
    try {
      await axios.delete('/api/admin/orders', { data: { id } })
      setOrders((prev) => prev.filter((order) => order._id !== id))
    } catch (error: any) {
      alert(error?.response?.data?.message || 'Failed to delete order')
    }
  }

  return (
    <ProtectedRoute requiredRoles={['admin']}>
      <DashboardLayout title="Manage Orders">
        <div className="mb-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-dark-800">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">Project Order Control</h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Update client order status, progress, admin notes, meeting link, proposal and delivery URL.</p>
            </div>
            <select value={filter} onChange={(event) => setFilter(event.target.value)} className="input-field max-w-xs">
              <option value="all">All Orders</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>{statusLabel(status)}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-gray-200 bg-white p-12 text-center dark:border-gray-700 dark:bg-dark-800">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-primary-500" />
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">Loading project orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <EmptyState title="No project orders found" message="Project requests submitted by clients will appear here." />
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const id = order._id || ''
              const client = (order as any).clientId
              return (
                <article key={id} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-dark-800">
                  <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">{(order as any).orderNumber || 'Project Order'}</p>
                      <h3 className="mt-2 text-xl font-black text-gray-900 dark:text-white">{order.projectType || (order as any).title}</h3>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{order.description || 'No description provided.'}</p>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <span className="rounded-full bg-gray-100 px-3 py-1 dark:bg-dark-900">{order.clientName || client?.name || 'Client'}</span>
                        <span className="rounded-full bg-gray-100 px-3 py-1 dark:bg-dark-900">{order.clientEmail || client?.email || 'No email'}</span>
                        {order.clientPhone && <span className="rounded-full bg-gray-100 px-3 py-1 dark:bg-dark-900">{order.clientPhone}</span>}
                      </div>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>

                  <div className="mb-5 grid grid-cols-1 gap-3 text-sm md:grid-cols-4">
                    <div className="rounded-2xl bg-gray-50 p-4 dark:bg-dark-900">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Budget</p>
                      <p className="mt-1 font-bold text-gray-900 dark:text-white">{order.budgetRange || 'N/A'}</p>
                    </div>
                    <div className="rounded-2xl bg-gray-50 p-4 dark:bg-dark-900">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Deadline</p>
                      <p className="mt-1 font-bold text-gray-900 dark:text-white">{order.deadline || 'Flexible'}</p>
                    </div>
                    <div className="rounded-2xl bg-gray-50 p-4 dark:bg-dark-900">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Technology</p>
                      <p className="mt-1 font-bold text-gray-900 dark:text-white">{order.preferredTechnology || 'N/A'}</p>
                    </div>
                    <div className="rounded-2xl bg-gray-50 p-4 dark:bg-dark-900">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Progress</p>
                      <p className="mt-1 font-bold text-gray-900 dark:text-white">{(order as any).progress || 0}%</p>
                    </div>
                  </div>

                  <OrderStatusTimeline status={order.status} />

                  <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-300">Status</span>
                      <select
                        value={(order.status || 'pending').replace('in-progress', 'in_progress')}
                        disabled={savingId === id}
                        onChange={(event) => updateOrder(id, { status: event.target.value })}
                        className="input-field"
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>{statusLabel(status)}</option>
                        ))}
                      </select>
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-300">Progress %</span>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        defaultValue={(order as any).progress || 0}
                        disabled={savingId === id}
                        onBlur={(event) => updateOrder(id, { progress: Number(event.target.value) })}
                        className="input-field"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-300">Meeting Link</span>
                      <input defaultValue={(order as any).meetingLink || ''} disabled={savingId === id} onBlur={(event) => updateOrder(id, { meetingLink: event.target.value })} className="input-field" placeholder="https://meet.google.com/..." />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-300">Proposal URL</span>
                      <input defaultValue={(order as any).proposalUrl || ''} disabled={savingId === id} onBlur={(event) => updateOrder(id, { proposalUrl: event.target.value })} className="input-field" placeholder="Proposal link" />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-300">Delivery URL</span>
                      <input defaultValue={(order as any).deliveryUrl || ''} disabled={savingId === id} onBlur={(event) => updateOrder(id, { deliveryUrl: event.target.value })} className="input-field" placeholder="Live/demo delivery link" />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-300">Admin Note</span>
                      <input defaultValue={(order as any).adminNote || ''} disabled={savingId === id} onBlur={(event) => updateOrder(id, { adminNote: event.target.value })} className="input-field" placeholder="Visible to client" />
                    </label>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    {savingId === id && <span className="rounded-full bg-primary-500/10 px-4 py-2 text-sm font-bold text-primary-600 dark:text-primary-300">Saving...</span>}
                    <button onClick={() => handleDelete(id)} className="rounded-full bg-red-600 px-5 py-2 text-sm font-bold text-white hover:bg-red-700">Delete</button>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  )
}
