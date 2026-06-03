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
  'I design and build secure, scalable web applications, LMS platforms and business-grade software for startups and companies. With 5+ years of professional experience in Laravel, MERN, Next.js and technical training, I help organizations deliver modern digital products and train the next generation of developers.'

export const ABOUT_COUNTERS = [
  { label: 'Projects Delivered', value: '100+' },
  { label: 'Happy Clients', value: '50+' },
  { label: 'Students Trained', value: '200+' },
  { label: 'Years Experience', value: '5+' },
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
  {
    title: 'Bug Fixing & Performance',
    description: 'Fast diagnosis and resolution of bugs, performance bottlenecks, and security issues.',
    slug: 'bug-fixing-performance',
    technologies: ['PHP', 'Laravel', 'React', 'Node.js', 'MySQL'],
  },
  {
    title: 'Project Customization',
    description: 'Customize any ready project for your business — branding, features, and deployment.',
    slug: 'project-customization',
    technologies: ['Laravel', 'Next.js', 'MySQL', 'MongoDB'],
  },
  {
    title: 'Business Website Setup',
    description: 'Professional business website with admin panel, contact forms, and hosting setup.',
    slug: 'business-website-setup',
    technologies: ['Next.js', 'CMS', 'SEO', 'cPanel'],
  },
]

