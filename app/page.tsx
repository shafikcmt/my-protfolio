import Link from 'next/link'
<<<<<<< HEAD
import HeroSection from '@/components/home/HeroSection'
import {
  ABOUT_COUNTERS,
=======
import {
  ABOUT_COUNTERS,
  ABOUT_SUMMARY,
>>>>>>> 39452b3218c264bf8748c8dfe3dc74174908cd26
  PROJECT_LIST,
  SERVICE_LIST,
  SKILL_SECTIONS,
  TESTIMONIALS_LIST,
} from '@/lib/constants'
import {
  ArrowRight,
  BadgeCheck,
<<<<<<< HEAD
=======
  BarChart3,
>>>>>>> 39452b3218c264bf8748c8dfe3dc74174908cd26
  BookOpen,
  Briefcase,
  CheckCircle2,
  Code2,
  ExternalLink,
  Layers3,
  MessageCircle,
<<<<<<< HEAD
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
=======
  Rocket,
  Sparkles,
  Star,
  Users,
} from 'lucide-react'

const heroStats = [
  { label: 'Projects Delivered', value: '100+', icon: Rocket },
  { label: 'Happy Clients', value: '50+', icon: Users },
  { label: 'Years Experience', value: '5+', icon: BadgeCheck },
]

const processItems = [
  'Clean modern UI design',
  'Fast Next.js development',
  'Admin dashboard & CMS',
  'LMS and course platform',
]

export default function Home() {
  return (
    <div className="bg-[#f5f8f7] text-slate-900">
     {/* Hero */}
<section className="relative overflow-hidden border-b border-slate-200 bg-[linear-gradient(135deg,#edf8f7_0%,#f7fbfb_48%,#d8f0ef_100%)]">
  <div className="absolute left-10 top-24 h-72 w-72 rounded-full bg-teal-200/30 blur-3xl" />
  <div className="absolute right-10 bottom-10 h-96 w-96 rounded-full bg-cyan-200/40 blur-3xl" />

  <div className="container-custom relative z-10 py-16 lg:py-24">
    <div className="rounded-[2.2rem] border border-white/80 bg-white/55 p-6 shadow-[0_30px_90px_rgba(15,23,42,0.08)] backdrop-blur-xl lg:p-10">
      <div className="grid min-h-[650px] items-center gap-12 lg:grid-cols-[1fr_0.95fr]">
        {/* Left Content */}
        <div className="max-w-3xl">
          <p className="mb-5 text-sm font-black uppercase tracking-[0.35em] text-teal-700">
            Welcome to my world
          </p>

          <h1 className="text-5xl font-black leading-[1.05] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
            Hey! I am <br />
            <span className="text-teal-700">Web Developer</span>
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-8 text-slate-600 lg:text-lg">
            {ABOUT_SUMMARY}
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link href="/contact" className="btn-primary px-8 py-4">
              Let&apos;s Talk
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>

            <Link href="/projects" className="btn-secondary px-8 py-4">
              View Portfolio
            </Link>
          </div>

          <div className="mt-12 grid max-w-xl gap-4 sm:grid-cols-3">
            {heroStats.map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="rounded-[1.5rem] border border-white bg-white/70 p-5 shadow-[0_15px_45px_rgba(15,23,42,0.06)]"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-3xl font-black text-slate-950">{value}</p>
                <p className="mt-1 text-xs font-bold text-slate-500">{label}</p>
              </div>
            ))}
>>>>>>> 39452b3218c264bf8748c8dfe3dc74174908cd26
          </div>
        </div>

<<<<<<< HEAD
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
=======
        {/* Right Profile Image */}
        <div className="relative mx-auto flex w-full max-w-[620px] items-center justify-center">
          <div className="absolute h-[520px] w-[520px] rounded-full border-[34px] border-teal-900/10" />
          <div className="absolute h-[445px] w-[445px] rounded-full border-[3px] border-dashed border-teal-800/45" />
          <div className="absolute h-[370px] w-[370px] rounded-full bg-gradient-to-br from-teal-700 to-teal-500 shadow-[0_35px_90px_rgba(15,118,110,0.25)]" />

          <div className="relative z-10 h-[430px] w-[430px] overflow-hidden rounded-full">
            <img
              src="/images/profile.png"
              alt="Md Shafiqul Islam"
              className="h-full w-full object-cover object-top"
            />
          </div>

          <div className="absolute -left-2 bottom-16 z-20 rounded-2xl bg-white/90 px-5 py-4 shadow-[0_18px_45px_rgba(15,23,42,0.12)] backdrop-blur">
            <p className="text-sm font-black text-slate-950">Full-Stack Developer</p>
            <p className="mt-1 text-xs font-bold text-teal-700">Laravel • MERN • Next.js</p>
          </div>

          <div className="absolute right-2 top-20 z-20 rounded-full bg-white/90 px-5 py-3 text-sm font-black text-teal-700 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
            Available
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* About */}
      <section id="about" className="container-custom py-20 lg:py-28">
        <div className="grid gap-10 xl:grid-cols-[0.9fr_1.1fr] xl:items-center">
          <div>
            <p className="mb-4 text-sm font-black uppercase tracking-[0.3em] text-teal-600">
              About Me
            </p>
            <h2 className="max-w-4xl text-4xl font-black tracking-tight text-slate-950 lg:text-6xl">
              I create clean, modern and easy-to-use web products.
            </h2>
            <p className="mt-6 max-w-3xl text-lg leading-9 text-slate-600">
              A professional full-stack developer and trainer focused on portfolio websites,
              LMS platforms, business dashboards, client portals, and automation systems.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {processItems.map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm">
                  <CheckCircle2 className="h-5 w-5 text-teal-600" />
                  <span className="text-sm font-bold text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {ABOUT_COUNTERS.map((counter) => (
              <div
                key={counter.label}
                className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.06)]"
              >
                <div className="mb-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                  <BadgeCheck className="h-6 w-6" />
                </div>
                <p className="text-5xl font-black text-slate-950">{counter.value}</p>
                <p className="mt-3 text-base font-medium text-slate-500">{counter.label}</p>
