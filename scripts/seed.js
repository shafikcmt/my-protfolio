/*
  Portfolio LMS seed script for Md Shafiqul Islam.
  Usage:
    npm run seed
    npm run seed:reset

  This script is intentionally plain Node.js so it works without ts-node, tsx,
  dotenv, or TypeScript path alias configuration.
*/

const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs')

function loadEnvFile(fileName) {
  const filePath = path.join(process.cwd(), fileName)
  if (!fs.existsSync(filePath)) return

  const content = fs.readFileSync(filePath, 'utf8')
  content.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) return
    const equalsIndex = trimmed.indexOf('=')
    if (equalsIndex === -1) return

    const key = trimmed.slice(0, equalsIndex).trim()
    let value = trimmed.slice(equalsIndex + 1).trim()
    value = value.replace(/^['"]|['"]$/g, '')

    if (!process.env[key]) {
      process.env[key] = value
    }
  })
}

loadEnvFile('.env.local')
loadEnvFile('.env')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/portfolio'
const shouldReset = process.argv.includes('--reset')

const looseSchemaOptions = {
  strict: false,
  timestamps: true,
}

const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({}, looseSchemaOptions), 'users')
const Profile = mongoose.models.Profile || mongoose.model('Profile', new mongoose.Schema({}, looseSchemaOptions), 'profiles')
const Skill = mongoose.models.Skill || mongoose.model('Skill', new mongoose.Schema({}, looseSchemaOptions), 'skills')
const Service = mongoose.models.Service || mongoose.model('Service', new mongoose.Schema({}, looseSchemaOptions), 'services')
const Project = mongoose.models.Project || mongoose.model('Project', new mongoose.Schema({}, looseSchemaOptions), 'projects')
const Course = mongoose.models.Course || mongoose.model('Course', new mongoose.Schema({}, looseSchemaOptions), 'courses')
const Lesson = mongoose.models.Lesson || mongoose.model('Lesson', new mongoose.Schema({}, looseSchemaOptions), 'lessons')
const LiveClass = mongoose.models.LiveClass || mongoose.model('LiveClass', new mongoose.Schema({}, looseSchemaOptions), 'liveclasses')
const Enrollment = mongoose.models.Enrollment || mongoose.model('Enrollment', new mongoose.Schema({}, looseSchemaOptions), 'enrollments')
const Certificate = mongoose.models.Certificate || mongoose.model('Certificate', new mongoose.Schema({}, looseSchemaOptions), 'certificates')
const Blog = mongoose.models.Blog || mongoose.model('Blog', new mongoose.Schema({}, looseSchemaOptions), 'blogs')
const Testimonial = mongoose.models.Testimonial || mongoose.model('Testimonial', new mongoose.Schema({}, looseSchemaOptions), 'testimonials')
const ContactMessage = mongoose.models.ContactMessage || mongoose.model('ContactMessage', new mongoose.Schema({}, looseSchemaOptions), 'contactmessages')
const ProjectOrder = mongoose.models.ProjectOrder || mongoose.model('ProjectOrder', new mongoose.Schema({}, looseSchemaOptions), 'projectorders')
const ConsultationBooking = mongoose.models.ConsultationBooking || mongoose.model('ConsultationBooking', new mongoose.Schema({}, looseSchemaOptions), 'consultationbookings')
const Setting = mongoose.models.Setting || mongoose.model('Setting', new mongoose.Schema({}, looseSchemaOptions), 'settings')
const WebsiteSetting = mongoose.models.WebsiteSetting || mongoose.model('WebsiteSetting', new mongoose.Schema({}, looseSchemaOptions), 'websitesettings')

function slugify(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

function daysFromNow(days, hour = 20, minute = 0) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  date.setHours(hour, minute, 0, 0)
  return date
}

async function upsert(model, filter, data) {
  return model.findOneAndUpdate(
    filter,
    { $set: data },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  )
}

async function createUser({ name, email, password, role }) {
  const hashedPassword = await bcryptjs.hash(password, 10)
  return upsert(User, { email }, {
    name,
    email,
    password: hashedPassword,
    role,
    isActive: true,
  })
}

