'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import SectionTitle from '@/components/SectionTitle'
import CourseCard from '@/components/CourseCard'
import LoadingSpinner from '@/components/LoadingSpinner'
import EmptyState from '@/components/EmptyState'
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
      } catch (error) {
        setCourses(COURSE_LIST)
      } finally {
        setLoading(false)
      }
    }

    loadCourses()
  }, [])

  const categories = ['All', ...Array.from(new Set(courses.map((course) => course.category).filter(Boolean)))]
  const filteredCourses = category === 'All' ? courses : courses.filter((course) => course.category === category)

  return (
    <div className="container-custom py-24">
      <SectionTitle
        title="Courses"
        subtitle="Practical live training and recorded courses for Next.js, MERN, Laravel, and full-stack development."
        eyebrow="Courses"
      />

      <div className="mb-8 flex flex-wrap gap-3">
        {categories.map((item) => (
          <button
            key={item}
            onClick={() => setCategory(item)}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
              category === item
                ? 'bg-primary-500 text-white'
                : 'border border-white/10 bg-white/5 text-slate-300 hover:border-primary-500 hover:text-white'
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : filteredCourses.length ? (
        <div className="grid gap-6 xl:grid-cols-3">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course._id || course.slug}
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
          ))}
        </div>
      ) : (
        <EmptyState title="No courses found" description="Courses will appear here after admin publishes them." />
      )}
    </div>
  )
}
