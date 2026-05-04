interface DashboardStatsCardProps {
  label?: string
  title?: string
  value: string | number
  icon?: string
  helperText?: string
  trend?: string
}

export default function DashboardStatsCard({
  label,
  title,
  value,
  icon = '📊',
  helperText,
  trend,
}: DashboardStatsCardProps) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-dark-800">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{label || title}</p>
          <p className="mt-2 text-3xl font-black text-gray-900 dark:text-white">{value}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-2xl dark:bg-primary-900/20">
          {icon}
        </div>
      </div>
      {(helperText || trend) && (
        <div className="mt-5 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>{helperText}</span>
          {trend && <span className="font-semibold text-emerald-600 dark:text-emerald-400">{trend}</span>}
        </div>
      )}
    </div>
  )
}
