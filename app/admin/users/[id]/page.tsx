import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import UpdateUserForm from '@/components/admin/update-user-form'
import { getUserById } from '@/lib/actions/user.actions'

export const metadata: Metadata = {
  title: 'Update User',
}

interface UpdateUserPageProps {
  params: Promise<{ id: string }>
}

export default async function UpdateUserPage({ params }: UpdateUserPageProps) {
  const { id } = await params
  const user = await getUserById(id)

  if (!user) return notFound()

  return (
    <div className="mx-auto max-w-lg space-y-8">
      <h1 className="h2-bold">Update User</h1>
      <UpdateUserForm user={user} />
    </div>
  )
}
