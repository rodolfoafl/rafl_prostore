import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { auth } from '@/auth'
import CheckoutSteps from '@/components/shared/checkout-steps'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getUserCart } from '@/lib/actions/cart.actions'
import { getUserById } from '@/lib/actions/user.actions'
import { formatCurrency } from '@/lib/utils'
import { ShippingAddress } from '@/types'

export const metadata: Metadata = {
  title: 'Place Order',
}

export default async function PlaceOrderPage() {
  const cart = await getUserCart()
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) throw new Error('User not found')

  const user = await getUserById(userId)

  if (!cart || cart.items.length === 0) redirect('/cart')
  if (!user.address) redirect('/shipping-address')
  if (!user.paymentMethod) redirect('/payment-method')

  const userAddress = user.address as ShippingAddress

  return (
    <div className="min-h-screen">
      <CheckoutSteps current={3} />
      <h1 className="py-4 text-2xl">Place Order</h1>

      <div className="grid md:grid-cols-3 md:gap-5">
        <div className="space-y-4 overflow-x-auto md:col-span-2">
          <Card>
            <CardContent className="gap-4 p-4">
              <h2 className="pb-4 text-xl font-semibold">Shipping Address</h2>
              <p>{userAddress.fullName}</p>
              <p>
                {userAddress.streetAddress}, {userAddress.city}{' '}
                {userAddress.postalCode}, {userAddress.country}{' '}
              </p>
              <div className="mt-3">
                <Link href="/shipping-address">
                  <Button variant="outline">Edit</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="gap-4 p-4">
              <h2 className="pb-4 text-xl font-semibold">Payment Method</h2>
              <p>{user.paymentMethod}</p>
              <div className="mt-3">
                <Link href="/payment-method">
                  <Button variant="outline">Edit</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="gap-4 p-4">
              <h2 className="pb-4 text-xl font-semibold">Order Items</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-center">Quantity</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cart.items.map((item) => (
                    <TableRow key={item.slug}>
                      <TableCell>
                        <Link
                          href={`/product/${item.slug}`}
                          className="flex items-center"
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                          />
                          <span className="px-2">{item.name}</span>
                        </Link>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="px-2">{item.qty}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="px-2">
                          {formatCurrency(item.price)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardContent className="gap-4 space-y-4 p-4">
              <div className="flex justify-between">
                <div>Items</div>
                <div className="font-semibold">
                  {formatCurrency(cart.itemsPrice)}
                </div>
              </div>
              <div className="flex justify-between">
                <div>Shipping</div>
                <div className="font-semibold">
                  {formatCurrency(cart.shippingPrice)}
                </div>
              </div>
              <div className="flex justify-between">
                <div>Tax</div>
                <div className="font-semibold">
                  {formatCurrency(cart.taxPrice)}
                </div>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-4">
                <div>Total</div>
                <div className="text-xl font-semibold">
                  {formatCurrency(cart.totalPrice)}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
