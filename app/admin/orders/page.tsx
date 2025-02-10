import { Metadata } from 'next'

import OrdersTable from '@/components/orders-table'
import { getAllOrders } from '@/lib/actions/order.action'

export const metadata: Metadata = {
  title: 'Admin Orders',
}

interface AdminOrdersPageProps {
  searchParams: Promise<{ page: string }>
}

export default async function AdminOrdersPage({
  searchParams,
}: AdminOrdersPageProps) {
  const { page = '1' } = await searchParams

  const orders = await getAllOrders({
    page: Number(page),
  })

  return <OrdersTable orders={orders} currentPage={page} />
}
