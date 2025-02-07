import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import OrderDetailsTable from '@/components/order-details-table'
import { getOrderById } from '@/lib/actions/order.action'
import { ShippingAddress } from '@/types'

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

  return (
    <div className="min-h-screen">
      <OrderDetailsTable
        order={{
          ...order,
          shippingAddress: order.shippingAddress as ShippingAddress,
        }}
      />
    </div>
  )
}
