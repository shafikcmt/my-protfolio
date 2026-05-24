import Link from 'next/link'
import HeroSection from '@/components/home/HeroSection'
import {
  ABOUT_COUNTERS,
  PROJECT_LIST,
  SERVICE_LIST,
  SKILL_SECTIONS,
  TESTIMONIALS_LIST,
} from '@/lib/constants'
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Briefcase,
  CheckCircle2,
  Code2,
  ExternalLink,
  Layers3,
  MessageCircle,
  ShieldCheck,
  Star,
} from 'lucide-react'

const processItems = [
  'Conversion-friendly portfolio design',
  'Clean dashboard and admin workflow',
  'Fast Next.js / Laravel development',
  'LMS, course and student systems',
]

const serviceHighlights = ['UI Planning', 'API Development', 'Admin Panel', 'Deployment']

function ProjectPreview({ title, index }: { title: string; index: number }) {
  const bars = index % 2 === 0 ? [58, 84, 65, 92, 74] : [82, 56, 88, 70, 96]

  return (
    <div className="relative overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-teal-50 via-white to-cyan-50 p-5 hero-grid">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-rose-300" />
          <span className="h-3 w-3 rounded-full bg-amber-300" />
          <span className="h-3 w-3 rounded-full bg-emerald-300" />
        </div>
        <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-teal-700 shadow-sm">
          Live Project
        </span>
      </div>

      <div className="grid min-h-[230px] gap-5 sm:grid-cols-[1.05fr_0.95fr] sm:items-end">
        <div className="space-y-3">
          <div className="h-4 w-32 rounded-full bg-slate-200/80" />
          <div className="h-8 w-56 max-w-full rounded-full bg-teal-600/90" />
          <div className="h-4 w-44 max-w-full rounded-full bg-slate-200/80" />
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="h-20 rounded-2xl bg-white shadow-sm" />
            <div className="h-20 rounded-2xl bg-white shadow-sm" />
          </div>
        </div>

        <div className="flex h-48 items-end gap-2 rounded-[1.25rem] bg-white/85 p-4 shadow-sm">
          {bars.map((height, barIndex) => (
            <div key={barIndex} className="flex flex-1 items-end">
              <div
                className={barIndex % 2 === 0 ? 'w-full rounded-t-xl bg-teal-500' : 'w-full rounded-t-xl bg-orange-400'}
                style={{ height: `${height}%` }}
              />
            </div>
          ))}
        </div>
      </div>

      <p className="mt-5 text-sm font-black text-slate-950">{title}</p>
    </div>
  )
}