async function resetCollections() {
  const collections = [
    Profile,
    Skill,
    Service,
    Project,
    Course,
    Lesson,
    LiveClass,
    Enrollment,
    Certificate,
    Blog,
    Testimonial,
    ContactMessage,
    ProjectOrder,
    ConsultationBooking,
    Setting,
    WebsiteSetting,
  ]

  for (const collection of collections) {
    await collection.deleteMany({})
  }

  await User.deleteMany({ email: { $in: ['admin@shafiqul.dev', 'client@demo.com', 'student@demo.com'] } })
}

const profileInfo = {
  siteName: 'Md Shafiqul Islam Portfolio LMS',
  logo: '/logo.png',
  email: 'mdshafiqulislam822@gmail.com',
  phone: '+8801768987779',
  whatsapp: '+8801768987779',
  address: 'Narayanganj, Dhaka, Bangladesh',
  github: 'https://github.com/shafikcmt',
  linkedin: 'https://linkedin.com/in/shafikcmt',
  facebook: '',
  maintenanceMode: false,
  seoTitle: 'Md Shafiqul Islam | Full Stack Web Developer',
  seoDescription: 'Full Stack Web Developer specializing in Laravel, MERN, Next.js, LMS, eCommerce, ERP and business software solutions.',
  heroTitle: 'Full Stack Web Developer, Laravel, MERN, Next.js and Technical Trainer',
  heroSubtitle: 'I build secure, scalable, responsive and business-focused web applications, LMS platforms, eCommerce systems and ERP-style tools.',
  resumeUrl: '/resume.pdf',
}

const skillSeed = [
  ['Frontend', ['HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Angular', 'Vue.js', 'Bootstrap', 'Tailwind CSS']],
  ['Backend', ['Node.js', 'Express.js', 'PHP', 'Laravel', 'Python', 'Django', 'REST API']],
  ['Database', ['MySQL', 'MongoDB', 'SQL']],
  ['CMS & Tools', ['WordPress', 'GitHub', 'VS Code', 'Postman', 'Canva', 'Photoshop Basic', 'cPanel', 'AWS EC2', 'Server Maintenance']],
  ['Other / Additional', ['Responsive Design', 'UI/UX', 'Authentication', 'SEO-friendly Development', 'Docker', 'QR Code Implementation']],
]

