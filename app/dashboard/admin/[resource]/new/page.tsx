'use client'

import { useParams, useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import DashboardLayout from '@/components/DashboardLayout'
import EmptyState from '@/components/EmptyState'
import AdminCrudForm from '@/components/admin/AdminCrudForm'
import { getAdminResourceConfig } from '@/components/admin/adminResourceConfig'

export default function AdminResourceCreatePage() {
  const params = useParams()
  const router = useRouter()
  const resource = String(params.resource || '')
  const config = getAdminResourceConfig(resource)

  if (!config) {
    return (
      <ProtectedRoute requiredRoles={['admin']}>
        <DashboardLayout title="Admin">
          <EmptyState
            title="Admin page not found"
            message="This create page does not exist for the requested admin resource."
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
        title={`Add ${config.singular}`}
        breadcrumbs={[
          { label: 'Admin Dashboard', href: '/dashboard/admin' },
          { label: config.title, href: config.listPath },
          { label: `Add ${config.singular}`, href: `${config.listPath}/new` },
        ]}
      >
        <AdminCrudForm
          title={config.title}
          resourceName={config.singular}
          apiPath={config.apiPath}
          listPath={config.listPath}
          fields={config.fields}
        />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
