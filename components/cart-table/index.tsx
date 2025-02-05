'use client'

import { ArrowRight, Loader, Minus, Plus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

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
import { useToast } from '@/hooks/use-toast'
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.actions'
import { formatCurrency } from '@/lib/utils'
import { Cart, CartItem } from '@/types'

export default function CartTable({ cart }: { cart?: Cart }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isPendingState, startTransition] = useTransition()

  const handleRemoveItem = (productId: string) => {
    startTransition(async () => {
      const response = await removeItemFromCart(productId)

      if (!response.success) {
        toast({
          variant: 'destructive',
          description: response.message,
        })
      }
    })
  }

  const handleAddItem = ({ item }: { item: CartItem }) => {
    startTransition(async () => {
      const response = await addItemToCart(item)

      if (!response.success) {
        toast({
          variant: 'destructive',
          description: response.message,
        })
      }
    })
  }

  const handleProceedToCheckout = () => {
    startTransition(async () => {
      router.push('/shipping-address')
    })
  }

  return (
    <>
      <h1 className="h2-bold py-4">Shopping Cart</h1>
      {!cart || cart.items.length === 0 ? (
        <div>
          Cart is empty.{' '}
          <Link href="/" className="text-yellow-400">
            Go Shopping
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
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
                    <TableCell className="flex-center gap-2">
                      <Button
                        disabled={isPendingState}
                        variant="outline"
                        type="button"
                        onClick={() => handleRemoveItem(item.productId)}
                      >
                        {isPendingState ? (
                          <Loader className="size-4 animate-spin" />
                        ) : (
                          <Minus className="size-4" />
                        )}
                      </Button>
                      <span>{item.qty}</span>
                      <Button
                        disabled={isPendingState}
                        variant="outline"
                        type="button"
                        onClick={() => handleAddItem({ item })}
                      >
                        {isPendingState ? (
                          <Loader className="size-4 animate-spin" />
                        ) : (
                          <Plus className="size-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrency(item.price)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Card>
            <CardContent className="gap-4 p-4">
              <div className="flex justify-between pb-3 text-xl">
                Subtotal ({cart.items.reduce((acc, item) => acc + item.qty, 0)}
                ):
                <span className="font-bold">
                  {formatCurrency(cart.itemsPrice)}
                </span>
              </div>
              <Button
                className="w-full"
                disabled={isPendingState}
                onClick={handleProceedToCheckout}
              >
                {isPendingState ? (
                  <Loader className="size-4 animate-spin" />
                ) : (
                  <ArrowRight className="size-4" />
                )}
                Proceed To Checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
