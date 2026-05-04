'use client'

import OrderForm from '@/components/OrderForm'
import SectionTitle from '@/components/SectionTitle'

export default function OrderProjectPage() {
  return (
    <div className="container-custom py-24">
      <SectionTitle title="Project Order" subtitle="Submit your project brief, budget, deadline and technology preferences." eyebrow="Order" />
      <div className="grid gap-10 lg:grid-cols-[0.75fr_0.25fr]">
        <div>
          <OrderForm />
        </div>
        <aside className="glass-card border-slate-700/70 p-10">
          <h2 className="text-xl font-semibold text-white mb-4">Booking Details</h2>
          <p className="text-slate-300 leading-7 mb-6">Use this order system to request custom development, LMS integration, portfolio sites, or premium business software.</p>
          <div className="space-y-4 text-sm text-slate-400">
            <p><strong>What to include:</strong> project type, budget, deadline and reference links.</p>
            <p>We typically respond within 24 hours with a tailored proposal and timeline.</p>
            <p>After submission, clients can login to track order status and manage updates.</p>
          </div>
        </aside>
      </div>
    </div>
  )
}
