/* eslint-disable camelcase */
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import Stripe from 'stripe'

import { Button } from '@/components/ui/button'
import { getOrderById } from '@/lib/actions/order.action'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

interface StripePaymentSuccessPageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ payment_intent: string }>
}

export default async function StripePaymentSuccessPage({
  params,
  searchParams,
}: StripePaymentSuccessPageProps) {
  const { id } = await params
  const { payment_intent } = await searchParams

  const order = await getOrderById(id)
  if (!order) notFound()

  const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent)

  if (
    paymentIntent.metadata.orderId == null ||
    paymentIntent.metadata.orderId !== order.id.toString()
  ) {
    return notFound()
  }

  const isSuccess = paymentIntent.status === 'succeeded'

  if (!isSuccess) return redirect(`/order/${id}`)

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8">
      <div className="flex flex-col items-center gap-6">
        <h1 className="h1-bold">Thanks for your purchase</h1>
        <div>We are processing your order.</div>

        <Button asChild>
          <Link href={`/order/${id}`}>View Order</Link>
        </Button>
      </div>
    </div>
  )
}
