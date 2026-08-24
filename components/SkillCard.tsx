interface SkillCardProps {
  category: string
  items: string[]
  icon?: React.ReactNode
}

export default function SkillCard({ category, items, icon }: SkillCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-4 flex items-center gap-3">
        {icon ? (
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
            {icon}
          </div>
        ) : (
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-teal-50">
            <span className="text-base">✦</span>
          </div>
        )}
        <h3 className="text-base font-bold text-slate-900">{category}</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((skill) => (
          <span
            key={skill}
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  )
}
