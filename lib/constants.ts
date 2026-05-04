// Site configuration and constants

export const SITE_NAME = 'Md Shafiqul Islam'
export const SITE_URL = 'https://shafiqul-portfolio-lms-platform.vercel.app'
export const SITE_DESCRIPTION = 'Premium personal portfolio, service booking, and LMS platform for Md Shafiqul Islam.'
export const AUTHOR_NAME = 'Md Shafiqul Islam'
export const AUTHOR_EMAIL = 'mdshafiqul@example.com'

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Projects', href: '/projects' },
  { label: 'Courses', href: '/courses' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
]

export const SOCIAL_LINKS = [
  { label: 'GitHub', url: 'https://github.com/mdshafiqul', icon: '🐙' },
  { label: 'LinkedIn', url: 'https://linkedin.com/in/mdshafiqul', icon: '💼' },
  { label: 'Email', url: 'mailto:mdshafiqul@example.com', icon: '✉️' },
  { label: 'WhatsApp', url: 'https://wa.me/8801234567890', icon: '💬' },
]

export const HERO_TITLES = [
  'Full Stack Developer',
  'Laravel Developer',
  'MERN Developer',
  'Next.js Developer',
  'Technical Trainer',
]

export const ABOUT_SUMMARY =
  'I design and build secure, scalable web applications, LMS platforms and business-grade software for startups and companies. With 4+ years of professional experience in Laravel, MERN, Next.js and technical training, I help organizations deliver modern digital products and train the next generation of developers.'

export const ABOUT_COUNTERS = [
  { label: 'Years Experience', value: '4+' },
  { label: 'Training Hours', value: '200+' },
  { label: 'LMS Engagement', value: '40%' },
  { label: 'Downtime Reduction', value: '25%' },
]

export const SKILL_SECTIONS = [
  {
    category: 'Frontend',
    items: ['HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Angular', 'Vue.js', 'Bootstrap', 'Tailwind CSS'],
  },
  {
    category: 'Backend',
    items: ['Node.js', 'Express.js', 'Laravel', 'PHP', 'Python', 'Django'],
  },
  {
    category: 'Database',
    items: ['MySQL', 'MongoDB', 'SQL'],
  },
  {
    category: 'Tools',
    items: ['GitHub', 'VS Code', 'Postman', 'REST API', 'Canva', 'Photoshop', 'cPanel', 'AWS EC2', 'Server Maintenance'],
  },
  {
    category: 'Other',
    items: ['Responsive Design', 'UI/UX', 'Authentication', 'SEO-friendly Development'],
  },
]

export const EXPERIENCE_TIMELINE = [
  {
    company: 'AKR Technology & DCrowd IT Ltd',
    role: 'Web Design & Development Trainer',
    period: '2020 - 2021',
    description:
      'Delivered hands-on courses on modern web development, including HTML, CSS, JavaScript, and full stack application architecture. Focused on project-based learning and mentorship.',
    tags: ['Training', 'Web Design', 'Full Stack', 'LMS'],
  },
  {
    company: 'Geeta University',
    role: 'Full Stack Web Developer & Technical Trainer',
    period: '2021 - 2023',
    description:
      'Built production-ready learning platforms, internal dashboards and delivered technical training for students and faculty. Improved internal LMS processes and delivered secure applications.',
    tags: ['Next.js', 'Laravel', 'Node.js', 'Education'],
  },
  {
    company: 'Humana Apparels Pvt. Ltd.',
    role: 'Software Developer & Programmer',
    period: '2019 - 2020',
    description:
      'Built custom ERP and production tracking systems with QR code workflows and data-driven dashboards for manufacturing operations.',
    tags: ['ERP', 'Production Tracking', 'QR Code', 'Python'],
  },
]

export const EDUCATION_TIMELINE = [
  {
    title: 'Diploma in Computer Science & Engineering',
    institution: 'Technical Institute',
    period: '2015 - 2018',
  },
  {
    title: 'B.Tech in Computer Science & Engineering',
    institution: 'Kurukshetra University, India',
    period: '2018 - 2020',
  },
  {
    title: 'M.Tech in Computer Science & Engineering',
    institution: 'Geeta University, India',
    period: '2020 - 2022',
  },
]

