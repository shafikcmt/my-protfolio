import { redirect } from 'next/navigation'

export default function ClientProfileRedirectPage() {
  redirect('/dashboard/profile')
}
