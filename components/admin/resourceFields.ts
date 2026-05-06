import type { AdminFieldConfig } from './AdminCrudForm'

export const projectFields: AdminFieldConfig[] = [
  { name: 'title', label: 'Project Title', type: 'text', required: true, placeholder: 'Laravel Learning Management System' },
  { name: 'slug', label: 'Slug', type: 'text', required: true, helpText: 'Auto-filled from title if left empty.' },
  { name: 'shortDescription', label: 'Short Description', type: 'textarea', rows: 3 },
  { name: 'description', label: 'Full Description', type: 'textarea', required: true, rows: 6 },
  { name: 'image', label: 'Thumbnail Image URL', type: 'url' },
  { name: 'screenshots', label: 'Screenshot URLs', type: 'array', helpText: 'One URL per line, or comma separated.' },
  { name: 'videoUrl', label: 'Video Demo URL', type: 'url' },
  { name: 'liveDemoUrl', label: 'Live Demo URL', type: 'url' },
  { name: 'githubUrl', label: 'GitHub URL', type: 'url' },
  { name: 'technologies', label: 'Technologies', type: 'array', helpText: 'Example: Laravel, MySQL, Bootstrap' },
  { name: 'features', label: 'Main Features', type: 'array' },
  { name: 'adminFeatures', label: 'Admin Features', type: 'array' },
  { name: 'userFeatures', label: 'User Features', type: 'array' },
  { name: 'clientProblem', label: 'Client Problem', type: 'textarea', rows: 4 },
  { name: 'solution', label: 'Solution', type: 'textarea', rows: 4 },
  { name: 'status', label: 'Status', type: 'select', options: [
    { label: 'Draft', value: 'draft' },
    { label: 'Published', value: 'published' },
    { label: 'Archived', value: 'archived' },
  ] },
  { name: 'featured', label: 'Featured Project', type: 'checkbox', placeholder: 'Show this project as featured' },
]

export const serviceFields: AdminFieldConfig[] = [
  { name: 'title', label: 'Service Title', type: 'text', required: true, placeholder: 'Full Stack Web Application Development' },
  { name: 'slug', label: 'Slug', type: 'text', required: true },
  { name: 'description', label: 'Description', type: 'textarea', required: true, rows: 6 },
  { name: 'icon', label: 'Icon Name or URL', type: 'text' },
  { name: 'startingPrice', label: 'Starting Price Text', type: 'text', placeholder: 'Starting from $299' },
  { name: 'price', label: 'Numeric Price', type: 'number' },
  { name: 'duration', label: 'Estimated Duration', type: 'text', placeholder: '7-14 days' },
  { name: 'features', label: 'Service Features', type: 'array' },
]

export const courseFields: AdminFieldConfig[] = [
  { name: 'title', label: 'Course Title', type: 'text', required: true, placeholder: 'Next.js Full Stack Development' },
  { name: 'slug', label: 'Slug', type: 'text', required: true },
  { name: 'shortDescription', label: 'Short Description', type: 'textarea', rows: 3 },
  { name: 'description', label: 'Description', type: 'textarea', required: true, rows: 6 },
  { name: 'image', label: 'Thumbnail Image URL', type: 'url' },
  { name: 'instructor', label: 'Instructor', type: 'text', placeholder: 'Md Shafiqul Islam' },
  { name: 'category', label: 'Category', type: 'select', options: [
    { label: 'Web Design', value: 'Web Design' },
    { label: 'React.js', value: 'React.js' },
    { label: 'Next.js', value: 'Next.js' },
    { label: 'MERN Stack', value: 'MERN Stack' },
    { label: 'Laravel', value: 'Laravel' },
    { label: 'Full Stack Development', value: 'Full Stack Development' },
    { label: 'WordPress', value: 'WordPress' },
    { label: 'Freelancing & Marketplace', value: 'Freelancing & Marketplace' },
  ] },
  { name: 'price', label: 'Price', type: 'number' },
  { name: 'level', label: 'Level', type: 'select', options: [
    { label: 'Beginner', value: 'beginner' },
    { label: 'Intermediate', value: 'intermediate' },
    { label: 'Advanced', value: 'advanced' },
  ] },
  { name: 'duration', label: 'Duration', type: 'text', placeholder: '12 weeks' },
  { name: 'totalLessons', label: 'Total Lessons', type: 'number' },
  { name: 'syllabus', label: 'Syllabus', type: 'array' },
  { name: 'learningOutcomes', label: 'Learning Outcomes', type: 'array' },
  { name: 'requirements', label: 'Requirements', type: 'array' },
  { name: 'isFree', label: 'Free Course', type: 'checkbox', placeholder: 'This course is free' },
  { name: 'certificateEnabled', label: 'Certificate Enabled', type: 'checkbox', placeholder: 'Provide certificate after completion' },
  { name: 'published', label: 'Published', type: 'checkbox', placeholder: 'Show this course publicly' },
]

