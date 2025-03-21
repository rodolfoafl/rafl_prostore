import { Metadata } from 'next'

import OrdersTable from '@/components/orders-table'
import { getUserOrders } from '@/lib/actions/order.action'

export const metadata: Metadata = {
  title: 'My Orders',
}

interface UserOrdersPageProps {
  searchParams: Promise<{ page: string }>
}

export default async function UserOrdersPage({
  searchParams,
}: UserOrdersPageProps) {
  const { page = '1' } = await searchParams

  const orders = await getUserOrders({
    page: Number(page),
  })

  return <OrdersTable orders={orders} currentPage={page} />
}
