import { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { auth } from '@/auth'
import ShippingAddressForm from '@/components/shipping-address-form'
import { getUserCart } from '@/lib/actions/cart.actions'
import { getUserById } from '@/lib/actions/user.actions'
import { ShippingAddress } from '@/types'

export const metadata: Metadata = {
  title: 'Shipping Address',
}

export default async function ShippingAddressPage() {
  const cart = await getUserCart()
  if (!cart || cart.items.length === 0) redirect('/cart')

  const session = await auth()
  const userId = session?.user?.id
  if (!userId) throw new Error('User not found')

  const user = await getUserById(userId)

  return (
    <div className="min-h-screen">
      <ShippingAddressForm address={user.address as ShippingAddress} />
    </div>
  )
}
