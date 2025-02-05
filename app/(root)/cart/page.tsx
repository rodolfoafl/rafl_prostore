import { Metadata } from 'next'

import CartTable from '@/components/cart-table'
import { getUserCart } from '@/lib/actions/cart.actions'

export const metadata: Metadata = {
  title: 'Shopping Cart',
}

export default async function CartPage() {
  const cart = await getUserCart()

  return (
    <div>
      <CartTable cart={cart} />
    </div>
  )
}
