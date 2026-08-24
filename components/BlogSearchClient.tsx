'use client'

import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Briefcase,
  Calendar,
  Clock,
  MessageCircle,
  Search,
  User,
} from 'lucide-react'
import { IBlog } from '@/types/models'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function estimateReadTime(content: string) {
  const words = content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

function formatDate(d?: string | Date) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const PLACEHOLDER_GRADIENTS = [
  'from-teal-500 to-emerald-600',
  'from-sky-500 to-blue-600',
  'from-violet-500 to-purple-600',
  'from-rose-500 to-pink-600',
  'from-amber-500 to-orange-600',
  'from-slate-500 to-slate-700',
]

function getPlaceholderGradient(slug: string) {
  let hash = 0
  for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) & 0xffff
  return PLACEHOLDER_GRADIENTS[hash % PLACEHOLDER_GRADIENTS.length]
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function CardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="h-44 bg-slate-100" />
      <div className="space-y-3 p-5">
        <div className="h-3 w-20 rounded-full bg-slate-100" />
        <div className="h-5 w-3/4 rounded bg-slate-100" />
        <div className="space-y-2">
          <div className="h-3 w-full rounded bg-slate-100" />
          <div className="h-3 w-5/6 rounded bg-slate-100" />
          <div className="h-3 w-4/6 rounded bg-slate-100" />
        </div>
        <div className="flex gap-3 border-t border-slate-100 pt-3">
          <div className="h-3 w-20 rounded bg-slate-100" />
          <div className="h-3 w-16 rounded bg-slate-100" />
        </div>
      </div>
    </div>
  )
}

// ─── Blog card ─────────────────────────────────────────────────────────────────

