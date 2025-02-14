import { Metadata } from 'next'

import OrdersTable from '@/components/orders-table'
import { deleteOrder, getAllOrders } from '@/lib/actions/order.action'

export const metadata: Metadata = {
  title: 'Admin Orders',
}

interface AdminOrdersPageProps {
  searchParams: Promise<{ page: string; query: string }>
}

export default async function AdminOrdersPage({
  searchParams,
}: AdminOrdersPageProps) {
  const { page = '1', query } = await searchParams

  const orders = await getAllOrders({
    page: Number(page),
    query,
  })

  return (
    <OrdersTable
      orders={orders}
      currentPage={page}
      dialogAction={deleteOrder}
      isAdmin={true}
      query={query}
    />
  )
}