export default function Home() {
  return (
    <div className="bg-[#f7fbfa] text-slate-900">
      <HeroSection />

      <section id="about" className="section-shell">
        <div className="container-custom">
          <div className="grid gap-10 xl:grid-cols-[0.95fr_1.05fr] xl:items-center">
            <div className="reveal-up">
              <p className="section-kicker">About me</p>
              <h2 className="home-heading">
                Clean design, stable code, and products people can use easily.
              </h2>
              <p className="mt-5 home-subtitle">
                I build portfolio websites, LMS platforms, dashboards, client portals and custom business tools with a strong focus on speed, usability and practical workflows.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {processItems.map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-teal-700" />
                    <span className="text-sm font-bold text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {ABOUT_COUNTERS.map((counter, index) => (
                <div key={counter.label} className="clean-card reveal-up p-7" style={{ animationDelay: `${index * 90}ms` }}>
                  <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                    <BadgeCheck className="h-5 w-5" />
                  </div>
                  <p className="text-4xl font-black text-slate-950">{counter.value}</p>
                  <p className="mt-2 text-sm font-semibold text-slate-500">{counter.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="skills" className="section-shell bg-white">
        <div className="container-custom">
          <div className="mb-10 grid gap-6 lg:grid-cols-[0.9fr_1fr] lg:items-end">
            <div>
              <p className="section-kicker">Skills</p>
              <h2 className="home-heading">Strong stack for modern web products.</h2>
            </div>
            <p className="home-subtitle lg:ml-auto">
              Frontend, backend, database, CMS, API integration and technical training skills arranged in a cleaner card layout.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {SKILL_SECTIONS.map((section, index) => (
              <div
                key={section.category}
                className="clean-card reveal-up p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_65px_rgba(15,23,42,0.09)]"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                  <Code2 className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-black text-slate-950">{section.category}</h3>
                <div className="mt-5 flex flex-wrap gap-2.5">
                  {section.items.map((skill) => (
                    <span key={skill} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-600">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="section-shell">
        <div className="container-custom">
          <div className="mb-10 max-w-4xl">
            <p className="section-kicker">Services</p>
            <h2 className="home-heading">Premium development services without messy design.</h2>
            <p className="mt-5 home-subtitle">
              Clean cards, easy comparison and direct action points for visitors who want to hire or order a project.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {SERVICE_LIST.map((service, index) => (
              <div key={service.slug} className="group clean-card reveal-up p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.10)]" style={{ animationDelay: `${index * 90}ms` }}>
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <h3 className="max-w-xl text-2xl font-black leading-tight text-slate-950">{service.title}</h3>
                  </div>

                  <div className="w-fit rounded-2xl bg-slate-50 px-4 py-3 text-left sm:text-right">
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">Starts at</p>
                    <p className="text-xl font-black text-teal-700">${service.price}</p>
                  </div>
                </div>

                <p className="mt-5 text-sm leading-7 text-slate-600">{service.description}</p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {serviceHighlights.map((item) => (
                    <span key={item} className="flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 text-xs font-bold text-slate-600 ring-1 ring-slate-200">
                      <ShieldCheck className="h-4 w-4 text-teal-700" />
                      {item}
                    </span>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {service.technologies.map((tech) => (
                    <span key={tech} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-black uppercase tracking-wide text-slate-500">
                      {tech}
                    </span>
                  ))}
                </div>

                <Link href={`/services/${service.slug}`} className="mt-7 inline-flex items-center gap-2 text-sm font-black text-teal-700 transition group-hover:gap-3">
                  View service
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="projects" className="section-shell bg-white">
        <div className="container-custom">
          <div className="mb-10 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <p className="section-kicker">Portfolio</p>
              <h2 className="home-heading">Selected projects with polished presentation.</h2>
            </div>
            <Link href="/projects" className="btn-secondary w-fit">
              View all projects
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {PROJECT_LIST.map((project, index) => (
              <article key={project.slug} className="clean-card reveal-up overflow-hidden p-5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.10)]" style={{ animationDelay: `${index * 90}ms` }}>
                <ProjectPreview title={project.title} index={index} />

                <div className="px-1 pt-6">
                  <p className="section-kicker mb-3">Featured Project</p>
                  <h3 className="text-2xl font-black text-slate-950">{project.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{project.description}</p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-slate-500">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="mt-7 flex flex-wrap gap-3">
                    <Link href={`/projects/${project.slug}`} className="btn-primary px-5 py-2.5">
                      Details
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                    <Link href={`/order-project?project=${project.slug}`} className="btn-secondary px-5 py-2.5">
                      Order similar
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="section-shell">
        <div className="container-custom">
          <div className="mb-10 max-w-4xl">
            <p className="section-kicker">Testimonials</p>
            <h2 className="home-heading">Feedback from clients and students.</h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {TESTIMONIALS_LIST.map((testimonial, index) => (
              <div key={testimonial.name} className="clean-card reveal-up p-7" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-lg font-black text-teal-700">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-lg font-black text-slate-950">{testimonial.name}</p>
                    <p className="text-sm font-semibold text-slate-500">
                      {testimonial.role} • {testimonial.company}
                    </p>
                  </div>
                </div>

                <p className="text-base leading-8 text-slate-600">“{testimonial.content}”</p>
                <div className="mt-5 flex gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <Star key={starIndex} className={`h-4 w-4 ${starIndex < testimonial.rating ? 'fill-current' : ''}`} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-custom pb-16 lg:pb-24">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-teal-950 to-teal-800 p-8 text-white shadow-[0_34px_100px_rgba(15,23,42,0.18)] lg:p-12">
          <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-teal-400/20 blur-3xl" />
          <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="mb-4 text-xs font-black uppercase tracking-[0.32em] text-white/55">Start your project</p>
              <h2 className="max-w-3xl text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                Need a beautiful, fast and user-friendly website?
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/75">
                Book a consultation and create your portfolio, LMS, dashboard or custom business platform with a clean modern experience.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link href="/contact" className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3 text-sm font-black text-slate-950 transition hover:bg-slate-100">
                Contact me
                <MessageCircle className="ml-2 h-4 w-4" />
              </Link>
              <Link href="/courses" className="inline-flex items-center justify-center rounded-full border border-white/20 px-7 py-3 text-sm font-black text-white transition hover:bg-white/10">
                Explore courses
                <BookOpen className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
