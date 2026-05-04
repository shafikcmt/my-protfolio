'use client'

import EmptyState from '@/components/EmptyState'
import LoadingSpinner from '@/components/LoadingSpinner'

export interface DataTableColumn<T> {
  key: keyof T | string
  label: string
  render?: (value: any, row: T) => React.ReactNode
  className?: string
}

interface DataTableProps<T extends { _id?: string; id?: string }> {
  title: string
  subtitle?: string
  columns: DataTableColumn<T>[]
  data: T[]
  loading?: boolean
  emptyTitle?: string
  emptyMessage?: string
  onAdd?: () => void
  onView?: (id: string, row: T) => void
  onEdit?: (id: string, row: T) => void
  onDelete?: (id: string, row: T) => void
  addLabel?: string
}

export default function DataTable<T extends { _id?: string; id?: string }>({
  title,
  subtitle,
  columns,
  data,
  loading = false,
  emptyTitle,
  emptyMessage,
  onAdd,
  onView,
  onEdit,
  onDelete,
  addLabel = 'Add New',
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-sm dark:border-gray-700 dark:bg-dark-800">
        <LoadingSpinner />
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">Loading {title.toLowerCase()}...</p>
      </div>
    )
  }

  if (!data.length) {
    return (
      <EmptyState
        title={emptyTitle || `No ${title.toLowerCase()} found`}
        message={emptyMessage || `Create your first ${title.toLowerCase()} item to show it here.`}
        actionLabel={onAdd ? addLabel : undefined}
        onAction={onAdd}
      />
    )
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-dark-800">
      <div className="flex flex-col gap-4 border-b border-gray-200 p-6 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>}
        </div>
        {onAdd && (
          <button onClick={onAdd} className="btn-primary w-full sm:w-auto">
            {addLabel}
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px]">
          <thead className="bg-gray-50 dark:bg-gray-900/40">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-600 dark:text-gray-300 ${column.className || ''}`}
                >
                  {column.label}
                </th>
              ))}
              {(onView || onEdit || onDelete) && (
                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wide text-gray-600 dark:text-gray-300">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {data.map((row) => {
              const id = String(row._id || row.id || '')
              return (
                <tr key={id} className="transition hover:bg-gray-50 dark:hover:bg-gray-900/40">
                  {columns.map((column) => {
                    const value = (row as any)[column.key as string]
                    return (
                      <td key={`${id}-${String(column.key)}`} className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
                        {column.render ? column.render(value, row) : value || '-'}
                      </td>
                    )
                  })}
                  {(onView || onEdit || onDelete) && (
                    <td className="px-6 py-4 text-right">
                      <div className="flex flex-wrap justify-end gap-2">
                        {onView && (
                          <button onClick={() => onView(id, row)} className="rounded-full border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700">
                            View
                          </button>
                        )}
                        {onEdit && (
                          <button onClick={() => onEdit(id, row)} className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white transition hover:bg-blue-700">
                            Edit
                          </button>
                        )}
                        {onDelete && (
                          <button onClick={() => onDelete(id, row)} className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white transition hover:bg-red-700">
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
