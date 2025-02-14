/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from 'next/link'

import DeleteDialog from '@/components/shared/delete-dialog'
import Pagination from '@/components/shared/pagination'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatCurrency, formatDateTime, shortenId } from '@/lib/utils'

export default function OrdersTable({
  orders,
  currentPage,
  dialogAction,
  query,
  isAdmin = false,
}: any) {
  return (
    <div className="space-y-2">
      {!isAdmin ? (
        <h2 className="h2-bold">Orders</h2>
      ) : (
        <div className="flex items-center gap-3">
          <h1 className="h2-bold">Orders</h1>
          {query && (
            <div className="space-x-2">
              Filtered by <i>&quot;{query}&quot;</i>{' '}
              <Link href="/admin/orders">
                <Button variant="outline" size="sm">
                  Clear
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>DATE</TableHead>
              {isAdmin && <TableHead>BUYER</TableHead>}
              <TableHead>TOTAL</TableHead>
              <TableHead>PAID</TableHead>
              <TableHead>DELIVERED</TableHead>
              <TableHead>ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.data.map((order: any) => (
              <TableRow key={order.id}>
                <TableCell>{shortenId(order.id)}</TableCell>
                <TableCell>
                  {formatDateTime(order.createdAt).dateTime}
                </TableCell>
                {isAdmin && <TableCell>{order.user.name}</TableCell>}
                <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
                <TableCell>
                  {order.isPaid && order.paidAt
                    ? formatDateTime(order.paidAt).dateTime
                    : 'Not Paid'}
                </TableCell>
                <TableCell>
                  {order.isDelivered && order.deliveredAt
                    ? formatDateTime(order.deliveredAt).dateTime
                    : 'Not Delivered'}
                </TableCell>
                <TableCell>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/order/${order.id}`}>Details</Link>
                  </Button>
                  {dialogAction && (
                    <DeleteDialog id={order.id} action={dialogAction} />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {orders.totalPages > 1 && (
          <Pagination
            page={Number(currentPage) || 1}
            totalPages={orders?.totalPages}
          />
        )}
      </div>
    </div>
  )
}
