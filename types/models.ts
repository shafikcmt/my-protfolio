export interface IBaseModel {
  _id?: string
  id?: string
  createdAt?: string | Date
  updatedAt?: string | Date
}

export interface IProject extends IBaseModel {
  title: string
  slug: string
  description: string
  shortDescription?: string
  image?: string
  screenshots?: string[]
  videoUrl?: string
  liveDemoUrl?: string
  githubUrl?: string
  link?: string
  codeLink?: string
  clientProblem?: string
  solution?: string
  technologies?: string[]
  features?: string[]
  adminFeatures?: string[]
  userFeatures?: string[]
  featured?: boolean
  status?: 'draft' | 'published' | 'archived'
}

export interface IProjectFeature extends IBaseModel {
  projectId: string | IProject
  title: string
  description: string
}

export interface IService extends IBaseModel {
  title: string
  slug: string
  description: string
  shortDescription?: string
  icon?: string
  price?: number
  startingPrice?: string
  duration?: string
  technologies?: string[]
  features?: string[]
  featured?: boolean
  published?: boolean
}

export interface ICourse extends IBaseModel {
  title: string
  slug: string
  description: string
  shortDescription?: string
  image?: string
  instructor?: string
  category?: string
  price?: number
  isFree?: boolean
  level?: 'beginner' | 'intermediate' | 'advanced'
  duration?: string
  lessons?: number
  totalLessons?: number
  students?: number
  published?: boolean
  syllabus?: string[]
  learningOutcomes?: string[]
  requirements?: string[]
  certificateEnabled?: boolean
}

export interface ILesson extends IBaseModel {
  courseId: string | ICourse
  title: string
  slug?: string
  description?: string
  videoUrl?: string
  duration?: number | string
  order?: number
  locked?: boolean
  isLocked?: boolean
  isPreview?: boolean
  resources?: string[]
}

export interface ILiveClass extends IBaseModel {
  title: string
  description?: string
  courseId?: string | ICourse
  instructor?: string
  scheduledDate?: string | Date
  scheduledAt?: string | Date
  duration?: number
  meetingLink?: string
  capacity?: number
  enrolled?: number
  status?: 'scheduled' | 'live' | 'ended' | 'cancelled'
}

export interface IEnrollment extends IBaseModel {
  studentId: string
  courseId: string | ICourse
  progress?: number
  completedLessons?: string[]
  status?: 'active' | 'completed'
  certificateIssued?: boolean
  enrolledAt?: string | Date
  completedAt?: string | Date
}

export interface ICertificate extends IBaseModel {
  studentId?: string
  courseId?: string
  enrollmentId: string | IEnrollment
  certificateId: string
  studentName: string
  courseName: string
  instructorName: string
  completionDate: string | Date
  certificateUrl?: string
}

export interface IBlog extends IBaseModel {
  title: string
  slug: string
  content: string
  excerpt?: string
  image?: string
  author?: string
  category?: string
  tags?: string[]
  published?: boolean
  views?: number
  seoTitle?: string
  seoDescription?: string
}

export interface ITestimonial extends IBaseModel {
  name: string
  role?: string
  company?: string
  image?: string
  content?: string
  comment?: string
  rating?: number
  featured?: boolean
}

export interface IContactMessage extends IBaseModel {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  status?: 'new' | 'read' | 'replied' | 'archived'
  read?: boolean
}

export type ProjectOrderStatus =
  | 'pending'
  | 'discussing'
  | 'accepted'
  | 'in_progress'
  | 'in-progress'
  | 'testing'
  | 'delivered'
  | 'completed'
  | 'cancelled'

export interface IStatusHistory {
  status: string
  note?: string
  changedBy?: string
  changedAt?: string | Date
}

export interface IProjectOrder extends IBaseModel {
  orderNumber?: string
  clientId?: string | any
  clientName: string
  clientEmail: string
  clientPhone?: string
  companyName?: string
  projectType: string
  serviceTitle?: string
  title?: string
  budgetRange?: string
  budget?: number
  deadline?: string
  timeline?: string
  preferredTechnology?: string
  description?: string
  referenceLinks?: string[]
  attachmentUrl?: string
  meetingPreference?: string
  meetingLink?: string
  proposalUrl?: string
  deliveryUrl?: string
  adminNote?: string
  clientNote?: string
  progress?: number
  status?: ProjectOrderStatus
  statusHistory?: IStatusHistory[]
}

export interface IOrder extends IBaseModel {
  orderNumber?: string
  clientId?: string
  serviceTitle?: string
  title: string
  description?: string
  budget?: number
  timeline?: string
  progress?: number
  status?: 'pending' | 'accepted' | 'in-progress' | 'in_progress' | 'completed' | 'cancelled'
}

export interface IConsultationBooking extends IBaseModel {
  clientId?: string | any
  name?: string
  email?: string
  phone?: string
  topic: string
  notes?: string
  message?: string
  scheduledAt?: string | Date
  preferredDate?: string
  preferredTime?: string
  duration?: number
  meetingLink?: string
  adminNote?: string
  status?: 'requested' | 'pending' | 'confirmed' | 'approved' | 'rejected' | 'completed' | 'cancelled'
  statusHistory?: IStatusHistory[]
}

export interface ISkill extends IBaseModel {
  name: string
  category: string
  level?: string
  icon?: string
  order?: number
}

export interface IWebsiteSetting extends IBaseModel {
  siteName?: string
  logo?: string
  email?: string
  phone?: string
  whatsapp?: string
  address?: string
  github?: string
  linkedin?: string
  facebook?: string
  maintenanceMode?: boolean
  seoTitle?: string
  seoDescription?: string
  heroTitle?: string
  heroSubtitle?: string
  resumeUrl?: string
}