export const SERVICE_LIST = [
  {
    title: 'Full Stack Web Application Development',
    description: 'Modern web applications built with secure APIs, responsive UI, and fast performance.',
    slug: 'full-stack-web-application-development',
    price: 1200,
    technologies: ['Next.js', 'Node.js', 'MongoDB'],
  },
  {
    title: 'Laravel Web Application Development',
    description: 'Robust Laravel applications with custom admin panels, authentication, and database workflows.',
    slug: 'laravel-web-application-development',
    price: 900,
    technologies: ['Laravel', 'PHP', 'MySQL'],
  },
  {
    title: 'MERN Stack Development',
    description: 'Full MERN applications with React front end, Node/Express backend, and MongoDB storage.',
    slug: 'mern-stack-development',
    price: 1100,
    technologies: ['React', 'Node.js', 'MongoDB'],
  },
  {
    title: 'Next.js Website Development',
    description: 'SEO-friendly Next.js websites with fast page loads, animations, and modern design.',
    slug: 'nextjs-website-development',
    price: 1000,
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS'],
  },
]

export const PROJECT_LIST = [
  {
    title: 'Laravel Learning Management System',
    slug: 'laravel-learning-management-system',
    description: 'A secure LMS with course management, quizzes, student dashboards and instructor workflows.',
    technologies: ['Laravel', 'MySQL', 'Blade', 'Bootstrap'],
    featured: true,
    image: '/images/project-lms.jpg',
  },
  {
    title: 'PHP OOP Blog Site',
    slug: 'php-oop-blog-site',
    description: 'A blog system built with object-oriented PHP, user authentication, comments and category management.',
    technologies: ['PHP', 'OOP', 'MySQL', 'Bootstrap'],
    image: '/images/project-blog.jpg',
  },
  {
    title: 'Laravel Multi-Vendor eCommerce',
    slug: 'laravel-multi-vendor-ecommerce',
    description: 'A multi-vendor marketplace with seller dashboards, order tracking and secure checkout.',
    technologies: ['Laravel', 'Stripe', 'MySQL', 'Vue.js'],
    image: '/images/project-ecommerce.jpg',
  },
  {
    title: 'Production Tracking System with QR Code',
    slug: 'production-tracking-system-with-qr-code',
    description: 'A production monitoring system with QR scanning, progress tracking, and REST APIs.',
    technologies: ['Django', 'TypeScript', 'Docker', 'QR Code'],
    image: '/images/project-qr.jpg',
  },
]

export const COURSE_LIST = [
  {
    title: 'Next.js Professional Bootcamp',
    slug: 'nextjs-professional-bootcamp',
    description: 'Build production-ready Next.js apps, authentication, and end-to-end deployment workflows.',
    category: 'Next.js',
    instructor: 'Md Shafiqul Islam',
    price: 49,
    level: 'intermediate',
    duration: '12 hours',
    lessons: 24,
    image: '/images/course-nextjs.jpg',
    isFree: false,
  },
  {
    title: 'MERN Stack Mastery',
    slug: 'mern-stack-mastery',
    description: 'Complete MERN stack course with React, Express API, MongoDB and client dashboards.',
    category: 'MERN Stack',
    instructor: 'Md Shafiqul Islam',
    price: 69,
    level: 'advanced',
    duration: '15 hours',
    lessons: 30,
    image: '/images/course-mern.jpg',
    isFree: false,
  },
  {
    title: 'Laravel LMS Development',
    slug: 'laravel-lms-development',
    description: 'Learn how to create LMS solutions with Laravel, Blade, authentication and admin panels.',
    category: 'Laravel',
    instructor: 'Md Shafiqul Islam',
    price: 59,
    level: 'intermediate',
    duration: '10 hours',
    lessons: 22,
    image: '/images/course-laravel.jpg',
    isFree: false,
  },
]

export const TESTIMONIALS_LIST = [
  {
    name: 'Razia Akter',
    role: 'Marketing Manager',
    company: 'AKR Technology',
    rating: 5,
    content: 'Md Shafiqul delivered user-friendly training and helped our team build scalable web apps with a practical approach.',
    image: '/images/testimonial-1.jpg',
  },
  {
    name: 'Sajid Khan',
    role: 'Student',
    company: 'Geeta University',
    rating: 5,
    content: 'The MERN project course was excellent. The lessons were clear and the course workflow helped me land a job quickly.',
    image: '/images/testimonial-2.jpg',
  },
]

export const BLOG_CATEGORIES = ['Web Design', 'Next.js', 'MERN', 'Laravel', 'LMS', 'Business']

export const ANIMATION_DURATION = {
  fast: 150,
  normal: 300,
  slow: 500,
}
