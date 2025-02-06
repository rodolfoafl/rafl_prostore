import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getOrderById } from '@/lib/actions/order.action'

export const metadata: Metadata = {
  title: 'Order Details',
}

interface OrderDetailsPageProps {
  params: Promise<{ id: string }>
}

export default async function OrderDetailsPage({
  params,
}: OrderDetailsPageProps) {
  const { id } = await params

  const order = await getOrderById(id)
  if (!order) notFound()

  return <div>OrderDetailsPage</div>
}
