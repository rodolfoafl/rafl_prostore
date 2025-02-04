'use server'

import { Prisma } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

import { auth } from '@/auth'
import { prisma } from '@/db/prisma'
import { convertToPlainObject, formatError, round2 } from '@/lib/utils'
import { cartItemSchema, insertCartSchema } from '@/lib/validators'
import { CartItem } from '@/types'

const MIN_ITEMS_PRICE = 100
const SHIPPING_PRICE = 10
const TAX_PRICE_MULTIPLIER = 0.15

// Calculate cart prices
function calculatePrice(items: CartItem[]) {
  const itemsPrice = round2(
    items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0),
  )

  const shippingPrice = round2(
    itemsPrice > MIN_ITEMS_PRICE ? 0 : SHIPPING_PRICE,
  )

  const taxPrice = round2(TAX_PRICE_MULTIPLIER * itemsPrice)

  const totalPrice = round2(itemsPrice + taxPrice + shippingPrice)

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  }
}

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

    if (!product) throw new Error('Product not found')

    if (!cart) {
      const newCart = insertCartSchema.parse({
        userId,
        items: [item],
        sessionCartId,
        ...calculatePrice([item]),
      })

      // Add to database
      await prisma.cart.create({
        data: newCart,
      })

      // Revalidate product page
      revalidatePath(`/product/${product.slug}`)

      return {
        success: true,
        message: `${product.name} added to cart`,
      }
    } else {
      // Check if item is already in cart
      const existingItem = (cart.items as CartItem[]).find(
        (x) => x.productId === item.productId,
      )

      if (existingItem) {
        // Check stock
        if (product.stock < existingItem.qty + 1) {
          throw new Error('Not enough stock')
        }

        // Increase the item quantity
        ;(cart.items as CartItem[]).find(
          (x) => x.productId === item.productId,
        )!.qty = existingItem.qty + 1
      } else {
        if (product.stock < 1) throw new Error('Not enough stock')

        cart.items.push(item)
      }

      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: cart.items as Prisma.CartUpdateitemsInput[],
          ...calculatePrice(cart.items as CartItem[]),
        },
      })

      revalidatePath(`/product/${product.slug}`)

      return {
        success: true,
        message: `${product.name} ${existingItem ? 'updated in' : 'added to'} cart`,
      }
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