const services = [
  {
    title: 'Full Stack Web Application Development',
    slug: 'full-stack-web-application-development',
    description: 'End-to-end web application development with modern frontend, secure backend API, database design, authentication and dashboards.',
    icon: 'Code2',
    price: 499,
    startingPrice: 'Starting from $499',
    duration: '10-30 days',
    features: ['Next.js or React frontend', 'Node.js/Laravel backend', 'Database schema design', 'Authentication and roles', 'Admin dashboard'],
  },
  {
    title: 'Laravel Web Application Development',
    slug: 'laravel-web-application-development',
    description: 'Secure Laravel applications for LMS, ecommerce, dashboards, business automation and custom management systems.',
    icon: 'Layers',
    price: 399,
    startingPrice: 'Starting from $399',
    duration: '7-21 days',
    features: ['Laravel MVC', 'MySQL database', 'Admin panel', 'REST API', 'Deployment support'],
  },
  {
    title: 'MERN Stack Development',
    slug: 'mern-stack-development',
    description: 'MongoDB, Express.js, React and Node.js applications with clean APIs, scalable structure and responsive interfaces.',
    icon: 'Database',
    price: 499,
    startingPrice: 'Starting from $499',
    duration: '12-30 days',
    features: ['React frontend', 'Express API', 'MongoDB', 'JWT auth', 'Reusable components'],
  },
  {
    title: 'Next.js Website Development',
    slug: 'next-js-website-development',
    description: 'Fast, SEO-friendly Next.js websites, landing pages, portfolios, company websites and product pages.',
    icon: 'Rocket',
    price: 299,
    startingPrice: 'Starting from $299',
    duration: '5-14 days',
    features: ['App Router', 'SEO metadata', 'Responsive design', 'Performance optimization', 'Contact forms'],
  },
  {
    title: 'LMS Development',
    slug: 'lms-development',
    description: 'Learning management systems with courses, lessons, live classes, students, quizzes, enrollment and certificates.',
    icon: 'GraduationCap',
    price: 799,
    startingPrice: 'Starting from $799',
    duration: '20-45 days',
    features: ['Course management', 'Student dashboard', 'Video lessons', 'Live class links', 'Certificate system'],
  },
  {
    title: 'eCommerce Development',
    slug: 'ecommerce-development',
    description: 'Single-vendor and multi-vendor ecommerce platforms with product, cart, checkout, order and vendor management.',
    icon: 'ShoppingCart',
    price: 699,
    startingPrice: 'Starting from $699',
    duration: '20-40 days',
    features: ['Product management', 'Cart and checkout', 'Vendor dashboard', 'Order tracking', 'Secure login'],
  },
  {
    title: 'ERP / Business Software Development',
    slug: 'erp-business-software-development',
    description: 'Custom ERP-style business tools for production tracking, OCR workflows, BMS, reporting and internal operations.',
    icon: 'BriefcaseBusiness',
    price: 999,
    startingPrice: 'Starting from $999',
    duration: '30-60 days',
    features: ['Custom workflow', 'Role-based dashboard', 'Reports', 'QR/OCR integration', 'Business process automation'],
  },
  {
    title: 'Website Maintenance',
    slug: 'website-maintenance',
    description: 'Monthly support, bug fixing, performance improvements, content updates, backup and server maintenance.',
    icon: 'Settings',
    price: 99,
    startingPrice: 'Starting from $99/month',
    duration: 'Monthly',
    features: ['Bug fixing', 'Backup support', 'Content update', 'Security check', 'Server support'],
  },
]

