'use client'

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="container-custom flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
      <h1 className="text-3xl font-black text-slate-950">Something went wrong</h1>
      <p className="mt-3 max-w-md text-slate-600">An unexpected error occurred. Please try again.</p>
      <button onClick={reset} className="btn-primary mt-8 px-6 py-3 text-sm">Try again</button>
    </section>
  )
}
