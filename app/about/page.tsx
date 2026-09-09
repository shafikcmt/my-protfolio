import Link from 'next/link'
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Briefcase,
  CheckCircle2,
  Clock,
  Code2,
  Database,
  GraduationCap,
  MapPin,
  MessageCircle,
  Monitor,
  Server,
  Settings,
  Sparkles,
  Users,
  Wrench,
  Zap,
} from 'lucide-react'
import SkillCard from '@/components/SkillCard'
import ExperienceTimeline from '@/components/ExperienceTimeline'
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal'
import {
  ABOUT_COUNTERS,
  ABOUT_SUMMARY,
  EDUCATION_TIMELINE,
  EXPERIENCE_TIMELINE,
  SERVICE_LIST,
  SKILL_SECTIONS,
  WORK_PROCESS,
} from '@/lib/constants'

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata = {
  title: 'About — Md Shafiqul Islam',
  description:
    'Full Stack Web Developer & Technical Trainer with 5+ years of experience in Laravel, React, Next.js. Learn about my journey, skills, and services.',
}

// ─── Skill group icon map ──────────────────────────────────────────────────────

const SKILL_ICONS: Record<string, React.ReactNode> = {
  Frontend:  <Monitor  className="h-4 w-4" />,
  Backend:   <Server   className="h-4 w-4" />,
  Database:  <Database className="h-4 w-4" />,
  Tools:     <Settings className="h-4 w-4" />,
  Other:     <Sparkles className="h-4 w-4" />,
}

// ─── Services to show on About page ──────────────────────────────────────────

