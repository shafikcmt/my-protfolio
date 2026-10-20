import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="container-custom flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
      <p className="text-sm font-black uppercase tracking-[0.28em] text-teal-600">404</p>
      <h1 className="mt-3 text-4xl font-black text-slate-950">Page not found</h1>
      <p className="mt-3 max-w-md text-slate-600">The page you are looking for does not exist or has moved.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-primary px-6 py-3 text-sm">Go home</Link>
        <Link href="/projects" className="btn-secondary px-6 py-3 text-sm">View projects</Link>
        <Link href="/contact" className="btn-secondary px-6 py-3 text-sm">Contact me</Link>
      </div>
    </section>
  )
}
