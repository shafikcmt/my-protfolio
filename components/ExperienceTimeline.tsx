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
    <div className="space-y-6">
      {items.map((item) => (
        <div key={item.company} className="glass-card border-slate-700/70">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-primary-300">{item.period}</p>
              <h3 className="text-xl font-semibold text-white mt-2">{item.role}</h3>
              <p className="text-sm text-slate-400">{item.company}</p>
            </div>
          </div>
          <p className="mt-4 text-slate-300 leading-7">{item.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-slate-900/80 px-3 py-1 text-sm text-slate-200">
                {tag}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
