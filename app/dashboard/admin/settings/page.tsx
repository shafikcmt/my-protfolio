'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import DashboardLayout from '@/components/DashboardLayout'
import AdminCrudForm from '@/components/admin/AdminCrudForm'
import { websiteSettingFields } from '@/components/admin/resourceFields'
import TelegramSetupCard from '@/components/admin/TelegramSetupCard'
import AiSettingsCard from '@/components/admin/AiSettingsCard'

export default function AdminSettingsPage() {
  return (
    <ProtectedRoute requiredRoles={['admin']}>
      <DashboardLayout
        title="Website Settings"
        breadcrumbs={[
          { label: 'Admin Dashboard', href: '/dashboard/admin' },
          { label: 'Settings', href: '/dashboard/admin/settings' },
        ]}
      >
        <AiSettingsCard />
        <TelegramSetupCard />
        <AdminCrudForm
          title="Website Settings"
          resourceName="Website Settings"
          apiPath="/api/admin/settings"
          listPath="/dashboard/admin"
          fields={websiteSettingFields}
          id="settings"
        />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
