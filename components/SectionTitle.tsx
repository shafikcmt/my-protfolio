interface SectionTitleProps {
  title: string
  subtitle?: string
  eyebrow?: string
}

export default function SectionTitle({ title, subtitle, eyebrow }: SectionTitleProps) {
  return (
    <div className="mb-10 max-w-3xl">
      {eyebrow && <p className="text-sm uppercase tracking-[0.25em] text-primary-300 mb-3">{eyebrow}</p>}
      <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 text-slate-300 leading-8">{subtitle}</p>}
    </div>
  )
}
