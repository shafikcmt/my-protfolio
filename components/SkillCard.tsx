import { Sparkles } from 'lucide-react'

interface SkillCardProps {
  category: string
  items: string[]
}

export default function SkillCard({ category, items }: SkillCardProps) {
  return (
    <div className="surface-card p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Skill Group</p>
          <h3 className="text-xl font-black text-slate-900">{category}</h3>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((skill) => (
          <span key={skill} className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700">
            {skill}
          </span>
        ))}
      </div>
    </div>
  )
}
