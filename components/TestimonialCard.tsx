import { Quote, Star } from 'lucide-react'

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
    <div className="surface-card p-7 transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-[1.25rem] bg-gradient-to-br from-teal-100 to-cyan-100 text-lg font-black text-teal-700">
            {image ? <img src={image} alt={name} className="h-14 w-14 object-cover" /> : name.charAt(0)}
          </div>
          <div>
            <p className="text-lg font-black text-slate-900">{name}</p>
            <p className="text-sm text-slate-500">{role} • {company}</p>
          </div>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-50 text-teal-700">
          <Quote className="h-5 w-5" />
        </div>
      </div>
      <p className="mb-5 text-base leading-8 text-slate-600">“{content}”</p>
      <div className="flex gap-1.5 text-amber-400">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star key={index} className={`h-4 w-4 ${index < rating ? 'fill-current' : ''}`} />
        ))}
      </div>
    </div>
  )
}
