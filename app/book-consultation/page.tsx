'use client'

import BookingForm from '@/components/BookingForm'
import SectionTitle from '@/components/SectionTitle'

export default function BookConsultationPage() {
  return (
    <div className="container-custom py-24">
      <SectionTitle title="Book a Consultation" subtitle="Arrange a live session to discuss your project, training or LMS roadmap." eyebrow="Consultation" />
      <div className="grid gap-10 lg:grid-cols-[0.75fr_0.25fr]">
        <div>
          <BookingForm />
        </div>
        <aside className="glass-card border-slate-700/70 p-10">
          <h2 className="text-xl font-semibold text-white mb-4">Meeting Info</h2>
          <p className="text-slate-300 leading-7 mb-6">Book a session with Md Shafiqul Islam to discuss development, training, or LMS implementation.</p>
          <div className="space-y-4 text-sm text-slate-400">
            <p>Available for consultations on project planning, course creation, and technical training.</p>
            <p>Suggested duration: 60 minutes with follow-up materials and action plan.</p>
            <p>If you need personalized training for your team or organization, mention it in the request.</p>
          </div>
        </aside>
      </div>
    </div>
  )
}