const projects = [
  {
    title: 'Laravel Learning Management System',
    slug: 'laravel-learning-management-system',
    shortDescription: 'A secure LMS with admin and student dashboards, course, batch and quiz management.',
    description: 'Designed and developed an LMS using Laravel, Bootstrap and MySQL for structured course management, student access, batch control and quiz workflows.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop',
    screenshots: [
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop',
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    liveDemoUrl: '#',
    githubUrl: 'https://github.com/shafikcmt/Laravel-Learning-Management-System',
    link: '#',
    codeLink: 'https://github.com/shafikcmt/Laravel-Learning-Management-System',
    clientProblem: 'The institution needed a central system for courses, batches, quizzes and student activity management.',
    solution: 'Built a responsive Laravel LMS with secure role-based dashboards and optimized database workflows.',
    technologies: ['Laravel', 'PHP', 'Bootstrap', 'MySQL', 'Authentication'],
    features: ['Admin dashboard', 'Student dashboard', 'Course management', 'Batch management', 'Quiz management', 'Responsive UI', 'Secure authentication'],
    adminFeatures: ['Manage courses', 'Manage batches', 'Manage quizzes', 'Monitor students', 'Update LMS content'],
    userFeatures: ['Browse courses', 'Join batches', 'Attend quizzes', 'Track learning activity'],
    featured: true,
    status: 'published',
  },
  {
    title: 'PHP OOP Blog Site',
    slug: 'php-oop-blog-site',
    shortDescription: 'A PHP OOP blog application with authentication, post CRUD and comment management.',
    description: 'Built a clean blog application using PHP OOP and MySQL with reusable architecture, authentication, post management and comments.',
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1200&auto=format&fit=crop',
    screenshots: [
      'https://images.unsplash.com/photo-1483058712412-4245e9b90334?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1200&auto=format&fit=crop',
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    liveDemoUrl: '#',
    githubUrl: 'https://github.com/shafikcmt/blogsite-with-php-oop',
    link: '#',
    codeLink: 'https://github.com/shafikcmt/blogsite-with-php-oop',
    clientProblem: 'Needed a simple content management website with structured code and reusable modules.',
    solution: 'Implemented OOP architecture, user auth, post CRUD, categories and comments using PHP and MySQL.',
    technologies: ['PHP OOP', 'MySQL', 'HTML5', 'CSS3', 'Bootstrap'],
    features: ['Post CRUD', 'User authentication', 'Comment management', 'Category management', 'Reusable components'],
    adminFeatures: ['Manage posts', 'Manage comments', 'Manage categories', 'Moderate users'],
    userFeatures: ['Read posts', 'Comment on posts', 'Browse categories'],
    featured: false,
    status: 'published',
  },
  {
    title: 'Laravel Multi-Vendor eCommerce',
    slug: 'laravel-multi-vendor-ecommerce',
    shortDescription: 'A scalable multi-vendor ecommerce platform with vendor, product, cart and order workflows.',
    description: 'Developed a multi-vendor ecommerce system using Laravel and MySQL with vendor dashboards, product management, cart, checkout and order tracking.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1200&auto=format&fit=crop',
    screenshots: [
      'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1556740758-90de374c12ad?q=80&w=1200&auto=format&fit=crop',
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    liveDemoUrl: '#',
    githubUrl: 'https://github.com/shafikcmt/Laravel-Multi-Vendor-Ecommerce',
    link: '#',
    codeLink: 'https://github.com/shafikcmt/Laravel-Multi-Vendor-Ecommerce',
    clientProblem: 'Needed multiple vendors to manage products and orders from a shared ecommerce platform.',
    solution: 'Created Laravel-based admin and vendor dashboards with product, cart, checkout and order tracking features.',
    technologies: ['Laravel', 'PHP', 'MySQL', 'Bootstrap', 'Authentication'],
    features: ['Vendor dashboard', 'Product management', 'Cart system', 'Checkout system', 'Order tracking', 'Admin management'],
    adminFeatures: ['Manage vendors', 'Manage products', 'Manage orders', 'Monitor platform activity'],
    userFeatures: ['Browse products', 'Add to cart', 'Checkout', 'Track orders'],
    featured: true,
    status: 'published',
  },
  {
    title: 'Production Tracking System with QR Code',
    slug: 'production-tracking-system-with-qr-code',
    shortDescription: 'A production tracking platform using Django REST API, TypeScript and QR code workflow.',
    description: 'Developed a modular production tracking system with Django REST API, TypeScript frontend, secure API access, QR code tracking and Docker deployment support.',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop',
    screenshots: [
      'https://images.unsplash.com/photo-1565043666747-69f6646db940?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=1200&auto=format&fit=crop',
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    liveDemoUrl: '#',
    githubUrl: 'https://github.com/shafikcmt/Laravel-Learning-Management-System',
    link: '#',
    codeLink: 'https://github.com/shafikcmt/Laravel-Learning-Management-System',
    clientProblem: 'Production teams needed a reliable way to track process movement and status using QR codes.',
    solution: 'Built a secure REST API and modular frontend with QR-based tracking, authentication and Docker deployment.',
    technologies: ['Django REST API', 'TypeScript', 'Docker', 'QR Code', 'Authentication'],
    features: ['QR code tracking', 'Secure APIs', 'Authentication', 'Database integration', 'Docker deployment', 'Production progress monitoring'],
    adminFeatures: ['Manage production stages', 'Scan QR codes', 'Monitor status', 'Generate reports'],
    userFeatures: ['View production status', 'Scan QR labels', 'Track progress'],
    featured: true,
    status: 'published',
  },
]

const courses = [
  {
    title: 'React.js Frontend Development',
    slug: 'react-js-frontend-development',
    shortDescription: 'Learn modern frontend development with React, components, state, hooks and API integration.',
    description: 'A practical React course for students and junior developers who want to build responsive, component-based frontend applications.',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1200&auto=format&fit=crop',
    instructor: 'Md Shafiqul Islam',
    category: 'React.js',
    price: 49,
    isFree: false,
    level: 'beginner',
    duration: '6 weeks',
    lessons: 4,
    totalLessons: 4,
    students: 0,
    syllabus: ['React basics', 'Components and props', 'State and hooks', 'API integration'],
    learningOutcomes: ['Build reusable React components', 'Manage state with hooks', 'Connect frontend with APIs', 'Deploy React projects'],
    requirements: ['Basic HTML, CSS and JavaScript knowledge', 'Laptop or desktop computer', 'Code editor'],
    certificateEnabled: true,
    published: true,
  },
  {
    title: 'Next.js Full Stack Development',
    slug: 'next-js-full-stack-development',
    shortDescription: 'Build full-stack applications with Next.js App Router, MongoDB, authentication and dashboards.',
    description: 'A job-focused Next.js course covering App Router, server routes, MongoDB, authentication, protected dashboards and deployment.',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop',
    instructor: 'Md Shafiqul Islam',
    category: 'Next.js',
    price: 79,
    isFree: false,
    level: 'intermediate',
    duration: '8 weeks',
    lessons: 4,
    totalLessons: 4,
    students: 0,
    syllabus: ['App Router', 'API routes', 'MongoDB models', 'Role-based dashboard'],
    learningOutcomes: ['Build SEO-friendly apps', 'Create API routes', 'Use MongoDB with Mongoose', 'Protect dashboards with JWT'],
    requirements: ['React basics', 'JavaScript ES6', 'Basic backend concept'],
    certificateEnabled: true,
    published: true,
  },
  {
    title: 'Laravel LMS Development',
    slug: 'laravel-lms-development',
    shortDescription: 'Build a Laravel LMS with courses, batches, quizzes, student dashboard and admin dashboard.',
    description: 'A project-based Laravel course focused on building a real-world learning management system using Laravel and MySQL.',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop',
    instructor: 'Md Shafiqul Islam',
    category: 'Laravel',
    price: 69,
    isFree: false,
    level: 'intermediate',
    duration: '8 weeks',
    lessons: 4,
    totalLessons: 4,
    students: 0,
    syllabus: ['Laravel routing', 'Auth and roles', 'Course CRUD', 'Quiz workflow'],
    learningOutcomes: ['Build Laravel dashboards', 'Design MySQL database', 'Implement auth and roles', 'Deploy Laravel project'],
    requirements: ['PHP basics', 'MySQL basics', 'HTML and CSS knowledge'],
    certificateEnabled: true,
    published: true,
  },
  {
    title: 'MERN Stack Development',
    slug: 'mern-stack-development-course',
    shortDescription: 'Build full-stack MERN apps with MongoDB, Express, React and Node.js.',
    description: 'A full-stack MERN course for building API-driven applications with authentication, dashboards and deployment workflow.',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop',
    instructor: 'Md Shafiqul Islam',
    category: 'MERN Stack',
    price: 89,
    isFree: false,
    level: 'intermediate',
    duration: '10 weeks',
    lessons: 4,
    totalLessons: 4,
    students: 0,
    syllabus: ['Express API', 'MongoDB schema', 'React frontend', 'JWT authentication'],
    learningOutcomes: ['Build REST APIs', 'Design MongoDB collections', 'Build React dashboards', 'Deploy full-stack apps'],
    requirements: ['JavaScript basics', 'React basics helpful', 'Node.js installed'],
    certificateEnabled: true,
    published: true,
  },
]

const blogs = [
  {
    title: 'How to Build a Professional Developer Portfolio That Gets Clients',
    slug: 'professional-developer-portfolio-that-gets-clients',
    excerpt: 'A practical guide to positioning your skills, projects, services and booking forms for client conversion.',
    content: 'A strong developer portfolio should not only show projects. It should explain the problem, solution, technology stack, business value and clear next action for the client. Add project case studies, service pages, order forms, testimonials, resume download and a contact system.',
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200&auto=format&fit=crop',
    author: 'Md Shafiqul Islam',
    category: 'Portfolio',
    tags: ['Portfolio', 'Freelancing', 'Web Development'],
    published: true,
    views: 0,
  },
  {
    title: 'Laravel vs MERN Stack: Which One Should You Choose?',
    slug: 'laravel-vs-mern-stack-which-one-should-you-choose',
    excerpt: 'Compare Laravel and MERN stack for LMS, ecommerce, dashboards and business software.',
    content: 'Laravel is excellent for structured business applications, admin panels, ecommerce and LMS projects. MERN stack is powerful for JavaScript-heavy apps, dashboards and real-time experiences. The best choice depends on team skill, deployment needs, project size and long-term maintenance.',
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=1200&auto=format&fit=crop',
    author: 'Md Shafiqul Islam',
    category: 'Full Stack Development',
    tags: ['Laravel', 'MERN', 'Full Stack'],
    published: true,
    views: 0,
  },
  {
    title: 'Why Every Training Business Needs an LMS Platform',
    slug: 'why-training-business-needs-lms-platform',
    excerpt: 'Learn how LMS platforms help trainers manage students, courses, live classes, video lessons and certificates.',
    content: 'A custom LMS helps a training business organize courses, batches, video lessons, live class links, assignments, quizzes, progress tracking and certificate delivery. It also improves student engagement and builds long-term brand value.',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1200&auto=format&fit=crop',
    author: 'Md Shafiqul Islam',
    category: 'LMS',
    tags: ['LMS', 'Training', 'Courses'],
    published: true,
    views: 0,
  },
]

const testimonials = [
  {
    name: 'University Training Coordinator',
    role: 'Academic Coordinator',
    company: 'Geeta University',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop',
    content: 'Shafiqul delivered hands-on training with real-world projects and helped students understand React, Next.js, MERN and Laravel in a practical way.',
    rating: 5,
    featured: true,
  },
  {
    name: 'Startup Founder',
    role: 'Founder',
    company: 'Demo Client',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
    content: 'The project delivery was structured, responsive and focused on business goals. The admin dashboard made daily management easier.',
    rating: 5,
    featured: true,
  },
  {
    name: 'Web Development Student',
    role: 'Student',
    company: 'Training Batch',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop',
    content: 'The course was practical and project-based. I learned how to build complete applications and understand client project workflows.',
    rating: 5,
    featured: true,
  },
]

async function seed() {
  console.log('Connecting to MongoDB:', MONGODB_URI)
  await mongoose.connect(MONGODB_URI)

  if (shouldReset) {
    console.log('Reset mode enabled. Clearing seeded collections...')
    await resetCollections()
  }

  const admin = await createUser({
    name: 'Md Shafiqul Islam',
    email: 'admin@shafiqul.dev',
    password: 'Admin@12345',
    role: 'admin',
  })

  const client = await createUser({
    name: 'Demo Client',
    email: 'client@demo.com',
    password: 'Client@12345',
    role: 'client',
  })

  const student = await createUser({
    name: 'Demo Student',
    email: 'student@demo.com',
    password: 'Student@12345',
    role: 'student',
  })

  await upsert(Profile, { userId: admin._id }, {
    userId: admin._id,
    title: 'Full Stack Web Developer | Laravel | MERN | Next.js',
    summary: 'Full Stack Web Developer with 4+ years of experience delivering secure, scalable and high-performance web applications. Skilled in Laravel, MERN stack, Next.js, React, Node.js, PHP, MySQL, TypeScript and REST APIs. Experienced in training, LMS development, eCommerce and ERP-style business software.',
    location: 'Narayanganj, Dhaka, Bangladesh',
    experience: '4+ years',
    education: [
      'M.Tech in Computer Science & Engineering, Geeta University, India',
      'B.Tech in Computer Science & Engineering, Kurukshetra University, India',
      'Diploma in Computer Science & Engineering',
    ],
    socials: {
      github: 'https://github.com/shafikcmt',
      linkedin: 'https://linkedin.com/in/shafikcmt',
      email: 'mailto:mdshafiqulislam822@gmail.com',
      whatsapp: 'https://wa.me/8801768987779',
    },
  })

  await upsert(WebsiteSetting, { siteName: profileInfo.siteName }, profileInfo)
  await upsert(Setting, { key: 'site' }, { key: 'site', value: profileInfo })
  await upsert(Setting, { key: 'theme' }, { key: 'theme', value: { defaultMode: 'dark', accentColor: 'primary' } })
  await upsert(Setting, { key: 'contact' }, { key: 'contact', value: { email: profileInfo.email, phone: profileInfo.phone, whatsapp: profileInfo.whatsapp } })

  for (const [category, names] of skillSeed) {
    for (const name of names) {
      await upsert(Skill, { name, category }, { name, category, level: ['React', 'Next.js', 'Laravel', 'Node.js', 'MySQL', 'MongoDB'].includes(name) ? 'Expert' : 'Advanced' })
    }
  }

  const serviceDocs = {}
  for (const service of services) {
    serviceDocs[service.slug] = await upsert(Service, { slug: service.slug }, service)
  }

  const projectDocs = {}
  for (const project of projects) {
    projectDocs[project.slug] = await upsert(Project, { slug: project.slug }, project)
  }

  const courseDocs = {}
  for (const course of courses) {
    courseDocs[course.slug] = await upsert(Course, { slug: course.slug }, course)
  }

  const lessonBlueprints = [
    ['react-js-frontend-development', [
      ['Introduction to React and components', true],
      ['Props, state and event handling', false],
      ['React hooks and reusable logic', false],
      ['API integration project', false],
    ]],
    ['next-js-full-stack-development', [
      ['Next.js App Router overview', true],
      ['API routes and MongoDB connection', false],
      ['JWT authentication and protected routes', false],
      ['Admin dashboard project', false],
    ]],
    ['laravel-lms-development', [
      ['Laravel project setup and routing', true],
      ['Authentication and role management', false],
      ['Course, batch and quiz modules', false],
      ['Deploying the LMS project', false],
    ]],
    ['mern-stack-development-course', [
      ['Express API setup', true],
      ['MongoDB schema and CRUD', false],
      ['React dashboard frontend', false],
      ['JWT auth and deployment', false],
    ]],
  ]

  const lessonsByCourse = {}
  for (const [courseSlug, lessons] of lessonBlueprints) {
    const course = courseDocs[courseSlug]
    lessonsByCourse[courseSlug] = []
    for (let index = 0; index < lessons.length; index += 1) {
      const [title, isPreview] = lessons[index]
      const slug = slugify(title)
      const lesson = await upsert(Lesson, { courseId: course._id, slug }, {
        courseId: course._id,
        title,
        slug,
        description: `${title} for ${course.title}. This lesson includes practical explanation and project-based tasks.`,
        videoUrl: `https://www.youtube.com/embed/dQw4w9WgXcQ`,
        duration: 35 + index * 5,
        order: index + 1,
        locked: !isPreview,
        isLocked: !isPreview,
        isPreview,
        resources: ['https://developer.mozilla.org/', 'https://nextjs.org/docs'],
      })
      lessonsByCourse[courseSlug].push(lesson)
    }
  }

  for (const course of Object.values(courseDocs)) {
    await Course.findByIdAndUpdate(course._id, { totalLessons: 4, lessons: 4 })
  }

  const liveClassSeeds = [
    { title: 'React Portfolio Live Class', courseSlug: 'react-js-frontend-development', scheduledDate: daysFromNow(7), duration: 90 },
    { title: 'Next.js Auth Live Class', courseSlug: 'next-js-full-stack-development', scheduledDate: daysFromNow(10), duration: 120 },
    { title: 'Laravel LMS Architecture Live Class', courseSlug: 'laravel-lms-development', scheduledDate: daysFromNow(14), duration: 120 },
    { title: 'MERN Deployment Live Class', courseSlug: 'mern-stack-development-course', scheduledDate: daysFromNow(17), duration: 90 },
  ]

  for (const item of liveClassSeeds) {
    const course = courseDocs[item.courseSlug]
    await upsert(LiveClass, { title: item.title, courseId: course._id }, {
      title: item.title,
      description: `Live training class for ${course.title}.`,
      courseId: course._id,
      instructor: 'Md Shafiqul Islam',
      scheduledDate: item.scheduledDate,
      duration: item.duration,
      meetingLink: 'https://meet.google.com/demo-live-class',
      capacity: 50,
      enrolled: 1,
      status: 'scheduled',
    })
  }

  const reactLessons = lessonsByCourse['react-js-frontend-development'] || []
  const nextLessons = lessonsByCourse['next-js-full-stack-development'] || []

  const completedEnrollment = await upsert(Enrollment, { studentId: student._id, courseId: courseDocs['react-js-frontend-development']._id }, {
    studentId: student._id,
    courseId: courseDocs['react-js-frontend-development']._id,
    progress: 100,
    completedLessons: reactLessons.map((lesson) => lesson._id),
    status: 'completed',
    certificateIssued: true,
    enrolledAt: daysFromNow(-30),
    completedAt: daysFromNow(-1),
  })

  await upsert(Enrollment, { studentId: student._id, courseId: courseDocs['next-js-full-stack-development']._id }, {
    studentId: student._id,
    courseId: courseDocs['next-js-full-stack-development']._id,
    progress: 25,
    completedLessons: nextLessons.slice(0, 1).map((lesson) => lesson._id),
    status: 'active',
    certificateIssued: false,
    enrolledAt: daysFromNow(-7),
  })

  await upsert(Certificate, { certificateId: 'MSI-REACT-2026-0001' }, {
    studentId: student._id,
    courseId: courseDocs['react-js-frontend-development']._id,
    enrollmentId: completedEnrollment._id,
    studentName: student.name,
    courseName: courseDocs['react-js-frontend-development'].title,
    instructorName: 'Md Shafiqul Islam',
    completionDate: daysFromNow(-1),
    certificateId: 'MSI-REACT-2026-0001',
    certificateUrl: '/certificates/MSI-REACT-2026-0001.pdf',
  })

  for (const blog of blogs) {
    await upsert(Blog, { slug: blog.slug }, blog)
  }

  for (const testimonial of testimonials) {
    await upsert(Testimonial, { name: testimonial.name, company: testimonial.company }, testimonial)
  }

  await upsert(ProjectOrder, { clientEmail: client.email, projectType: 'LMS Development' }, {
    clientId: client._id,
    clientName: client.name,
    clientEmail: client.email,
    clientPhone: '+8801700000000',
    companyName: 'Demo Training Center',
    projectType: 'LMS Development',
    budgetRange: '$800 - $1500',
    deadline: '30 days',
    preferredTechnology: 'Next.js + MongoDB',
    description: 'Need an LMS with admin dashboard, course videos, live classes and certificate system.',
    referenceLinks: ['https://www.udemy.com/', 'https://teachable.com/'],
    attachmentUrl: '',
    meetingPreference: 'Google Meet',
    status: 'discussing',
  })

  await upsert(ConsultationBooking, { email: client.email, topic: 'Portfolio LMS Consultation' }, {
    clientId: client._id,
    name: client.name,
    email: client.email,
    phone: '+8801700000000',
    topic: 'Portfolio LMS Consultation',
    notes: 'Need a live discussion about LMS features, budget and timeline.',
    scheduledAt: daysFromNow(5, 21, 0),
    duration: 60,
    meetingLink: 'https://meet.google.com/demo-consultation',
    status: 'confirmed',
  })

  await upsert(ContactMessage, { email: 'lead@example.com', subject: 'Need a Next.js website' }, {
    name: 'Sample Lead',
    email: 'lead@example.com',
    phone: '+8801800000000',
    subject: 'Need a Next.js website',
    message: 'I want a professional portfolio and company website with service booking form.',
    status: 'new',
    read: false,
  })

  await Course.updateMany({}, [{ $set: { students: { $ifNull: ['$students', 0] } } }])

  console.log('\nSeed completed successfully.\n')
  console.log('Login credentials:')
  console.log('Admin:   admin@shafiqul.dev   / Admin@12345')
  console.log('Client:  client@demo.com       / Client@12345')
  console.log('Student: student@demo.com      / Student@12345')
  console.log('\nRun the app with: npm run dev\n')
}

seed()
  .catch((error) => {
    console.error('Seed failed:', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await mongoose.disconnect()
  })
