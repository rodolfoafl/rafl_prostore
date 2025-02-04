'use client'

import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { ToastAction } from '@/components/ui/toast'
import { useToast } from '@/hooks/use-toast'
import { addItemToCart } from '@/lib/actions/cart.actions'
import { CartItem } from '@/types'

export default function AddToCart({ item }: { item: CartItem }) {
  const router = useRouter()
  const { toast } = useToast()

  const handleAddToCart = async () => {
    const response = await addItemToCart(item)

    if (!response.success) {
      return toast({ variant: 'destructive', description: response.message })
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
  }

  return (
    <Button className="w-full" type="button" onClick={handleAddToCart}>
      <Plus />
      Add To Cart
    </Button>
  )
}
