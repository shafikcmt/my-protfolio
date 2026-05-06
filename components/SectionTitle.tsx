interface SectionTitleProps {
  title: string
  subtitle?: string
  eyebrow?: string
}

export default function SectionTitle({ title, subtitle, eyebrow }: SectionTitleProps) {
  return (
    <div className="mb-12 max-w-3xl">
      {eyebrow && (
        <p className="mb-3 inline-flex rounded-full bg-teal-50 px-4 py-2 text-sm font-semibold uppercase tracking-[0.22em] text-teal-700">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl md:text-5xl">{title}</h2>
      {subtitle && <p className="mt-4 text-lg leading-8 text-slate-600">{subtitle}</p>}
    </div>
  )
}
