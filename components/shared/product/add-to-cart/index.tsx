'use client'

import { Loader, Minus, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

import { Button } from '@/components/ui/button'
import { ToastAction } from '@/components/ui/toast'
import { useToast } from '@/hooks/use-toast'
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.actions'
import { Cart, CartItem } from '@/types'

export default function AddToCart({
  cart,
  item,
}: {
  cart?: Cart
  item: CartItem
}) {
  const router = useRouter()
  const { toast } = useToast()

  const [isPendingState, startTransition] = useTransition()

  const handleAddToCart = async () => {
    startTransition(async () => {
      const response = await addItemToCart(item)

      if (!response.success) {
        toast({ variant: 'destructive', description: response.message })
        return
      }

      toast({
        description: response.message,
        action: (
          <ToastAction
            className="bg-primary text-white hover:bg-gray-800"
            altText="Go To Cart"
            onClick={() => router.push('/cart')}
          >
            Go To Cart
          </ToastAction>
        ),
      })
    })
  }

  const handleRemoveFromCart = async () => {
    startTransition(async () => {
      const response = await removeItemFromCart(item.productId)

      toast({
        variant: response.success ? 'default' : 'destructive',
        description: response.message,
      })
    })
  }

  const existingItem =
    cart && cart.items.find((x) => x.productId === item.productId)

  return existingItem ? (
    <div className="flex-center gap-x-3">
      <Button
        type="button"
        variant="outline"
        onClick={handleRemoveFromCart}
        disabled={isPendingState}
      >
        {isPendingState ? (
          <Loader className="size-4 animate-spin" />
        ) : (
          <Minus className="size-4" />
        )}
      </Button>
      <span className="px-2">{existingItem.qty}</span>
      <Button
        variant="outline"
        type="button"
        onClick={handleAddToCart}
        disabled={isPendingState}
      >
        {isPendingState ? (
          <Loader className="size-4 animate-spin" />
        ) : (
          <Plus className="size-4" />
        )}
      </Button>
    </div>
  ) : (
    <Button
      className="w-full"
      type="button"
      onClick={handleAddToCart}
      disabled={isPendingState}
    >
      {isPendingState ? <Loader className="size-4 animate-spin" /> : <Plus />}
      Add To Cart
    </Button>
  )
}
