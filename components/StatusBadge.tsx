'use client'

const statusStyles: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-500/10 dark:text-amber-200 dark:border-amber-500/30',
  requested: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-500/10 dark:text-amber-200 dark:border-amber-500/30',
  discussing: 'bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-500/10 dark:text-cyan-200 dark:border-cyan-500/30',
  accepted: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-500/10 dark:text-blue-200 dark:border-blue-500/30',
  approved: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-500/10 dark:text-blue-200 dark:border-blue-500/30',
  confirmed: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-500/10 dark:text-blue-200 dark:border-blue-500/30',
  in_progress: 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-200 dark:border-indigo-500/30',
  'in-progress': 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-200 dark:border-indigo-500/30',
  testing: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-500/10 dark:text-purple-200 dark:border-purple-500/30',
  delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-200 dark:border-emerald-500/30',
  completed: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-500/10 dark:text-green-200 dark:border-green-500/30',
  rejected: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-500/10 dark:text-red-200 dark:border-red-500/30',
  cancelled: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-500/10 dark:text-red-200 dark:border-red-500/30',
}

function labelFromStatus(status: string) {
  return status.replace(/[-_]/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}

interface StatusBadgeProps {
  status?: string
  className?: string
}

export default function StatusBadge({ status = 'pending', className = '' }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold ${statusStyles[status] || statusStyles.pending} ${className}`}>
      {labelFromStatus(status)}
    </span>
  )
}
