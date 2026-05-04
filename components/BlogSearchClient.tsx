'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { IBlog } from '@/types/models'

interface BlogSearchClientProps {
  initialQuery: string
}

export default function BlogSearchClient({ initialQuery }: BlogSearchClientProps) {
  const [query, setQuery] = useState(initialQuery)
  const [blogs, setBlogs] = useState<IBlog[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    fetchBlogs(initialQuery)
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get('/api/blogs')
      const uniqueCategories = [...new Set(data.data.map((b: IBlog) => b.category).filter((cat: string | undefined): cat is string => cat !== undefined && cat !== null))] as string[]
      setCategories(uniqueCategories)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const fetchBlogs = async (searchQuery = '', category = '') => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchQuery) params.append('q', searchQuery)
      if (category) params.append('category', category)
      
      const { data } = await axios.get(`/api/blogs?${params.toString()}`)
      setBlogs(data.data || [])
    } catch (error) {
      console.error('Failed to fetch blogs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await fetchBlogs(query, selectedCategory)
  }

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category)
    fetchBlogs(query, category)
  }

  return (
    <main className="min-h-screen bg-white dark:bg-dark-900 py-16">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Blog</h1>
          <p className="text-gray-600 dark:text-gray-400">Search and explore published articles, tutorials, and case studies.</p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-10 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search blogs by title, excerpt, or category"
            className="flex-1 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-dark-800 px-4 py-3 text-gray-900 dark:text-white"
          />
          <button type="submit" className="btn-primary w-full sm:w-auto">
            Search
          </button>
        </form>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            <button
              onClick={() => handleCategoryFilter('')}
              className={`rounded-full px-4 py-2 transition-colors ${
                selectedCategory === ''
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-dark-800 text-gray-900 dark:text-gray-300 hover:bg-primary-600/20'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryFilter(category)}
                className={`rounded-full px-4 py-2 transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 dark:bg-dark-800 text-gray-900 dark:text-gray-300 hover:bg-primary-600/20'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
          </div>
        ) : blogs.length === 0 ? (
          <div className="rounded-3xl bg-gray-50 dark:bg-dark-800 p-10 text-center">
            <p className="text-gray-600 dark:text-gray-400">No blogs found. Try a different keyword.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {blogs.map((blog) => (
              <Link
                key={blog._id}
                href={`/blog/${blog.slug}`}
                className="rounded-3xl bg-white dark:bg-dark-800 border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all hover:border-primary-500 dark:hover:border-primary-500 group"
              >
                <div className="mb-4">
                  <p className="text-sm uppercase tracking-[0.2em] text-primary-600 dark:text-primary-400">
                    {blog.category || 'Article'}
                  </p>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                    {blog.title}
                  </h2>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-5 line-clamp-3">
                  {blog.excerpt || (blog.content && blog.content.slice(0, 120) + '...')}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>{blog.author || 'Md Shafiqul Islam'}</span>
                  <span>{new Date(blog.createdAt || '').toLocaleDateString()}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