const ABOUT_SERVICES = [
  {
    icon: <Monitor  className="h-5 w-5" />,
    title: 'Portfolio & Business Websites',
    description: 'Clean, fast, and SEO-friendly websites built with Next.js and Tailwind CSS.',
    accent: 'bg-sky-50 text-sky-700',
  },
  {
    icon: <Server   className="h-5 w-5" />,
    title: 'Laravel Web Application',
    description: 'Robust Laravel backends with admin panels, authentication, and custom workflows.',
    accent: 'bg-red-50 text-red-700',
  },
  {
    icon: <Code2    className="h-5 w-5" />,
    title: 'React / Next.js Development',
    description: 'Modern React and Next.js applications with fast load times and great UX.',
    accent: 'bg-teal-50 text-teal-700',
  },
  {
    icon: <BookOpen className="h-5 w-5" />,
    title: 'LMS / Training Platform',
    description: 'Feature-rich Learning Management Systems with student dashboards and quizzes.',
    accent: 'bg-violet-50 text-violet-700',
  },
  {
    icon: <Briefcase className="h-5 w-5" />,
    title: 'Admin Dashboard / CRM',
    description: 'Custom admin panels, dashboards, and CRM tools for business operations.',
    accent: 'bg-amber-50 text-amber-700',
  },
  {
    icon: <Wrench   className="h-5 w-5" />,
    title: 'Bug Fixing & Deployment',
    description: 'Fast diagnosis of bugs, performance issues, and production deployment setup.',
    accent: 'bg-emerald-50 text-emerald-700',
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* ═══════════════════════════════════════════════════════════
          1. HERO
      ═══════════════════════════════════════════════════════════ */}
      <section className="border-b border-slate-100 bg-white">
        <div className="container-custom py-16 lg:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-2">

            {/* Left: text */}
            <Reveal variant="slide-right" duration={0.75}>
              <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-teal-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-teal-700">
                <BadgeCheck className="h-3.5 w-3.5" /> About Me
              </span>
              <h1 className="mb-5 text-4xl font-black leading-tight tracking-tight text-slate-900 sm:text-5xl">
                Full Stack Developer<br className="hidden sm:block" />
                <span className="text-teal-600"> & Technical Trainer</span>
              </h1>
              <p className="mb-8 max-w-lg text-base leading-relaxed text-slate-600">
                {ABOUT_SUMMARY}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="btn-primary gap-2"
                >
                  Hire Me <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/projects"
                  className="btn-secondary gap-2"
                >
                  View Projects
                </Link>
              </div>

              {/* Availability + Location */}
              <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-500" />
                  </span>
                  Available for freelance work
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  Bangladesh · Remote OK
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  &lt;24h response
                </span>
              </div>
            </Reveal>

            {/* Right: quick info card */}
            <Reveal variant="slide-left" duration={0.75} className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-600 text-2xl font-black text-white">
                  S
                </div>
                <div>
                  <p className="font-bold text-slate-900">Md Shafiqul Islam</p>
                  <p className="text-sm text-slate-500">Full Stack Developer & Trainer</p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { icon: <Code2       className="h-4 w-4" />, label: 'Speciality', value: 'Laravel · React · Next.js' },
                  { icon: <Briefcase   className="h-4 w-4" />, label: 'Experience', value: '5+ Years' },
                  { icon: <MapPin      className="h-4 w-4" />, label: 'Location',   value: 'Bangladesh (Remote available)' },
                  { icon: <MessageCircle className="h-4 w-4" />, label: 'Languages', value: 'Bangla · English' },
                  { icon: <GraduationCap className="h-4 w-4" />, label: 'Education', value: 'M.Tech in CSE' },
                ].map((row) => (
                  <div key={row.label} className="flex items-start gap-3 text-sm">
                    <span className="mt-0.5 flex-shrink-0 text-teal-500">{row.icon}</span>
                    <span className="w-24 flex-shrink-0 text-slate-400">{row.label}</span>
                    <span className="font-medium text-slate-700">{row.value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 border-t border-slate-200 pt-4">
                <a
                  href="mailto:mdshafiqulislam822@gmail.com"
                  className="flex items-center gap-2 text-sm font-semibold text-teal-600 hover:text-teal-500"
                >
                  mdshafiqulislam822@gmail.com
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          2. STATS BAR
      ═══════════════════════════════════════════════════════════ */}
      <section className="border-b border-slate-100 bg-[#F8FAFC] py-8">
        <div className="container-custom">
          <Stagger className="grid grid-cols-2 gap-4 lg:grid-cols-4" stagger={0.08} amount={0.5}>
            {ABOUT_COUNTERS.map((item) => (
              <StaggerItem
                key={item.label}
                as="div"
                variant="scale"
                className="group rounded-2xl border border-slate-200 bg-white px-6 py-5 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-md"
              >
                <p className="text-3xl font-black text-teal-600 transition-transform duration-300 group-hover:scale-110">{item.value}</p>
                <p className="mt-1 text-sm text-slate-500">{item.label}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          3. WHO I AM — DETAILS
      ═══════════════════════════════════════════════════════════ */}
      <section className="container-custom py-16 lg:py-20">
        <Reveal variant="rise" className="mb-10">
          <span className="mb-3 inline-block text-xs font-bold uppercase tracking-widest text-teal-600">
            My Story
          </span>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Who I Am &amp; What I Do
          </h2>
        </Reveal>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left: bio text */}
          <Reveal variant="slide-right" className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-3 text-base font-bold text-slate-900">My Background</h3>
              <p className="text-sm leading-relaxed text-slate-600">
                I am a Full Stack Web Developer and Technical Trainer with 5+ years of experience
                building production-grade web applications. My journey started with a passion for
                problem-solving and grew into expertise across Laravel, React, Next.js, and modern
                full-stack technologies.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                I have worked with tech companies, universities, and manufacturing industries —
                delivering LMS platforms, ERP systems, eCommerce marketplaces, and business
                dashboards that solve real-world problems.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-3 text-base font-bold text-slate-900">Core Strengths</h3>
              <ul className="space-y-2.5">
                {[
                  'Laravel, MERN, and Next.js full-stack development',
                  'Secure, scalable LMS and eCommerce platforms',
                  'ERP automation and business dashboard design',
                  'Technical training and mentoring developers',
                  'REST API design and third-party integrations',
                  'Production deployment and server management',
                ].map((strength) => (
                  <li key={strength} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-teal-500" />
                    {strength}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Right: education */}
          <Reveal variant="slide-left" className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2.5">
                <GraduationCap className="h-5 w-5 text-teal-600" />
                <h3 className="text-base font-bold text-slate-900">Education</h3>
              </div>
              <div className="space-y-4">
                {EDUCATION_TIMELINE.map((edu) => (
                  <div
                    key={edu.title}
                    className="relative border-l-2 border-teal-100 pl-4"
                  >
                    <span className="text-xs font-bold uppercase tracking-widest text-teal-600">
                      {edu.period}
                    </span>
                    <h4 className="mt-1 text-sm font-bold text-slate-800">{edu.title}</h4>
                    <p className="text-xs text-slate-500">{edu.institution}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-teal-100 bg-teal-50 p-6">
              <div className="mb-3 flex items-center gap-2">
                <Users className="h-5 w-5 text-teal-700" />
                <h3 className="text-base font-bold text-teal-900">Training &amp; Mentoring</h3>
              </div>
              <p className="text-sm leading-relaxed text-teal-800">
                Beyond development, I am passionate about teaching. I have trained 200+ students
                in modern web development through structured courses, live workshops, and hands-on
                project mentoring at institutions across Bangladesh and India.
              </p>
              <Link
                href="/contact"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-teal-700 hover:text-teal-600"
              >
                Explore Training Programs <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          4. SKILLS
      ═══════════════════════════════════════════════════════════ */}
      <section className="border-y border-slate-100 bg-white py-16 lg:py-20">
        <div className="container-custom">
          <div className="mb-10">
            <span className="mb-3 inline-block text-xs font-bold uppercase tracking-widest text-teal-600">
              Technical Skills
            </span>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Skills &amp; Technologies
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-500">
              A complete set of technologies and tools I use to build modern, scalable web applications.
            </p>
          </div>

          <Stagger className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.09}>
            {SKILL_SECTIONS.map((section) => (
              <StaggerItem key={section.category} as="div" variant="rise">
                <SkillCard
                  category={section.category}
                  items={section.items}
                  icon={SKILL_ICONS[section.category]}
                />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          5. EXPERIENCE TIMELINE
      ═══════════════════════════════════════════════════════════ */}
      <section className="container-custom py-16 lg:py-20">
        <div className="mb-10">
          <span className="mb-3 inline-block text-xs font-bold uppercase tracking-widest text-teal-600">
            Work History
          </span>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Experience Timeline
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-500">
            Professional milestones that shaped my expertise in development and training.
          </p>
        </div>
        <ExperienceTimeline items={EXPERIENCE_TIMELINE} />
      </section>

      {/* ═══════════════════════════════════════════════════════════
          6. SERVICES
      ═══════════════════════════════════════════════════════════ */}
      <section className="border-y border-slate-100 bg-white py-16 lg:py-20">
        <div className="container-custom">
          <div className="mb-10">
            <span className="mb-3 inline-block text-xs font-bold uppercase tracking-widest text-teal-600">
              What I Offer
            </span>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Services I Can Help With
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-500">
              From custom web applications to training programs — here&apos;s how I can help your project succeed.
            </p>
          </div>

          <Stagger className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
            {ABOUT_SERVICES.map((svc) => (
              <StaggerItem
                key={svc.title}
                as="div"
                variant="scale"
                className="group rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6 transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1.5 hover:border-teal-200 hover:shadow-md"
              >
                <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-105 ${svc.accent}`}>
                  {svc.icon}
                </div>
                <h3 className="mb-2 text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                  {svc.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-500">{svc.description}</p>
              </StaggerItem>
            ))}
          </Stagger>

          <div className="mt-8 text-center">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-sm font-semibold text-teal-600 hover:text-teal-500"
            >
              View all services <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          7. WORK PROCESS
      ═══════════════════════════════════════════════════════════ */}
      <section className="container-custom py-16 lg:py-20">
        <div className="mb-10">
          <span className="mb-3 inline-block text-xs font-bold uppercase tracking-widest text-teal-600">
            How I Work
          </span>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            My Work Process
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-500">
            A clear, structured approach that keeps every project on track from start to delivery.
          </p>
        </div>

        <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5" stagger={0.1}>
          {WORK_PROCESS.map((step, idx) => (
            <StaggerItem key={step.step} as="div" variant="rise" className="group relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-md">
              {/* Connector arrow on large screens */}
              {idx < WORK_PROCESS.length - 1 && (
                <div className="absolute -right-2 top-1/2 z-10 hidden -translate-y-1/2 xl:block">
                  <div className="flex h-4 w-4 items-center justify-center rounded-full border border-teal-200 bg-white">
                    <ArrowRight className="h-2.5 w-2.5 text-teal-400" />
                  </div>
                </div>
              )}
              <span className="mb-3 block text-2xl font-black text-teal-100 transition-colors duration-300 group-hover:text-teal-300">{step.step}</span>
              <h3 className="mb-2 text-sm font-bold text-slate-900">{step.title}</h3>
              <p className="text-xs leading-relaxed text-slate-500">{step.description}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          8. WHY WORK WITH ME — 3 HIGHLIGHTS
      ═══════════════════════════════════════════════════════════ */}
      <section className="border-y border-slate-100 bg-white py-16 lg:py-20">
        <div className="container-custom">
          <div className="mb-10 text-center">
            <span className="mb-3 inline-block text-xs font-bold uppercase tracking-widest text-teal-600">
              Why Work With Me
            </span>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Quality You Can Count On
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-500">
              Every project is delivered with the same standard — clean code, clear
              communication, and support that doesn&apos;t stop at handover.
            </p>
          </div>

          <Stagger className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4" stagger={0.08}>
            {[
              {
                icon: <Zap          className="h-5 w-5" />,
                title: 'Fast & Clean Code',
                body: 'Optimized, well-structured code with fast load times and easy-to-maintain architecture.',
                accent: 'bg-amber-50 text-amber-600',
              },
              {
                icon: <CheckCircle2 className="h-5 w-5" />,
                title: 'After-Delivery Support',
                body: 'Bug fixes, updates and guidance after project delivery — I stay available for my clients.',
                accent: 'bg-emerald-50 text-emerald-600',
              },
              {
                icon: <MessageCircle className="h-5 w-5" />,
                title: 'Bangla & English Support',
                body: 'I communicate fluently in both Bangla and English — no miscommunication for Bangladeshi clients.',
                accent: 'bg-teal-50 text-teal-600',
              },
              {
                icon: <Users        className="h-5 w-5" />,
                title: 'Client-Focused Process',
                body: 'Regular progress updates at every milestone — you always know where your project stands.',
                accent: 'bg-sky-50 text-sky-600',
              },
            ].map((item) => (
              <StaggerItem key={item.title} as="div" variant="rise" className="group rounded-2xl border border-slate-200 bg-[#F8FAFC] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-md">
                <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-105 ${item.accent}`}>
                  {item.icon}
                </div>
                <h3 className="mb-1.5 text-sm font-bold text-slate-900">{item.title}</h3>
                <p className="text-xs leading-relaxed text-slate-500">{item.body}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          9. CTA SECTION
      ═══════════════════════════════════════════════════════════ */}
      <section className="container-custom py-16 lg:py-20">
        <Reveal variant="scale" duration={0.7} className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-600 to-teal-700 px-8 py-14 text-center glow-pulse">
          <span className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
          <span className="pointer-events-none absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-teal-300/20 blur-3xl" />
          <p className="relative mb-3 text-sm font-bold uppercase tracking-widest text-teal-200">
            Ready to Start?
          </p>
          <h2 className="relative mb-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
            Need a clean, fast &amp; user-friendly<br className="hidden sm:block" />
            web solution?
          </h2>
          <p className="relative mx-auto mb-8 max-w-xl text-base text-teal-100">
            Whether you need a new project built, a ready solution customized, or a development
            course — let&apos;s connect and make it happen.
          </p>
          <div className="relative flex flex-wrap justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-teal-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              Start a Project <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 rounded-full border border-teal-400 bg-transparent px-6 py-3 text-sm font-bold text-white transition hover:bg-teal-500"
            >
              Browse Projects
            </Link>
          </div>
        </Reveal>
      </section>

    </div>
  )
}
