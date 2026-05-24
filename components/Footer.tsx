import Link from 'next/link'
import { ArrowUpRight, Facebook, Github, Linkedin, Mail, Phone } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    Navigation: [
      { label: 'About', href: '/about' },
      { label: 'Services', href: '/services' },
      { label: 'Projects', href: '/projects' },
      { label: 'Courses', href: '/courses' },
    ],
    Platform: [
      { label: 'Book Consultation', href: '/book-consultation' },
      { label: 'Order Project', href: '/order-project' },
      { label: 'Blog', href: '/blog' },
      { label: 'Dashboard', href: '/dashboard' },
    ],
  }

  const socialLinks = [
    { label: 'GitHub', href: '#', icon: Github },
    { label: 'LinkedIn', href: '#', icon: Linkedin },
    { label: 'Facebook', href: '#', icon: Facebook },
    { label: 'Email', href: 'mailto:mdshafiqul@example.com', icon: Mail },
  ]

  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="container-custom py-16">
        <div className="surface-card overflow-hidden rounded-[2rem] p-8 sm:p-10 lg:p-12">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
            <div>
              <span className="inline-flex rounded-full bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-700">
                Build modern products with confidence
              </span>
              <h3 className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Need a clean, fast, and user-friendly web solution?
              </h3>
              <p className="mt-4 max-w-xl text-base leading-8 text-slate-600">
                I design and build polished portfolio websites, admin dashboards, LMS platforms, and custom business tools with a strong focus on usability and performance.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/contact" className="btn-primary">
                  Start a Project
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
                <a href="mailto:mdshafiqul@example.com" className="btn-secondary">
                  <Mail className="mr-2 h-4 w-4" />
                  mdshafiqul@example.com
                </a>
              </div>
              <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-600">
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-4 py-2"><Phone className="h-4 w-4 text-teal-600" />+880 1234-567890</span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-4 py-2">Available for freelance & training</span>
              </div>
            </div>

            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="text-sm font-black uppercase tracking-[0.22em] text-slate-500">{category}</h4>
                <ul className="mt-5 space-y-4">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-sm font-medium text-slate-700 transition hover:text-teal-600">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-4 border-t border-slate-200 pt-6 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-slate-500">© {currentYear} Md Shafiqul Islam. All rights reserved.</p>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <Link
                  key={label}
                  href={href}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
