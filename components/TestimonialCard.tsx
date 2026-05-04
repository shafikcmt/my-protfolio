interface TestimonialCardProps {
  name: string
  role: string
  company: string
  rating: number
  content: string
  image?: string
}

export default function TestimonialCard({ name, role, company, rating, content, image }: TestimonialCardProps) {
  return (
    <div className="glass-card border-slate-700/70">
      <div className="flex items-center gap-4 mb-5">
        <div className="h-14 w-14 rounded-3xl bg-slate-900/80 flex items-center justify-center text-xl text-primary-300">
          {image ? <img src={image} alt={name} className="h-14 w-14 rounded-3xl object-cover" /> : name.charAt(0)}</div>
        <div>
          <p className="text-lg font-semibold text-white">{name}</p>
          <p className="text-sm text-slate-400">{role} • {company}</p>
        </div>
      </div>
      <p className="text-slate-300 leading-7 mb-5">“{content}”</p>
      <div className="flex gap-1 text-amber-300">
        {Array.from({ length: 5 }).map((_, index) => (
          <span key={index}>{index < rating ? '★' : '☆'}</span>
        ))}
      </div>
    </div>
  )
}
