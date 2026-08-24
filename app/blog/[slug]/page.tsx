'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  Eye,
  Tag,
  User,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface BlogPost {
  _id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  image?: string
  author?: string
  category?: string
  tags?: string[]
  views?: number
  published?: boolean
  createdAt: string
  updatedAt: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function estimateReadTime(content: string) {
  const words = content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function DetailSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-3 w-20 rounded-full bg-slate-100" />
      <div className="h-8 w-3/4 rounded-lg bg-slate-100" />
      <div className="flex gap-4">
        <div className="h-3 w-24 rounded bg-slate-100" />
        <div className="h-3 w-20 rounded bg-slate-100" />
        <div className="h-3 w-16 rounded bg-slate-100" />
      </div>
      <div className="h-60 rounded-2xl bg-slate-100 sm:h-80" />
      <div className="space-y-3 pt-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-3.5 rounded bg-slate-100"
            style={{ width: `${60 + (i % 4) * 10}%` }}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BlogDetailPage() {
  const params = useParams()
  const slug = params.slug as string

  const [blog, setBlog] = useState<BlogPost | null>(null)
  const [relatedBlogs, setRelatedBlogs] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!slug) return
    const fetchBlog = async () => {
      try {
        setLoading(true)
        setError('')
        const { data } = await axios.get(`/api/blogs?slug=${encodeURIComponent(slug)}`)
        if (data.success && data.data.length > 0) {
          const post: BlogPost = data.data[0]
          setBlog(post)
          // Increment views silently
          axios
            .patch(`/api/blogs/${post._id}`, { views: (post.views || 0) + 1 })
            .catch(() => {})
          // Related posts
          if (post.category) {
            const { data: rel } = await axios.get(
              `/api/blogs?category=${encodeURIComponent(post.category)}&limit=4`
            )
            setRelatedBlogs(
              (rel.data || []).filter((b: BlogPost) => b._id !== post._id).slice(0, 3)
            )
          }
        } else {
          setError('Blog post not found')
        }
      } catch {
        setError('Failed to load blog post')
      } finally {
        setLoading(false)
      }
    }
    fetchBlog()
  }, [slug])

  // ── Loading state ──
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <div className="sticky top-0 z-10 border-b border-slate-100 bg-white/90 backdrop-blur">
          <div className="mx-auto max-w-3xl px-4 py-3.5 sm:px-6">
            <div className="h-4 w-24 animate-pulse rounded bg-slate-100" />
          </div>
        </div>
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <DetailSkeleton />
        </div>
      </div>
    )
  }

  // ── Error state ──
  if (error || !blog) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#F8FAFC] px-4 text-center">
        <h1 className="text-2xl font-bold text-slate-800">{error || 'Blog not found'}</h1>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-semibold text-teal-600 hover:text-teal-500"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </Link>
      </div>
    )
  }

  const readMins = estimateReadTime(blog.content)

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* Sticky top nav */}
      <div className="sticky top-0 z-10 border-b border-slate-100 bg-white/90 backdrop-blur">
        <div className="mx-auto max-w-3xl px-4 py-3.5 sm:px-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-teal-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
        </div>
      </div>

      {/* Article */}
      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:py-14">

        {/* Category badge */}
        {blog.category && (
          <span className="mb-4 inline-block rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
            {blog.category}
          </span>
        )}

        {/* Title */}
        <h1 className="mb-5 text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-[2.625rem]">
          {blog.title}
        </h1>

        {/* Meta row */}
        <div className="mb-8 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-slate-100 pb-6 text-sm text-slate-500">
          <span className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-slate-400" />
            {blog.author || 'Md Shafiqul Islam'}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            {formatDate(blog.createdAt)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            {readMins} min read
          </span>
          {(blog.views ?? 0) > 0 && (
            <span className="flex items-center gap-1.5">
              <Eye className="h-3.5 w-3.5 text-slate-400" />
              {blog.views} views
            </span>
          )}
        </div>

        {/* Featured image */}
        {blog.image && (
          <div className="mb-10 overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
            <div className="relative h-64 w-full sm:h-80 lg:h-96">
              <Image
                src={blog.image}
                alt={blog.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        )}

        {/* Article content */}
        <div
          className="
            prose prose-slate max-w-none
            prose-headings:font-bold prose-headings:text-slate-900 prose-headings:tracking-tight
            prose-h2:text-2xl prose-h3:text-xl
            prose-p:text-slate-600 prose-p:leading-relaxed
            prose-a:text-teal-600 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-slate-800
            prose-code:rounded prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-teal-700 prose-code:font-normal prose-code:before:content-none prose-code:after:content-none
            prose-pre:rounded-xl prose-pre:bg-slate-900 prose-pre:shadow-sm
            prose-img:rounded-xl prose-img:shadow-sm
            prose-blockquote:border-teal-400 prose-blockquote:text-slate-500 prose-blockquote:not-italic
            prose-ul:text-slate-600 prose-ol:text-slate-600
            prose-li:text-slate-600
            prose-hr:border-slate-200
          "
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap items-center gap-2">
            <Tag className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Author card */}
        <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-teal-100 text-lg font-bold text-teal-700">
              S
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-900">
                {blog.author || 'Md Shafiqul Islam'}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-slate-500">
                Full Stack Web Developer with 5+ years of experience in Laravel, React, and
                Next.js. Specializing in scalable web applications and developer training.
              </p>
              <Link
                href="/contact"
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600 hover:text-teal-500"
              >
                Get in touch <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </article>

      {/* Related posts */}
      {relatedBlogs.length > 0 && (
        <div className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
            <h2 className="mb-7 text-xl font-bold text-slate-900">Related Articles</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {relatedBlogs.map((rel) => (
                <Link
                  key={rel._id}
                  href={`/blog/${rel.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-[#F8FAFC] shadow-sm transition-all hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-md"
                >
                  {rel.image ? (
                    <div className="relative h-36 overflow-hidden">
                      <Image
                        src={rel.image}
                        alt={rel.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="flex h-36 items-center justify-center bg-gradient-to-br from-teal-500 to-cyan-600">
                      <span className="text-xs font-bold uppercase tracking-widest text-white/80">
                        {rel.category || 'Article'}
                      </span>
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-4">
                    {rel.category && (
                      <span className="mb-1.5 self-start rounded-full bg-teal-50 px-2 py-0.5 text-xs font-semibold text-teal-700">
                        {rel.category}
                      </span>
                    )}
                    <h3 className="line-clamp-2 text-sm font-semibold text-slate-800 transition-colors group-hover:text-teal-600">
                      {rel.title}
                    </h3>
                    <span className="mt-3 flex items-center gap-1 text-xs font-semibold text-teal-600">
                      Read More <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
