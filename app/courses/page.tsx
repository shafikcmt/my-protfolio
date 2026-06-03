'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import { BookOpen } from 'lucide-react'
import CourseCard from '@/components/CourseCard'
import LoadingSpinner from '@/components/LoadingSpinner'
import { COURSE_LIST } from '@/lib/constants'

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('All')

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const { data } = await axios.get('/api/courses')
        const apiCourses = Array.isArray(data.data) ? data.data : []
        setCourses(apiCourses.length ? apiCourses : COURSE_LIST)
      } catch {
        setCourses(COURSE_LIST)
      } finally {
        setLoading(false)
      }
    }

    loadCourses()
  }, [])

  const categories = [
    'All',
    ...Array.from(new Set(courses.map((c) => c.category).filter(Boolean))),
  ]
  const filteredCourses =
    category === 'All' ? courses : courses.filter((c) => c.category === category)

  return (
    <div className="container-custom py-20">
      {/* Page header */}
      <div className="mb-12">
        <span className="mb-4 inline-flex rounded-full bg-primary-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary-600">
          Learn &amp; Build
        </span>
        <h1 className="mb-3 max-w-2xl text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
          Explore Practical Web Development Courses
        </h1>
        <p className="max-w-xl text-base leading-7 text-slate-500">
          Project-based courses designed to take you from concept to deployment. Learn modern
          frameworks by building real-world applications — not just theory.
        </p>
      </div>

      {/* Category tabs — horizontally scrollable on mobile */}
      <div className="-mx-4 mb-8 px-4 sm:mx-0 sm:px-0">
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                category === item
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'border border-slate-200 bg-white text-slate-600 hover:border-primary-300 hover:text-primary-600'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner />
      ) : filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course, i) => (
            <motion.div
              key={course._id || course.slug}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              className="flex"
            >
              <CourseCard
                title={course.title}
                description={course.shortDescription || course.description}
                instructor={course.instructor || 'Md Shafiqul Islam'}
                category={course.category || 'Full Stack'}
                price={course.price}
                level={course.level}
                duration={course.duration}
                lessons={course.totalLessons || course.lessons}
                slug={course.slug}
                image={course.image}
                isFree={course.isFree}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-16 text-center shadow-sm">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-50">
            <BookOpen className="h-7 w-7 text-primary-400" />
          </div>
          <p className="text-base font-semibold text-slate-800">
            No courses found in this category.
          </p>
          <p className="mt-1 text-sm text-slate-400">Try selecting a different category above.</p>
          <button
            onClick={() => setCategory('All')}
            className="mt-5 rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-600 transition hover:border-primary-300 hover:text-primary-600"
          >
            View all courses
          </button>
        </div>
      )}
    </div>
  )
}
