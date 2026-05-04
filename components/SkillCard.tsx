interface SkillCardProps {
  category: string
  items: string[]
}

export default function SkillCard({ category, items }: SkillCardProps) {
  return (
    <div className="glass-card border-slate-700/70">
      <h3 className="text-lg font-semibold text-white mb-4">{category}</h3>
      <div className="grid gap-2 sm:grid-cols-2">
        {items.map((skill) => (
          <span key={skill} className="inline-flex items-center rounded-full border border-slate-700/60 bg-slate-900/70 px-3 py-2 text-sm text-slate-200">
            {skill}
          </span>
        ))}
      </div>
    </div>
  )
}
