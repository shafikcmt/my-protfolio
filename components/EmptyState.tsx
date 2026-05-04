interface EmptyStateProps {
  title?: string
  message?: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  icon?: string
}

export default function EmptyState({
  title = 'No data found',
  message,
  description,
  actionLabel,
  onAction,
  icon = '📭',
}: EmptyStateProps) {
  const text = message || description || 'There is nothing to show yet.'

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-sm dark:border-gray-700 dark:bg-dark-800">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-50 text-3xl dark:bg-primary-900/20">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
      <p className="mx-auto mb-6 max-w-md text-sm leading-6 text-gray-600 dark:text-gray-400">{text}</p>
      {actionLabel && onAction && (
        <button onClick={onAction} className="btn-primary">
          {actionLabel}
        </button>
      )}
    </div>
  )
}
