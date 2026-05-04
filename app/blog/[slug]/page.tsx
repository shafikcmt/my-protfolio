'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import Link from 'next/link'
import Image from 'next/image'

interface BlogPost {
  _id: string
  title: string
  slug: string
  content: string
  excerpt: string
  image: string
  author: string
  category: string
  tags: string[]
  views: number
  published: boolean
  createdAt: string
  updatedAt: string
}

export default function BlogDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const [blog, setBlog] = useState<BlogPost | null>(null)
  const [relatedBlogs, setRelatedBlogs] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true)
        const { data } = await axios.get(`/api/blogs?slug=${slug}`)

        if (data.success && data.data.length > 0) {
          const blogPost = data.data[0]
          setBlog(blogPost)

          // Increment views
          await axios.patch(`/api/blogs/${blogPost._id}`, { views: blogPost.views + 1 })

          // Fetch related blogs (same category)
          const { data: relatedData } = await axios.get(`/api/blogs?category=${blogPost.category}&limit=3`)
          setRelatedBlogs(relatedData.data.filter((b: BlogPost) => b._id !== blogPost._id))
        } else {
          setError('Blog post not found')
        }
      } catch (err) {
        console.error('Failed to fetch blog:', err)
        setError('Failed to load blog post')
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchBlog()
    }
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
        <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-3/4 rounded-lg bg-gray-700" />
            <div className="h-96 rounded-lg bg-gray-700" />
            <div className="space-y-2">
              <div className="h-4 w-full rounded bg-gray-700" />
              <div className="h-4 w-5/6 rounded bg-gray-700" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
        <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8 text-center">
          <h1 className="mb-4 text-3xl font-bold text-white">{error || 'Blog not found'}</h1>
          <Link href="/blog" className="text-primary-400 hover:text-primary-300">
            ← Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 text-white">
      {/* Header */}
      <div className="border-b border-gray-700 bg-dark-800/50 backdrop-blur">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/blog" className="text-primary-400 hover:text-primary-300">
            ← Back to Blog
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero Image */}
        {blog.image && (
          <div className="mb-8 overflow-hidden rounded-xl border border-gray-700">
            <div className="relative h-96 w-full bg-dark-700">
              <Image
                src={blog.image}
                alt={blog.title}
                fill
                className="object-cover"
              />
            </div>
          </div>
        )}

        {/* Title */}
        <h1 className="mb-4 text-4xl font-bold sm:text-5xl">{blog.title}</h1>

        {/* Meta Information */}
        <div className="mb-8 flex flex-wrap items-center gap-4 text-gray-400">
          <span>By {blog.author || 'Md Shafiqul Islam'}</span>
          <span>•</span>
          <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
          <span>•</span>
          <span>{blog.views} views</span>
          <span>•</span>
          <span className="inline-block rounded-full bg-primary-600/20 px-3 py-1 text-sm text-primary-400">
            {blog.category}
          </span>
        </div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            {blog.tags.map((tag, index) => (
              <span
                key={index}
                className="rounded-lg border border-gray-700 bg-dark-700/50 px-3 py-1 text-sm text-gray-300 hover:border-primary-500 transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="prose prose-invert mb-12 max-w-none">
          <div
            className="space-y-4 text-lg leading-relaxed text-gray-300"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>

        {/* Divider */}
        <div className="my-12 border-t border-gray-700" />

        {/* Author Card */}
        <div className="mb-12 rounded-lg border border-gray-700 bg-dark-800/50 p-8 backdrop-blur">
          <h3 className="mb-2 text-xl font-semibold">About the Author</h3>
          <p className="text-gray-400">
            Md Shafiqul Islam is a Full Stack Web Developer with 4+ years of experience in Laravel, MERN, and Next.js. 
            He specializes in building scalable web applications and providing technical training.
          </p>
        </div>

        {/* Related Posts */}
        {relatedBlogs.length > 0 && (
          <div>
            <h2 className="mb-8 text-2xl font-bold">Related Posts</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedBlogs.map((relatedBlog) => (
                <Link
                  key={relatedBlog._id}
                  href={`/blog/${relatedBlog.slug}`}
                  className="group rounded-lg border border-gray-700 bg-dark-800/50 p-6 backdrop-blur transition-all hover:border-primary-500 hover:bg-dark-700"
                >
                  {relatedBlog.image && (
                    <div className="mb-4 overflow-hidden rounded-lg">
                      <div className="relative h-40 w-full bg-dark-700">
                        <Image
                          src={relatedBlog.image}
                          alt={relatedBlog.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform"
                        />
                      </div>
                    </div>
                  )}
                  <h3 className="mb-2 font-semibold line-clamp-2 group-hover:text-primary-400">
                    {relatedBlog.title}
                  </h3>
                  <p className="mb-4 text-sm text-gray-400 line-clamp-2">{relatedBlog.excerpt}</p>
                  <span className="text-sm text-primary-400">Read More →</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  )
}