export const lessonFields: AdminFieldConfig[] = [
  { name: 'courseId', label: 'Course ID', type: 'text', required: true, helpText: 'Paste the MongoDB _id of the related course.' },
  { name: 'title', label: 'Lesson Title', type: 'text', required: true },
  { name: 'slug', label: 'Slug', type: 'text' },
  { name: 'description', label: 'Description', type: 'textarea', rows: 5 },
  { name: 'videoUrl', label: 'Video URL', type: 'url' },
  { name: 'duration', label: 'Duration in Minutes', type: 'number' },
  { name: 'order', label: 'Lesson Order', type: 'number' },
  { name: 'resources', label: 'Resource Links', type: 'array' },
  { name: 'isPreview', label: 'Preview Lesson', type: 'checkbox', placeholder: 'Allow public preview without enrollment' },
  { name: 'isLocked', label: 'Locked Lesson', type: 'checkbox', placeholder: 'Require enrollment to watch this lesson' },
]

export const liveClassFields: AdminFieldConfig[] = [
  { name: 'title', label: 'Live Class Title', type: 'text', required: true },
  { name: 'description', label: 'Description', type: 'textarea', rows: 5 },
  { name: 'courseId', label: 'Course ID', type: 'text', helpText: 'Paste the MongoDB _id of the related course.' },
  { name: 'instructor', label: 'Instructor', type: 'text', placeholder: 'Md Shafiqul Islam' },
  { name: 'scheduledDate', label: 'Scheduled Date & Time', type: 'datetime', required: true },
  { name: 'duration', label: 'Duration in Minutes', type: 'number' },
  { name: 'meetingLink', label: 'Meeting Link', type: 'url' },
  { name: 'capacity', label: 'Capacity', type: 'number' },
  { name: 'status', label: 'Status', type: 'select', options: [
    { label: 'Scheduled', value: 'scheduled' },
    { label: 'Live', value: 'live' },
    { label: 'Ended', value: 'ended' },
    { label: 'Cancelled', value: 'cancelled' },
  ] },
]

export const blogFields: AdminFieldConfig[] = [
  { name: 'title', label: 'Blog Title', type: 'text', required: true },
  { name: 'slug', label: 'Slug', type: 'text', required: true },
  { name: 'excerpt', label: 'Excerpt', type: 'textarea', rows: 3 },
  { name: 'content', label: 'Content', type: 'textarea', required: true, rows: 10 },
  { name: 'image', label: 'Featured Image URL', type: 'url' },
  { name: 'author', label: 'Author', type: 'text', placeholder: 'Md Shafiqul Islam' },
  { name: 'category', label: 'Category', type: 'text' },
  { name: 'tags', label: 'Tags', type: 'array' },
  { name: 'published', label: 'Published', type: 'checkbox', placeholder: 'Show this blog publicly' },
]

export const testimonialFields: AdminFieldConfig[] = [
  { name: 'name', label: 'Name', type: 'text', required: true },
  { name: 'role', label: 'Role', type: 'text' },
  { name: 'company', label: 'Company', type: 'text' },
  { name: 'image', label: 'Image URL', type: 'url' },
  { name: 'content', label: 'Testimonial Content', type: 'textarea', required: true, rows: 5 },
  { name: 'rating', label: 'Rating', type: 'number' },
  { name: 'featured', label: 'Featured Testimonial', type: 'checkbox', placeholder: 'Show on homepage' },
]

