/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from '@prisma/client'
import Link from 'next/link'
import { Metadata } from 'next/types'

import DeleteDialog from '@/components/shared/delete-dialog'
import Pagination from '@/components/shared/pagination'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { deleteUser, getAllUsers } from '@/lib/actions/user.actions'
import { shortenId } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Admin Users',
}

interface AdminUserSPageProps {
  searchParams: Promise<{ page: string; query: string }>
}

export default async function AdminUserSPage({
  searchParams,
}: AdminUserSPageProps) {
  const { page, query } = await searchParams
  const currentPage = Number(page) || 1

  const users = await getAllUsers({
    page: currentPage,
    query,
  })

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <h1 className="h2-bold">Users</h1>
        {query && (
          <div className="space-x-2">
            Filtered by <i>&quot;{query}&quot;</i>{' '}
            <Link href="/admin/users">
              <Button variant="outline" size="sm">
                Clear
              </Button>
            </Link>
          </div>
        )}
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>NAME</TableHead>
              <TableHead>EMAIL</TableHead>
              <TableHead>ROLE</TableHead>
              <TableHead>ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.data.map((user: User) => (
              <TableRow key={user.id}>
                <TableCell>{shortenId(user.id)}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.role === 'user' ? (
                    <Badge variant="secondary">User</Badge>
                  ) : (
                    <Badge variant="default">Admin</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/users/${user.id}`}>Edit</Link>
                  </Button>
                  <DeleteDialog id={user.id} action={deleteUser} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {users.totalPages > 1 && (
          <Pagination page={currentPage} totalPages={users?.totalPages} />
        )}
      </div>
    </div>
  )
}
