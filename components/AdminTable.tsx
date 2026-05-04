'use client'

import { useState } from 'react'

interface Column {
  key: string
  label: string
  render?: (value: any, row: any) => React.ReactNode
}

interface AdminTableProps {
  columns: Column[]
  data: any[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onAdd: () => void
  loading?: boolean
  title: string
}

export default function AdminTable({
  columns,
  data,
  onEdit,
  onDelete,
  onAdd,
  loading = false,
  title,
}: AdminTableProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds)
    if (newSet.has(id)) {
      newSet.delete(id)
    } else {
      newSet.add(id)
    }
    setSelectedIds(newSet)
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === data.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(data.map((item) => item._id)))
    }
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow p-6 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading {title.toLowerCase()}...</p>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow p-12 text-center">
        <p className="text-gray-600 dark:text-gray-400 mb-4">No {title.toLowerCase()} found</p>
        <button onClick={onAdd} className="btn-primary">
          Add {title}
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-dark-800 rounded-lg shadow overflow-hidden">
      {/* Toolbar */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {data.length} {title.toLowerCase()} total
            {selectedIds.size > 0 && ` • ${selectedIds.size} selected`}
          </p>
        </div>
        <button onClick={onAdd} className="btn-primary">
          Add {title}
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3">
                <input
                  type="checkbox"
                  checked={selectedIds.size === data.length && data.length > 0}
                  onChange={toggleSelectAll}
                  className="w-4 h-4"
                />
              </th>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {data.map((row) => (
              <tr
                key={row._id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(row._id)}
                    onChange={() => toggleSelect(row._id)}
                    className="w-4 h-4"
                  />
                </td>
                {columns.map((column) => (
                  <td
                    key={`${row._id}-${column.key}`}
                    className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300"
                  >
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
                <td className="px-6 py-4 text-sm space-x-2">
                  <button
                    onClick={() => onEdit(row._id)}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(row._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
