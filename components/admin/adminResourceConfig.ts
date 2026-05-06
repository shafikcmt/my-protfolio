import type { AdminFieldConfig } from './AdminCrudForm'
import {
  blogFields,
  certificateFields,
  contactMessageFields,
  courseFields,
  lessonFields,
  liveClassFields,
  projectFields,
  serviceFields,
  skillFields,
  studentFields,
  testimonialFields,
  userFields,
} from './resourceFields'

export type AdminColumnType = 'text' | 'badge' | 'boolean' | 'date' | 'array' | 'relation' | 'email'

export interface AdminResourceColumn {
  key: string
  label: string
  type?: AdminColumnType
}

export interface AdminResourceConfig {
  resource: string
  title: string
  singular: string
  apiPath: string
  listPath: string
  fields: AdminFieldConfig[]
  columns: AdminResourceColumn[]
  addLabel?: string
}

const buildPath = (resource: string) => `/dashboard/admin/${resource}`
const buildApiPath = (resource: string) => `/api/admin/${resource}`

export const adminResourceConfigs: Record<string, AdminResourceConfig> = {
  projects: {
    resource: 'projects',
    title: 'Projects',
    singular: 'Project',
    apiPath: buildApiPath('projects'),
    listPath: buildPath('projects'),
    fields: projectFields,
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'status', label: 'Status', type: 'badge' },
      { key: 'featured', label: 'Featured', type: 'boolean' },
      { key: 'technologies', label: 'Technologies', type: 'array' },
      { key: 'createdAt', label: 'Created', type: 'date' },
    ],
  },
  services: {
    resource: 'services',
    title: 'Services',
    singular: 'Service',
    apiPath: buildApiPath('services'),
    listPath: buildPath('services'),
    fields: serviceFields,
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'startingPrice', label: 'Starting Price' },
      { key: 'duration', label: 'Duration' },
      { key: 'features', label: 'Features', type: 'array' },
      { key: 'createdAt', label: 'Created', type: 'date' },
    ],
  },
  skills: {
    resource: 'skills',
    title: 'Skills',
    singular: 'Skill',
    apiPath: buildApiPath('skills'),
    listPath: buildPath('skills'),
    fields: skillFields,
    columns: [
      { key: 'name', label: 'Skill' },
      { key: 'category', label: 'Category' },
      { key: 'level', label: 'Level', type: 'badge' },
      { key: 'createdAt', label: 'Created', type: 'date' },
    ],
  },
  courses: {
    resource: 'courses',
    title: 'Courses',
    singular: 'Course',
    apiPath: buildApiPath('courses'),
    listPath: buildPath('courses'),
    fields: courseFields,
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'category', label: 'Category' },
      { key: 'level', label: 'Level', type: 'badge' },
      { key: 'published', label: 'Published', type: 'boolean' },
      { key: 'students', label: 'Students' },
      { key: 'createdAt', label: 'Created', type: 'date' },
    ],
  },
  lessons: {
    resource: 'lessons',
    title: 'Lessons',
    singular: 'Lesson',
    apiPath: buildApiPath('lessons'),
    listPath: buildPath('lessons'),
    fields: lessonFields,
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'courseId', label: 'Course', type: 'relation' },
      { key: 'order', label: 'Order' },
      { key: 'isPreview', label: 'Preview', type: 'boolean' },
      { key: 'isLocked', label: 'Locked', type: 'boolean' },
    ],
  },
  'live-classes': {
    resource: 'live-classes',
    title: 'Live Classes',
    singular: 'Live Class',
    apiPath: buildApiPath('live-classes'),
    listPath: buildPath('live-classes'),
    fields: liveClassFields,
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'courseId', label: 'Course', type: 'relation' },
      { key: 'scheduledDate', label: 'Schedule', type: 'date' },
      { key: 'status', label: 'Status', type: 'badge' },
      { key: 'capacity', label: 'Capacity' },
    ],
  },
  students: {
    resource: 'students',
    title: 'Students',
    singular: 'Student',
    apiPath: buildApiPath('students'),
    listPath: buildPath('students'),
    fields: studentFields,
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email', type: 'email' },
      { key: 'isActive', label: 'Active', type: 'boolean' },
      { key: 'createdAt', label: 'Joined', type: 'date' },
    ],
    addLabel: 'Add Student',
  },
  certificates: {
    resource: 'certificates',
    title: 'Certificates',
    singular: 'Certificate',
    apiPath: buildApiPath('certificates'),
    listPath: buildPath('certificates'),
    fields: certificateFields,
    columns: [
      { key: 'certificateId', label: 'Certificate ID' },
      { key: 'studentName', label: 'Student' },
      { key: 'courseName', label: 'Course' },
      { key: 'completionDate', label: 'Completed', type: 'date' },
    ],
  },
  testimonials: {
    resource: 'testimonials',
    title: 'Testimonials',
    singular: 'Testimonial',
    apiPath: buildApiPath('testimonials'),
    listPath: buildPath('testimonials'),
    fields: testimonialFields,
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'role', label: 'Role' },
      { key: 'rating', label: 'Rating' },
      { key: 'featured', label: 'Featured', type: 'boolean' },
      { key: 'createdAt', label: 'Created', type: 'date' },
    ],
  },
  blogs: {
    resource: 'blogs',
    title: 'Blogs',
    singular: 'Blog',
    apiPath: buildApiPath('blogs'),
    listPath: buildPath('blogs'),
    fields: blogFields,
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'category', label: 'Category' },
      { key: 'published', label: 'Published', type: 'boolean' },
      { key: 'views', label: 'Views' },
      { key: 'createdAt', label: 'Created', type: 'date' },
    ],
  },
  users: {
    resource: 'users',
    title: 'Users',
    singular: 'User',
    apiPath: buildApiPath('users'),
    listPath: buildPath('users'),
    fields: userFields,
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email', type: 'email' },
      { key: 'role', label: 'Role', type: 'badge' },
      { key: 'isActive', label: 'Active', type: 'boolean' },
      { key: 'createdAt', label: 'Created', type: 'date' },
    ],
  },
  'contact-messages': {
    resource: 'contact-messages',
    title: 'Contact Messages',
    singular: 'Contact Message',
    apiPath: buildApiPath('contact-messages'),
    listPath: buildPath('contact-messages'),
    fields: contactMessageFields,
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email', type: 'email' },
      { key: 'subject', label: 'Subject' },
      { key: 'status', label: 'Status', type: 'badge' },
      { key: 'createdAt', label: 'Received', type: 'date' },
    ],
    addLabel: 'Add Message',
  },
}

export function getAdminResourceConfig(resource: string) {
  return adminResourceConfigs[resource]
}
