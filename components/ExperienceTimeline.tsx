interface TimelineItem {
  company: string
  role: string
  period: string
  description: string
  tags: string[]
}

interface ExperienceTimelineProps {
  items: TimelineItem[]
}

export default function ExperienceTimeline({ items }: ExperienceTimelineProps) {
  return (
    <div className="relative space-y-6">
      {/* Vertical line */}
      <div className="absolute left-5 top-0 hidden h-full w-px bg-slate-200 sm:block" />

      {items.map((item, idx) => (
        <div key={item.company} className="relative flex gap-5 sm:gap-7">
          {/* Timeline dot */}
          <div className="relative z-10 hidden flex-shrink-0 sm:block">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-teal-200 bg-teal-50 text-xs font-bold text-teal-700">
              {String(idx + 1).padStart(2, '0')}
            </div>
          </div>

          {/* Card */}
          <div className="flex-1 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
            <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-teal-600">
                  {item.period}
                </span>
                <h3 className="mt-1 text-lg font-bold text-slate-900">{item.role}</h3>
                <p className="text-sm font-medium text-slate-500">{item.company}</p>
              </div>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-slate-600">{item.description}</p>
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