function BlogCard({ blog }: { blog: IBlog }) {
  const gradient = getPlaceholderGradient(blog.slug)
  const excerpt =
    blog.excerpt ||
    (blog.content
      ? blog.content.replace(/<[^>]*>/g, '').slice(0, 150) + '…'
      : '')
  const readMins = blog.content ? estimateReadTime(blog.content) : 1

  return (
    <Link
      href={`/blog/${blog.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-md"
    >
      {/* Thumbnail */}
      <div className="relative h-44 flex-shrink-0 overflow-hidden">
        {blog.image ? (
          <Image
            src={blog.image}
            alt={blog.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div
            className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${gradient}`}
          >
            <span className="text-xs font-bold uppercase tracking-widest text-white/80">
              {blog.category || 'Article'}
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        {blog.category && (
          <span className="mb-2 inline-block self-start rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-700">
            {blog.category}
          </span>
        )}

        <h2 className="mb-2 line-clamp-2 text-base font-bold leading-snug text-slate-900 transition-colors group-hover:text-teal-600">
          {blog.title}
        </h2>

        <p className="mb-4 flex-1 line-clamp-3 text-sm leading-relaxed text-slate-500">
          {excerpt}
        </p>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-slate-100 pt-3 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {blog.author || 'Shafiqul Islam'}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDate(blog.createdAt)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {readMins} min read
          </span>
          <span className="ml-auto flex items-center gap-1 font-semibold text-teal-600 transition-all group-hover:gap-2">
            Read More <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </Link>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function BlogSearchClient({ initialQuery }: { initialQuery: string }) {
  const [inputValue, setInputValue]         = useState(initialQuery)
  const [activeQuery, setActiveQuery]       = useState(initialQuery)
  const [blogs, setBlogs]                   = useState<IBlog[]>([])
  const [loading, setLoading]               = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [categories, setCategories]         = useState<string[]>([])

  const fetchBlogs = useCallback(async (q: string, category: string) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (q)        params.append('q', q)
      if (category) params.append('category', category)
      const { data } = await axios.get(`/api/blogs?${params.toString()}`)
      const results: IBlog[] = data.data || []
      setBlogs(results)
      if (!q && !category) {
        const cats = [
          ...new Set(results.map((b) => b.category).filter((c): c is string => !!c)),
        ]
        setCategories(cats)
      }
    } catch {
      setBlogs([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBlogs(initialQuery, '')
  }, [fetchBlogs, initialQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setActiveQuery(inputValue)
    fetchBlogs(inputValue, selectedCategory)
  }

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat)
    fetchBlogs(activeQuery, cat)
  }

  const clearFilters = () => {
    setInputValue('')
    setActiveQuery('')
    setSelectedCategory('')
    fetchBlogs('', '')
  }

  const hasFilters = !!activeQuery || !!selectedCategory

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* ═══════════════════════════════════════
          HERO
      ═══════════════════════════════════════ */}
      <section className="border-b border-slate-100 bg-white">
        <div className="container-custom py-16 lg:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-teal-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-teal-700">
              <BadgeCheck className="h-3.5 w-3.5" /> Developer Blog
            </span>
            <h1 className="mb-5 text-4xl font-black leading-tight tracking-tight text-slate-900 sm:text-5xl">
              Articles, Tutorials &amp;{' '}
              <span className="text-teal-600">Dev Insights</span>
            </h1>
            <p className="mb-8 text-base leading-relaxed text-slate-500 sm:text-lg">
              Practical web development content — Laravel, Next.js, MERN Stack, and full-stack
              techniques from real projects and teaching experience.
            </p>

            {/* Search bar in hero */}
            <form onSubmit={handleSearch} className="flex gap-2 sm:mx-auto sm:max-w-xl">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Search articles, tutorials, topics…"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-800 shadow-sm outline-none placeholder:text-slate-400 focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
                />
              </div>
              <button
                type="submit"
                className="rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-500"
              >
                Search
              </button>
            </form>
          </div>

          {/* Trust bar */}
          <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3">
            {[
              { icon: <BookOpen className="h-4 w-4" />,  label: 'Articles & Tutorials' },
              { icon: <Briefcase className="h-4 w-4" />, label: 'Based on Real Projects' },
              { icon: <Clock className="h-4 w-4" />,     label: 'Practical & Hands-on'  },
              { icon: <BadgeCheck className="h-4 w-4" />,label: '5+ Years Experience'   },
            ].map((item) => (
              <span
                key={item.label}
                className="flex items-center gap-2 text-sm font-medium text-slate-500"
              >
                <span className="text-teal-500">{item.icon}</span>
                {item.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          ARTICLES
      ═══════════════════════════════════════ */}
      <section className="container-custom py-14 lg:py-16">

        {/* Section heading */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="mb-2 inline-block text-xs font-bold uppercase tracking-widest text-teal-600">
              Latest Writing
            </span>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              {hasFilters ? 'Search Results' : 'All Articles'}
            </h2>
            {!loading && blogs.length > 0 && (
              <p className="mt-1 text-sm text-slate-400">
                {blogs.length} {blogs.length === 1 ? 'article' : 'articles'}
                {hasFilters && ' found'}
              </p>
            )}
          </div>

          {/* Category filters */}
          {!loading && categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleCategorySelect('')}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                  selectedCategory === ''
                    ? 'border-teal-600 bg-teal-600 text-white'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-teal-300 hover:text-teal-600'
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                    selectedCategory === cat
                      ? 'border-teal-600 bg-teal-600 text-white'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-teal-300 hover:text-teal-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-24 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
              <BookOpen className="h-6 w-6 text-slate-400" />
            </div>
            <h3 className="text-base font-semibold text-slate-700">
              {hasFilters ? 'No articles found' : 'No articles yet'}
            </h3>
            <p className="text-sm text-slate-400">
              {hasFilters
                ? 'Try a different keyword or category.'
                : 'Articles and tutorials will appear here once published.'}
            </p>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="rounded-full border border-teal-200 bg-teal-50 px-5 py-2 text-sm font-bold text-teal-700 transition hover:bg-teal-100"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════════
          CTA
      ═══════════════════════════════════════ */}
      <section className="container-custom pb-20">
        <div className="rounded-2xl bg-teal-600 px-8 py-14 text-center shadow-sm">
          <p className="mb-3 text-sm font-bold uppercase tracking-widest text-teal-200">
            Work With Me
          </p>
          <h2 className="mb-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
            Need help with a project?
          </h2>
          <p className="mx-auto mb-8 max-w-lg text-base text-teal-100">
            I&apos;m available for freelance web development — Laravel, Next.js, full-stack
            apps, and more. Let&apos;s build something great together.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-teal-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              Hire Me <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-full border border-teal-400 px-6 py-3 text-sm font-bold text-white transition hover:bg-teal-500"
            >
              <MessageCircle className="h-4 w-4" /> View Services
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
