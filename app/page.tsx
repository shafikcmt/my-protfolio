import Link from 'next/link'
import { HERO_TITLES, ABOUT_SUMMARY, ABOUT_COUNTERS, SKILL_SECTIONS, SERVICE_LIST, PROJECT_LIST, TESTIMONIALS_LIST } from '@/lib/constants'
import SectionTitle from '@/components/SectionTitle'
import SkillCard from '@/components/SkillCard'
import ServiceCard from '@/components/ServiceCard'
import ProjectCard from '@/components/ProjectCard'
import TestimonialCard from '@/components/TestimonialCard'

export default function Home() {
  return (
    <div>
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.2),_transparent_40%),linear-gradient(180deg,_#040511_0%,_#0f172a_100%)] pt-24 pb-28">
        <div className="container-custom relative z-10">
          <div className="grid gap-20 lg:grid-cols-[1.2fr_0.8fr] items-center">
            <div className="space-y-8">
              <span className="inline-flex items-center gap-3 rounded-full border border-primary-500/20 bg-white/5 px-4 py-2 text-sm text-primary-100">
                <span className="h-2 w-2 rounded-full bg-primary-400" />
                Premium Portfolio & LMS Platform
              </span>
              <div className="space-y-5">
                <p className="text-lg uppercase tracking-[0.35em] text-primary-300">Md Shafiqul Islam</p>
                <h1 className="section-heading max-w-3xl">
                  Modern Web Development, Technical Training, and Scalable LMS Solutions.
                </h1>
                <p className="section-subheading">{ABOUT_SUMMARY}</p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link href="/contact" className="btn-primary">
                  Hire Me
                </Link>
                <Link href="/projects" className="btn-secondary">
                  View Projects
                </Link>
                <Link href="/order-project" className="btn-secondary">
                  Book Consultation
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <a href="https://github.com/mdshafiqul" className="rounded-3xl border border-slate-700/70 bg-slate-950/70 px-4 py-3 text-center text-sm text-slate-200 transition hover:border-primary-500">
                  GitHub
                </a>
                <a href="https://linkedin.com/in/mdshafiqul" className="rounded-3xl border border-slate-700/70 bg-slate-950/70 px-4 py-3 text-center text-sm text-slate-200 transition hover:border-primary-500">
                  LinkedIn
                </a>
                <a href="mailto:mdshafiqul@example.com" className="rounded-3xl border border-slate-700/70 bg-slate-950/70 px-4 py-3 text-center text-sm text-slate-200 transition hover:border-primary-500">
                  Email
                </a>
                <a href="https://wa.me/8801234567890" className="rounded-3xl border border-slate-700/70 bg-slate-950/70 px-4 py-3 text-center text-sm text-slate-200 transition hover:border-primary-500">
                  WhatsApp
                </a>
              </div>
            </div>
            <div className="relative flex justify-center">
              <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-primary-500/10 via-transparent to-transparent blur-3xl" />
              <div className="relative w-full max-w-md rounded-[2.5rem] border border-white/10 bg-slate-950/80 p-10 shadow-glow">
                <div className="mx-auto mb-6 h-80 w-80 max-w-full rounded-[2rem] bg-slate-900/80" />
                <div className="space-y-3">
                  {HERO_TITLES.map((title) => (
                    <p key={title} className="text-sm uppercase tracking-[0.35em] text-slate-400">{title}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="container-custom py-20">
        <SectionTitle title="About Me" subtitle="A senior full-stack developer and training specialist delivering premium software, LMS systems, and business automation." eyebrow="About" />
        <div className="grid gap-8 lg:grid-cols-[0.9fr_0.9fr]">
          <div className="glass-card border-slate-700/70">
            <h3 className="text-xl font-semibold text-white mb-4">Experience and Impact</h3>
            <p className="text-slate-300 leading-8">{ABOUT_SUMMARY}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {ABOUT_COUNTERS.map((counter) => (
              <div key={counter.label} className="glass-card border-slate-700/70 p-8 text-center">
                <p className="text-4xl font-semibold text-white">{counter.value}</p>
                <p className="mt-2 text-slate-400">{counter.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="skills" className="container-custom py-20">
        <SectionTitle title="Technical Skills" subtitle="A technology stack built for modern product development and scalable enterprise solutions." eyebrow="Skills" />
        <div className="grid gap-6 lg:grid-cols-3">
          {SKILL_SECTIONS.map((section) => (
            <SkillCard key={section.category} category={section.category} items={section.items} />
          ))}
        </div>
      </section>

      <section id="services" className="container-custom py-20">
        <SectionTitle title="Services" subtitle="Comprehensive services for websites, LMS, enterprise systems, and long-term product success." eyebrow="Services" />
        <div className="grid gap-6 xl:grid-cols-2">
          {SERVICE_LIST.map((service) => (
            <ServiceCard key={service.slug} {...service} />
          ))}
        </div>
      </section>

      <section id="projects" className="container-custom py-20">
        <SectionTitle title="Selected Projects" subtitle="Featured work that showcases enterprise-grade LMS, eCommerce, custom development, and tracking solutions." eyebrow="Projects" />
        <div className="grid gap-6 xl:grid-cols-2">
          {PROJECT_LIST.map((project) => (
            <ProjectCard key={project.slug} {...project} />
          ))}
        </div>
      </section>

      <section id="testimonials" className="container-custom py-20">
        <SectionTitle title="Client & Student Feedback" subtitle="Trusted by business owners and learners for delivery, training, and support." eyebrow="Testimonials" />
        <div className="grid gap-6 xl:grid-cols-2">
          {TESTIMONIALS_LIST.map((testimonial) => (
            <TestimonialCard key={testimonial.name} {...testimonial} />
          ))}
        </div>
      </section>

      <section className="container-custom py-20">
        <div className="glass-card border-slate-700/70 p-12 text-center">
          <h2 className="text-3xl font-semibold text-white mb-4">Ready to launch your next digital product?</h2>
          <p className="text-slate-300 mb-8">Book a consultation, request a custom quote, or explore training courses designed to help your business scale.</p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/order-project" className="btn-primary">
              Order Project
            </Link>
            <Link href="/courses" className="btn-secondary">
              Explore Courses
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
