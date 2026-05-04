import SectionTitle from '@/components/SectionTitle'
import SkillCard from '@/components/SkillCard'
import ExperienceTimeline from '@/components/ExperienceTimeline'
import { ABOUT_SUMMARY, ABOUT_COUNTERS, SKILL_SECTIONS, EXPERIENCE_TIMELINE, EDUCATION_TIMELINE } from '@/lib/constants'

export default function AboutPage() {
  return (
    <div className="container-custom py-24">
      <SectionTitle title="About Md Shafiqul Islam" subtitle="Detailed experience, training history, and professional readiness for modern web development projects." eyebrow="About" />
      <div className="grid gap-8 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="glass-card border-slate-700/70 p-10">
          <p className="text-slate-300 leading-8 mb-8">{ABOUT_SUMMARY}</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {ABOUT_COUNTERS.map((item) => (
              <div key={item.label} className="rounded-3xl bg-slate-950/80 p-6">
                <p className="text-4xl font-semibold text-white">{item.value}</p>
                <p className="mt-2 text-slate-400">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card border-slate-700/70 p-10">
            <h3 className="text-xl font-semibold text-white mb-4">Core Strengths</h3>
            <div className="space-y-3 text-slate-300 leading-7">
              <p>Experienced in Laravel, MERN, and Next.js software development with production-grade systems and training curricula.</p>
              <p>Specialized in secure, scalable LMS solutions, eCommerce marketplaces, ERP automation, and web application architecture.</p>
              <p>Strong communicator with a proven track record of mentoring learners, delivering technical workshops, and leading development teams.</p>
            </div>
          </div>

          <div className="glass-card border-slate-700/70 p-10">
            <h3 className="text-xl font-semibold text-white mb-4">Education</h3>
            <div className="space-y-4">
              {EDUCATION_TIMELINE.map((education) => (
                <div key={education.title} className="rounded-3xl bg-slate-950/80 p-5">
                  <p className="text-sm uppercase tracking-[0.25em] text-primary-300">{education.period}</p>
                  <h4 className="mt-2 text-lg font-semibold text-white">{education.title}</h4>
                  <p className="text-slate-400">{education.institution}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <section className="mt-20">
        <SectionTitle title="Experience Timeline" subtitle="Professional milestones that shaped the portfolio and LMS expertise." eyebrow="Experience" />
        <ExperienceTimeline items={EXPERIENCE_TIMELINE} />
      </section>

      <section className="mt-20">
        <SectionTitle title="Skills Matrix" subtitle="A complete set of technologies and development capabilities." eyebrow="Skills" />
        <div className="grid gap-6 lg:grid-cols-3">
          {SKILL_SECTIONS.map((section) => (
            <SkillCard key={section.category} category={section.category} items={section.items} />
          ))}
        </div>
      </section>
    </div>
  )
}
