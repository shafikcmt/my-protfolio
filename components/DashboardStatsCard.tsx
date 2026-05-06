import { ArrowUpRight } from 'lucide-react'
import { isValidElement } from 'react'
import type { ElementType, ReactNode } from 'react'

interface DashboardStatsCardProps {
  label?: string
  title?: string
  value: string | number
  icon?: ReactNode | ElementType
  helperText?: string
  trend?: string
}

export default function DashboardStatsCard({
  label,
  title,
  value,
  icon,
  helperText,
  trend,
}: DashboardStatsCardProps) {
  const isReactElementIcon = isValidElement(icon)

  const isComponentIcon =
    icon &&
    !isReactElementIcon &&
    typeof icon !== 'string' &&
    typeof icon !== 'number' &&
    typeof icon !== 'boolean'

  const IconComponent = isComponentIcon ? (icon as ElementType) : null

  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_12px_32px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">
            {label || title}
          </p>
          <p className="mt-3 text-3xl font-black tracking-tight text-slate-950">
            {value}
          </p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
          {IconComponent ? (
            <IconComponent className="h-5 w-5" />
          ) : isReactElementIcon ? (
            icon
          ) : (
            <span className="text-2xl">{icon || '📊'}</span>
          )}
        </div>
      </div>

      {(helperText || trend) && (
        <div className="mt-6 flex items-center justify-between gap-3 text-xs text-slate-500">
          <span>{helperText}</span>

          {trend && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-600">
              <ArrowUpRight className="h-3.5 w-3.5" />
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  )
}