export const skillFields: AdminFieldConfig[] = [
  { name: 'name', label: 'Skill Name', type: 'text', required: true, placeholder: 'React.js' },
  { name: 'category', label: 'Category', type: 'select', required: true, options: [
    { label: 'Frontend', value: 'Frontend' },
    { label: 'Backend', value: 'Backend' },
    { label: 'Database', value: 'Database' },
    { label: 'CMS & Tools', value: 'CMS & Tools' },
    { label: 'Other / Additional', value: 'Other / Additional' },
  ] },
  { name: 'level', label: 'Level', type: 'select', options: [
    { label: 'Beginner', value: 'Beginner' },
    { label: 'Intermediate', value: 'Intermediate' },
    { label: 'Advanced', value: 'Advanced' },
    { label: 'Expert', value: 'Expert' },
  ] },
]

export const userFields: AdminFieldConfig[] = [
  { name: 'name', label: 'Full Name', type: 'text', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'password', label: 'Password', type: 'text', helpText: 'Required when creating a user. Leave blank while editing to keep current password.' },
  { name: 'role', label: 'Role', type: 'select', required: true, options: [
    { label: 'Admin', value: 'admin' },
    { label: 'Client', value: 'client' },
    { label: 'Student', value: 'student' },
  ] },
  { name: 'isActive', label: 'Active User', type: 'checkbox', placeholder: 'Allow this user to sign in' },
]

export const studentFields: AdminFieldConfig[] = [
  { name: 'name', label: 'Student Name', type: 'text', required: true },
  { name: 'email', label: 'Student Email', type: 'email', required: true },
  { name: 'password', label: 'Password', type: 'text', helpText: 'Required when creating a student. Leave blank while editing to keep current password.' },
  { name: 'isActive', label: 'Active Student', type: 'checkbox', placeholder: 'Allow this student to sign in' },
]

export const certificateFields: AdminFieldConfig[] = [
  { name: 'studentId', label: 'Student ID', type: 'text', helpText: 'Paste the MongoDB _id of the student.' },
  { name: 'courseId', label: 'Course ID', type: 'text', helpText: 'Paste the MongoDB _id of the course.' },
  { name: 'enrollmentId', label: 'Enrollment ID', type: 'text', required: true, helpText: 'Paste the MongoDB _id of the enrollment.' },
  { name: 'studentName', label: 'Student Name', type: 'text', required: true },
  { name: 'courseName', label: 'Course Name', type: 'text', required: true },
  { name: 'instructorName', label: 'Instructor Name', type: 'text', required: true, placeholder: 'Md Shafiqul Islam' },
  { name: 'completionDate', label: 'Completion Date', type: 'date', required: true },
  { name: 'certificateId', label: 'Certificate ID', type: 'text', required: true },
  { name: 'certificateUrl', label: 'Certificate URL', type: 'url' },
]

export const contactMessageFields: AdminFieldConfig[] = [
  { name: 'name', label: 'Name', type: 'text', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'phone', label: 'Phone', type: 'text' },
  { name: 'subject', label: 'Subject', type: 'text', required: true },
  { name: 'message', label: 'Message', type: 'textarea', required: true, rows: 6 },
  { name: 'status', label: 'Status', type: 'select', options: [
    { label: 'New', value: 'new' },
    { label: 'Read', value: 'read' },
    { label: 'Replied', value: 'replied' },
    { label: 'Archived', value: 'archived' },
  ] },
]

export const websiteSettingFields: AdminFieldConfig[] = [
  { name: 'siteName', label: 'Site Name', type: 'text' },
  { name: 'logo', label: 'Logo URL', type: 'text' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'phone', label: 'Phone', type: 'text' },
  { name: 'whatsapp', label: 'WhatsApp', type: 'text' },
  { name: 'address', label: 'Address', type: 'textarea', rows: 3 },
  { name: 'github', label: 'GitHub URL', type: 'url' },
  { name: 'linkedin', label: 'LinkedIn URL', type: 'url' },
  { name: 'facebook', label: 'Facebook URL', type: 'url' },
  { name: 'seoTitle', label: 'SEO Title', type: 'text' },
  { name: 'seoDescription', label: 'SEO Description', type: 'textarea', rows: 3 },
  { name: 'heroTitle', label: 'Hero Title', type: 'textarea', rows: 3 },
  { name: 'heroSubtitle', label: 'Hero Subtitle', type: 'textarea', rows: 4 },
  { name: 'resumeUrl', label: 'Resume URL', type: 'text' },
  { name: 'maintenanceMode', label: 'Maintenance Mode', type: 'checkbox', placeholder: 'Temporarily show the maintenance overlay' },
]
