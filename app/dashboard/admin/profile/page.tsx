import { redirect } from 'next/navigation'

export default function AdminProfileRedirectPage() {
  redirect('/dashboard/profile')
}