export const PROJECT_LIST = [
  {
    title: 'Laravel Learning Management System',
    slug: 'laravel-learning-management-system',
    description: 'A secure LMS with course management, quizzes, student dashboards and instructor workflows.',
    shortDescription: 'Full-featured LMS platform with course management, student tracking, quizzes and instructor panel.',
    features: ['Course & lesson management', 'Student dashboard & progress tracking', 'Quiz & certificate system'],
    technologies: ['Laravel', 'MySQL', 'Blade', 'Bootstrap'],
    featured: true,
    image: '/images/project-lms.jpg',
    // Future admin fields: isCustomizable, demoType ('public'|'video'|'request'), businessType, enquiryEnabled
  },
  {
    title: 'PHP OOP Blog Site',
    slug: 'php-oop-blog-site',
    description: 'A blog system built with object-oriented PHP, user authentication, comments and category management.',
    shortDescription: 'Clean blog platform with OOP architecture, user auth, comments and category management.',
    features: ['User authentication & roles', 'Category & tag management', 'Comment moderation system'],
    technologies: ['PHP', 'OOP', 'MySQL', 'Bootstrap'],
    image: '/images/project-blog.jpg',
    // Future admin fields: isCustomizable, demoType, businessType, enquiryEnabled
  },
  {
    title: 'Laravel Multi-Vendor eCommerce',
    slug: 'laravel-multi-vendor-ecommerce',
    description: 'A multi-vendor marketplace with seller dashboards, order tracking and secure checkout.',
    shortDescription: 'Multi-vendor marketplace with seller dashboards, order management and secure payment checkout.',
    features: ['Multi-vendor seller dashboard', 'Order tracking & management', 'Secure payment with Stripe'],
    technologies: ['Laravel', 'Stripe', 'MySQL', 'Vue.js'],
    image: '/images/project-ecommerce.jpg',
    // Future admin fields: isCustomizable, demoType, businessType, enquiryEnabled
  },
  {
    title: 'Production Tracking System with QR Code',
    slug: 'production-tracking-system-with-qr-code',
    description: 'A production monitoring system with QR scanning, progress tracking, and REST APIs.',
    shortDescription: 'Smart production tracker with QR scanning, real-time progress monitoring and REST API integration.',
    features: ['QR code scanning workflow', 'Real-time production monitoring', 'REST API & reporting dashboard'],
    technologies: ['Django', 'TypeScript', 'Docker', 'QR Code'],
    image: '/images/project-qr.jpg',
    // Future admin fields: isCustomizable, demoType, businessType, enquiryEnabled
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

export const WORK_PROCESS = [
  {
    step: '01',
    title: 'Requirement Discussion',
    description: 'We discuss your project goals, features, target audience and business objectives in detail.',
  },
  {
    step: '02',
    title: 'Planning & Design',
    description: 'I create a clear project plan with wireframes, tech stack selection and timeline estimate.',
  },
  {
    step: '03',
    title: 'Development',
    description: 'Clean, scalable code is written following best practices with regular progress updates.',
  },
  {
    step: '04',
    title: 'Review & Testing',
    description: 'Full testing across devices and browsers. Bugs fixed before final delivery.',
  },
  {
    step: '05',
    title: 'Delivery & Support',
    description: 'Project delivered with documentation. Post-delivery support and customization available.',
  },
]

export const WHY_CHOOSE_ME = [
  {
    icon: '🚀',
    title: 'Practical Project Experience',
    description: 'Built 100+ real-world projects — LMS platforms, eCommerce, dashboards and business tools.',
  },
  {
    icon: '💬',
    title: 'Bangla & English Support',
    description: 'I communicate fluently in Bangla and English — no miscommunication for Bangladeshi clients.',
  },
  {
    icon: '🎯',
    title: 'Business-Focused Solutions',
    description: 'Every project is built with your business goal in mind — not just code, but results.',
  },
  {
    icon: '🛡️',
    title: 'After-Delivery Support',
    description: 'Bug fixes, updates and guidance after project delivery — I stay available for my clients.',
  },
  {
    icon: '📱',
    title: 'Mobile Responsive Design',
    description: 'All projects are fully responsive and tested across mobile, tablet and desktop screens.',
  },
  {
    icon: '⚡',
    title: 'Fast & Clean Code',
    description: 'Optimized, well-structured code with fast load times and easy-to-maintain architecture.',
  },
]

export const FAQ_LIST = [
  {
    question: 'What is your project pricing?',
    answer: 'I do not publish fixed prices publicly. Every project is unique. Contact me with your requirements and I will provide a custom quote based on features, complexity and timeline.',
  },
  {
    question: 'Can I request a demo before buying a ready project?',
    answer: 'Yes. You can send an enquiry for any ready project and I will arrange a live demo or share a video walkthrough based on availability.',
  },
  {
    question: 'Can your ready projects be customized?',
    answer: 'Absolutely. All ready projects can be customized to match your business needs — branding, features, integrations and deployment.',
  },
  {
    question: 'What web development courses do you offer?',
    answer: 'I offer practical courses on Next.js, MERN Stack and Laravel LMS Development. Courses are beginner to advanced with project-based learning.',
  },
  {
    question: 'How does the live training program work?',
    answer: 'Live training is conducted in online batches with real-time Q&A, project assignments and personal mentoring. Join the waitlist for the next batch.',
  },
  {
    question: 'What technologies do you work with?',
    answer: 'I work with Laravel, PHP, Next.js, React, Node.js, MongoDB, MySQL and more. Full stack web development with modern tools.',
  },
  {
    question: 'Do you provide support after project delivery?',
    answer: 'Yes. I provide post-delivery support for bug fixes, minor changes and deployment help. Long-term maintenance packages are also available.',
  },
  {
    question: 'How do I get started?',
    answer: 'Simply send an enquiry via the contact form or WhatsApp. Share your project idea and I will respond within 24 hours with a plan.',
  },
]

export const LIVE_TRAINING_INFO = {
  title: 'Live Web Development Training',
  subtitle: 'Learn by building real projects with live instructor support',
  description:
    'Join my live online training program and learn modern web development from scratch or advance your skills. Small batches, personal mentoring, and real project assignments.',
  batchStatus: 'Next Batch Coming Soon',
  schedule: 'Online • Weekends • 2 hours/session',
  topics: ['HTML, CSS & JavaScript Fundamentals', 'Laravel Full Stack Development', 'MERN Stack (React + Node.js)', 'Next.js & TypeScript', 'Database Design & REST APIs', 'Deployment & Production Setup'],
  ctaLabel: 'Join Live Training',
  ctaHref: '/contact',
}
