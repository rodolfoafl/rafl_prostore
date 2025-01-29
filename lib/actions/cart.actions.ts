'use server'

import { cookies } from 'next/headers'

import { auth } from '@/auth'
import { prisma } from '@/db/prisma'
import { convertToPlainObject, formatError } from '@/lib/utils'
import { cartItemSchema } from '@/lib/validators'
import { CartItem } from '@/types'

export async function addItemToCart(data: CartItem) {
  try {
    // Check for the cart cookie
    const sessionCartId = (await cookies()).get('sessionCartId')?.value
    if (!sessionCartId) {
      throw new Error('Cart session not found')
    }

    // Get session and user ID
    const session = await auth()
    const userId = session?.user?.id ? (session.user.id as string) : undefined

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const cart = await getUserCart()

    // Parse and validate item
    const item = cartItemSchema.parse(data)

    // Find product in database
    const product = await prisma.product.findFirst({
      where: {
        id: item.productId,
      },
    })

    // TESTING
    console.log({
      'Session Cartd ID:': sessionCartId,
      'User ID:': userId,
      'Item requested': item,
      'Product found': product,
    })

    return {
      success: true,
      message: 'Item added to cart',
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    }
  }
}

export async function getUserCart() {
  const sessionCartId = (await cookies()).get('sessionCartId')?.value
  if (!sessionCartId) {
    throw new Error('Cart session not found')
  }

  const session = await auth()
  const userId = session?.user?.id ? (session.user.id as string) : undefined

  // Get user cart from database
  const cart = await prisma.cart.findFirst({
    where: userId ? { userId } : { sessionCartId },
  })

  if (!cart) return undefined

  // Convert decimals and return
  return convertToPlainObject({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  })
}
