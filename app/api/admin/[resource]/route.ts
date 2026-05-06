import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { withAdminAuth } from '@/lib/crud'
import Blog from '@/models/Blog'
import Certificate from '@/models/Certificate'
import ContactMessage from '@/models/ContactMessage'
import Course from '@/models/Course'
import Lesson from '@/models/Lesson'
import LiveClass from '@/models/LiveClass'
import Project from '@/models/Project'
import Service from '@/models/Service'
import Skill from '@/models/Skill'
import Testimonial from '@/models/Testimonial'
import User from '@/models/User'

type RouteParams = { resource: string } | Promise<{ resource: string }>

interface ResourceConfig {
  model: any
  entityName: string
  listFilter?: Record<string, any>
  defaults?: Record<string, any>
  force?: Record<string, any>
  select?: string
  populate?: string | string[]
}

const resourceMap: Record<string, ResourceConfig> = {
  projects: { model: Project, entityName: 'Project' },
  services: { model: Service, entityName: 'Service' },
  skills: { model: Skill, entityName: 'Skill' },
  courses: { model: Course, entityName: 'Course' },
  lessons: { model: Lesson, entityName: 'Lesson', populate: 'courseId' },
  'live-classes': { model: LiveClass, entityName: 'Live Class', populate: 'courseId' },
  testimonials: { model: Testimonial, entityName: 'Testimonial' },
  blogs: { model: Blog, entityName: 'Blog' },
  users: { model: User, entityName: 'User', select: '-password' },
  students: {
    model: User,
    entityName: 'Student',
    listFilter: { role: 'student' },
    defaults: { role: 'student', isActive: true },
    force: { role: 'student' },
    select: '-password',
  },
  certificates: { model: Certificate, entityName: 'Certificate', populate: ['studentId', 'courseId', 'enrollmentId'] },
  'contact-messages': { model: ContactMessage, entityName: 'Contact Message' },
}

function getConfig(resource: string) {
  return resourceMap[resource]
}

function cleanPayload(resource: string, body: Record<string, any>, config: ResourceConfig) {
  const payload: Record<string, any> = {
    ...(config.defaults || {}),
    ...body,
    ...(config.force || {}),
  }

  delete payload.id
  delete payload._id
  delete payload.createdAt
  delete payload.updatedAt
  delete payload.__v

  Object.keys(payload).forEach((key) => {
    if (payload[key] === undefined) delete payload[key]
  })

  if ((resource === 'users' || resource === 'students') && !payload.password) {
    delete payload.password
  }

  if (resource === 'contact-messages' && payload.status !== undefined) {
    payload.read = payload.status !== 'new'
  }

  Object.keys(payload).forEach((key) => {
    if (payload[key] === undefined) delete payload[key]
  })

  return payload
}

function applyPopulate(query: any, populate?: string | string[]) {
  if (!populate) return query
  const fields = Array.isArray(populate) ? populate : [populate]
  return fields.reduce((currentQuery, field) => currentQuery.populate(field), query)
}

function toSafeObject(item: any) {
  if (!item) return item
  const obj = typeof item.toObject === 'function' ? item.toObject() : item
  if (obj.password) delete obj.password
  return obj
}

async function findById(config: ResourceConfig, id: string) {
  let query = config.model.findById(id)
  if (config.select) query = query.select(config.select)
  query = applyPopulate(query, config.populate)
  return query
}

async function resolveResource(params: RouteParams) {
  const resolved = await params
  return resolved.resource
}

async function ensureAdmin(request: NextRequest) {
  const admin = await withAdminAuth(request)
  if (!admin) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized: Admin access required' },
      { status: 401 }
    )
  }
  return null
}

export async function GET(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  const resource = await resolveResource(params)
  try {
    const unauthorized = await ensureAdmin(request)
    if (unauthorized) return unauthorized

    const config = getConfig(resource)
    if (!config) {
      return NextResponse.json({ success: false, message: 'Admin resource not found' }, { status: 404 })
    }

    await connectDB()
    const url = new URL(request.url)
    const id = url.searchParams.get('id')

    if (id) {
      const item = await findById(config, id)
      if (!item) {
        return NextResponse.json({ success: false, message: `${config.entityName} not found` }, { status: 404 })
      }
      return NextResponse.json({ success: true, data: toSafeObject(item) })
    }

    let query = config.model.find(config.listFilter || {}).sort({ createdAt: -1 })
    if (config.select) query = query.select(config.select)
    query = applyPopulate(query, config.populate)
    const items = await query

    return NextResponse.json({ success: true, data: items.map(toSafeObject) })
  } catch (error: any) {
    console.error(`Admin ${resource} fetch error:`, error)
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch admin resource' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  const resource = await resolveResource(params)
  try {
    const unauthorized = await ensureAdmin(request)
    if (unauthorized) return unauthorized

    const config = getConfig(resource)
    if (!config) {
      return NextResponse.json({ success: false, message: 'Admin resource not found' }, { status: 404 })
    }

    await connectDB()
    const body = await request.json()
    const payload = cleanPayload(resource, body, config)
    const item = await config.model.create(payload)
    const saved = await findById(config, item._id)

    return NextResponse.json(
      { success: true, message: `${config.entityName} created successfully`, data: toSafeObject(saved) },
      { status: 201 }
    )
  } catch (error: any) {
    console.error(`Admin ${resource} creation error:`, error)
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create admin resource' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  const resource = await resolveResource(params)
  try {
    const unauthorized = await ensureAdmin(request)
    if (unauthorized) return unauthorized

    const config = getConfig(resource)
    if (!config) {
      return NextResponse.json({ success: false, message: 'Admin resource not found' }, { status: 404 })
    }

    await connectDB()
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID is required for update' }, { status: 400 })
    }

    let itemQuery = config.model.findById(id)
    if (resource === 'users' || resource === 'students') {
      itemQuery = itemQuery.select('+password')
    }
    const item = await itemQuery
    if (!item) {
      return NextResponse.json({ success: false, message: `${config.entityName} not found` }, { status: 404 })
    }

    const payload = cleanPayload(resource, body, config)
    Object.keys(payload).forEach((key) => {
      item[key] = payload[key]
    })

    await item.save()
    const updated = await findById(config, item._id)

    return NextResponse.json({
      success: true,
      message: `${config.entityName} updated successfully`,
      data: toSafeObject(updated),
    })
  } catch (error: any) {
    console.error(`Admin ${resource} update error:`, error)
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update admin resource' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  const resource = await resolveResource(params)
  try {
    const unauthorized = await ensureAdmin(request)
    if (unauthorized) return unauthorized

    const config = getConfig(resource)
    if (!config) {
      return NextResponse.json({ success: false, message: 'Admin resource not found' }, { status: 404 })
    }

    await connectDB()
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID is required for deletion' }, { status: 400 })
    }

    const item = await config.model.findByIdAndDelete(id)
    if (!item) {
      return NextResponse.json({ success: false, message: `${config.entityName} not found` }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: `${config.entityName} deleted successfully` })
  } catch (error: any) {
    console.error(`Admin ${resource} delete error:`, error)
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete admin resource' },
      { status: 500 }
    )
  }
}