>>>>>>> 39452b3218c264bf8748c8dfe3dc74174908cd26
              </div>
            ))}
          </div>
        </div>
      </section>

<<<<<<< HEAD
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
=======
      {/* Skills */}
      <section id="skills" className="bg-white py-20 lg:py-28">
        <div className="container-custom">
          <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="mb-4 text-sm font-black uppercase tracking-[0.3em] text-teal-600">
                Skills
              </p>
              <h2 className="max-w-4xl text-4xl font-black tracking-tight text-slate-950 lg:text-6xl">
                Strong stack for modern product development.
              </h2>
            </div>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              Frontend, backend, database, CMS, API integration, and training expertise in one place.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {SKILL_SECTIONS.map((section) => (
              <div
                key={section.category}
                className="rounded-[2rem] border border-slate-200 bg-[#f8fbfa] p-7 shadow-sm"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-teal-700 shadow-sm">
                  <Code2 className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-black text-slate-950">{section.category}</h3>
                <div className="mt-6 flex flex-wrap gap-3">
                  {section.items.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
>>>>>>> 39452b3218c264bf8748c8dfe3dc74174908cd26
              </div>
            ))}
          </div>
        </div>
      </section>

<<<<<<< HEAD
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
=======
      {/* Services */}
      <section id="services" className="container-custom py-20 lg:py-28">
        <div className="mb-12">
          <p className="mb-4 text-sm font-black uppercase tracking-[0.3em] text-teal-600">
            Services
          </p>
          <h2 className="max-w-5xl text-4xl font-black tracking-tight text-slate-950 lg:text-6xl">
            Premium services for websites, LMS, dashboards and business automation.
          </h2>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          {SERVICE_LIST.map((service) => (
            <div
              key={service.slug}
              className="group rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:shadow-[0_30px_80px_rgba(15,23,42,0.1)]"
            >
              <div className="flex flex-col justify-between gap-6 sm:flex-row">
                <div>
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                    <Briefcase className="h-6 w-6" />
                  </div>
                  <h3 className="text-3xl font-black text-slate-950">{service.title}</h3>
                </div>

                {service.price !== undefined && (
                  <div className="h-fit rounded-2xl bg-slate-50 px-5 py-4 text-right">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                      Starts at
                    </p>
                    <p className="text-2xl font-black text-teal-700">${service.price}</p>
                  </div>
                )}
              </div>

              <p className="mt-5 text-base leading-8 text-slate-600">{service.description}</p>

              <div className="mt-6 flex flex-wrap gap-2">
                {service.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full bg-slate-50 px-4 py-2 text-xs font-black uppercase tracking-wide text-slate-500 ring-1 ring-slate-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <Link
                href={`/services/${service.slug}`}
                className="mt-8 inline-flex items-center gap-2 text-sm font-black text-teal-700 transition group-hover:gap-3"
              >
                View Service
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="bg-white py-20 lg:py-28">
        <div className="container-custom">
          <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="mb-4 text-sm font-black uppercase tracking-[0.3em] text-teal-600">
                Portfolio
              </p>
              <h2 className="max-w-5xl text-4xl font-black tracking-tight text-slate-950 lg:text-6xl">
                Selected projects with clean UI and strong business logic.
              </h2>
            </div>
            <Link href="/projects" className="btn-secondary w-fit">
              View All Projects
            </Link>
          </div>

          <div className="grid gap-7 xl:grid-cols-2">
            {PROJECT_LIST.map((project) => (
              <article
                key={project.slug}
                className="overflow-hidden rounded-[2rem] border border-slate-200 bg-[#f8fbfa] p-5 shadow-sm"
              >
                <div className="rounded-[1.7rem] bg-white p-5">
                  <div className="relative h-72 overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-teal-100 via-white to-cyan-100">
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Layers3 className="h-20 w-20 text-teal-600" />
                      </div>
                    )}
                  </div>

                  <div className="pt-6">
                    <p className="mb-3 text-xs font-black uppercase tracking-[0.25em] text-teal-600">
                      Featured Project
                    </p>
                    <h3 className="text-3xl font-black text-slate-950">{project.title}</h3>
                    <p className="mt-4 line-clamp-3 text-base leading-8 text-slate-600">
                      {project.shortDescription || project.description}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-2">
                      {project.technologies?.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-wide text-slate-500"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="mt-8 flex flex-wrap gap-3">
                      {(project.liveDemoUrl || project.link) && (
                        <a
                          href={project.liveDemoUrl || project.link}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-primary px-5 py-3"
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Live Demo
                        </a>
                      )}

                      <Link href={`/projects/${project.slug}`} className="btn-secondary px-5 py-3">
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="container-custom py-20 lg:py-28">
        <div className="mb-12">
          <p className="mb-4 text-sm font-black uppercase tracking-[0.3em] text-teal-600">
            Testimonials
          </p>
          <h2 className="max-w-5xl text-4xl font-black tracking-tight text-slate-950 lg:text-6xl">
            Trusted by clients and students.
          </h2>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          {TESTIMONIALS_LIST.map((testimonial) => (
            <div
              key={testimonial.name}
              className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.06)]"
            >
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-teal-50 text-xl font-black text-teal-700">
                  {testimonial.image ? (
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    testimonial.name.charAt(0)
                  )}
                </div>

                <div>
                  <p className="text-xl font-black text-slate-950">{testimonial.name}</p>
                  <p className="text-sm font-medium text-slate-500">
                    {testimonial.role} • {testimonial.company}
                  </p>
                </div>
              </div>

              <p className="text-lg leading-9 text-slate-600">“{testimonial.content}”</p>

              <div className="mt-6 flex gap-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className={`h-5 w-5 ${
                      index < testimonial.rating ? 'fill-current' : ''
                    }`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-custom pb-20 lg:pb-28">
        <div className="overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-950 to-teal-800 p-8 text-white shadow-[0_35px_90px_rgba(15,23,42,0.18)] lg:p-14">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="mb-4 text-sm font-black uppercase tracking-[0.3em] text-white/60">
                Start your project
              </p>
              <h2 className="max-w-4xl text-4xl font-black tracking-tight lg:text-6xl">
                Need a beautiful, fast and user-friendly website?
              </h2>
              <p className="mt-6 max-w-3xl text-lg leading-9 text-white/75">
                Book a consultation and let&apos;s create your portfolio, LMS, dashboard,
                or custom business platform with modern design.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row lg:flex-col">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-sm font-black text-slate-950 transition hover:bg-slate-100"
              >
                Contact Me
                <MessageCircle className="ml-2 h-5 w-5" />
              </Link>

              <Link
                href="/courses"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-8 py-4 text-sm font-black text-white transition hover:bg-white/10"
              >
                Explore Courses
                <BookOpen className="ml-2 h-5 w-5" />
              </Link>
            </div>
>>>>>>> 39452b3218c264bf8748c8dfe3dc74174908cd26
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