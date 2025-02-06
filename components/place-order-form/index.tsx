'use client'

import { Check, Loader } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useFormStatus } from 'react-dom'

import { Button } from '@/components/ui/button'
import { createOrder } from '@/lib/actions/order.action'

export default function PlaceOrderForm() {
  const router = useRouter()

  const PlaceOrderButton = () => {
    const { pending } = useFormStatus()
    return (
      <Button disabled={pending} className="w-full">
        {pending ? (
          <Loader className="size-4 animate-spin" />
        ) : (
          <Check className="size-4" />
        )}{' '}
        Place Order
      </Button>
    )
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const response = await createOrder()

    if (response.redirectTo) {
      router.push(response.redirectTo)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <PlaceOrderButton />
    </form>
  )
}
