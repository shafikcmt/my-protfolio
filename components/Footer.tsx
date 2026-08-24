import Link from 'next/link'
import { ArrowRight, Facebook, Github, Linkedin, Mail, MapPin, MessageCircle } from 'lucide-react'

const EXPLORE_LINKS = [
  { label: 'About Me',  href: '/about'    },
  { label: 'Services',  href: '/services' },
  { label: 'Projects',  href: '/projects' },
  { label: 'Blog',      href: '/blog'     },
]

const PLATFORM_LINKS = [
  { label: 'Courses',           href: '/courses'            },
  { label: 'Book Consultation', href: '/book-consultation'  },
  { label: 'Order Project',     href: '/order-project'      },
  { label: 'Dashboard',         href: '/dashboard'          },
]

const SOCIAL_LINKS = [
  { label: 'GitHub',    href: 'https://github.com/shafikcmt',         icon: Github    },
  { label: 'LinkedIn',  href: 'https://linkedin.com/in/shafikcmt',    icon: Linkedin  },
  { label: 'Facebook',  href: '#',                                     icon: Facebook  },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-slate-100 bg-white">
      <div className="container-custom py-14">

        {/* Main grid */}
        <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr_1fr_1.2fr]">

          {/* ── Brand column ── */}
          <div>
            <Link href="/" className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-600 to-teal-500 text-sm font-black text-white shadow-sm">
                SI
              </div>
              <div>
                <p className="text-base font-black tracking-tight text-slate-900 leading-none">Shafiqul Islam</p>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mt-0.5">Full Stack Developer & Trainer</p>
              </div>
            </Link>

            <p className="mb-5 max-w-xs text-sm leading-relaxed text-slate-500">
              Building modern web applications, LMS platforms, and business-grade software.
              Available for freelance projects and live training programs.
            </p>

            {/* Social icons */}
            <div className="mb-5 flex gap-2">
              {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-600"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>

            {/* Availability badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-3 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-500" />
              </span>
              <span className="text-xs font-semibold text-teal-700">Available for freelance work</span>
            </div>
          </div>

          {/* ── Explore links ── */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">
              Explore
            </h4>
            <ul className="space-y-3">
              {EXPLORE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-slate-600 transition hover:text-teal-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Platform links ── */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">
              Platform
            </h4>
            <ul className="space-y-3">
              {PLATFORM_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-slate-600 transition hover:text-teal-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact column ── */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">
              Get in Touch
            </h4>
            <div className="space-y-3">
              <a
                href="mailto:mdshafiqulislam822@gmail.com"
                className="group flex items-center gap-2.5 text-sm text-slate-600 transition hover:text-teal-600"
              >
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-400 transition group-hover:border-teal-200 group-hover:bg-teal-50 group-hover:text-teal-600">
                  <Mail className="h-3.5 w-3.5" />
                </div>
                <span className="truncate">mdshafiqulislam822@gmail.com</span>
              </a>

              <a
                href="https://wa.me/8801234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2.5 text-sm text-slate-600 transition hover:text-teal-600"
              >
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-400 transition group-hover:border-teal-200 group-hover:bg-teal-50 group-hover:text-teal-600">
                  <MessageCircle className="h-3.5 w-3.5" />
                </div>
                +880 1234 567890
              </a>

              <div className="flex items-center gap-2.5 text-sm text-slate-500">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-teal-500">
                  <MapPin className="h-3.5 w-3.5" />
                </div>
                Bangladesh · Remote OK
              </div>
            </div>

            <Link
              href="/contact"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-teal-600 hover:text-teal-500"
            >
              Send an enquiry <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-400">
            © {year} Md Shafiqul Islam. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            {[
              { label: 'Privacy Policy', href: '#' },
              { label: 'Terms of Use',   href: '#' },
              { label: 'Sitemap',        href: '#' },
            ].map((l) => (
              <Link key={l.label} href={l.href} className="text-xs text-slate-400 transition hover:text-teal-600">
                {l.label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  )
}
