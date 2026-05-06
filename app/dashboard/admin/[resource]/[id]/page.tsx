'use client'

import { useParams, useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import DashboardLayout from '@/components/DashboardLayout'
import EmptyState from '@/components/EmptyState'
import AdminCrudForm from '@/components/admin/AdminCrudForm'
import { getAdminResourceConfig } from '@/components/admin/adminResourceConfig'

export default function AdminResourceEditPage() {
  const params = useParams()
  const router = useRouter()
  const resource = String(params.resource || '')
  const id = String(params.id || '')
  const config = getAdminResourceConfig(resource)

  if (!config) {
    return (
      <ProtectedRoute requiredRoles={['admin']}>
        <DashboardLayout title="Admin">
          <EmptyState
            title="Admin page not found"
            message="This edit page does not exist for the requested admin resource."
            actionLabel="Go to Admin Dashboard"
            onAction={() => router.push('/dashboard/admin')}
          />
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute requiredRoles={['admin']}>
      <DashboardLayout
        title={`Edit ${config.singular}`}
        breadcrumbs={[
          { label: 'Admin Dashboard', href: '/dashboard/admin' },
          { label: config.title, href: config.listPath },
          { label: `Edit ${config.singular}`, href: `${config.listPath}/${id}` },
        ]}
      >
        <AdminCrudForm
          title={config.title}
          resourceName={config.singular}
          apiPath={config.apiPath}
          listPath={config.listPath}
          fields={config.fields}
          id={id}
        />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
