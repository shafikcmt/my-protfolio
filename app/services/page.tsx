import SectionTitle from '@/components/SectionTitle'
import ServiceCard from '@/components/ServiceCard'
import { SERVICE_LIST } from '@/lib/constants'

export default function ServicesPage() {
  return (
    <div className="container-custom py-24">
      <SectionTitle title="Services" subtitle="Digital services designed to help your business grow with modern web applications and LMS solutions." eyebrow="Services" />
      <div className="grid gap-6 xl:grid-cols-2">
        {SERVICE_LIST.map((service) => (
          <ServiceCard key={service.slug} {...service} />
        ))}
      </div>
    </div>
  )
}
