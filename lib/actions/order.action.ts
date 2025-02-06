'use server'

import { isRedirectError } from 'next/dist/client/components/redirect-error'

import { auth } from '@/auth'
import { prisma } from '@/db/prisma'
import { getUserCart } from '@/lib/actions/cart.actions'
import { getUserById } from '@/lib/actions/user.actions'
import { formatError } from '@/lib/utils'
import { insertOrderSchema } from '@/lib/validators'
import { CartItem } from '@/types'

export async function createOrder() {
  try {
    const session = await auth()
    if (!session) {
      throw new Error('User is not authenticated')
    }

    const cart = await getUserCart()
    if (!cart || cart.items.length === 0) {
      return {
        success: false,
        message: 'Your cart is empty',
        redirectTo: '/cart',
      }
    }

    const userId = session?.user?.id
    if (!userId) {
      throw new Error('User not found')
    }

    const user = await getUserById(userId)
    if (!user.address) {
      return {
        success: false,
        message: 'No shipping address found',
        redirectTo: '/shipping-address',
      }
    }

    if (!user.paymentMethod) {
      return {
        success: false,
        message: 'No payment method found',
        redirectTo: '/payment-method',
      }
    }

    const order = insertOrderSchema.parse({
      userId: user.id,
      shippingAddress: user.address,
      paymentMethod: user.paymentMethod,
      itemsPrice: cart.itemsPrice,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.taxPrice,
      totalPrice: cart.totalPrice,
    })

    const insertedOrderId = await prisma.$transaction(async (tx) => {
      const insertedOrder = await tx.order.create({ data: order })

      for (const item of cart.items as CartItem[]) {
        await tx.orderItem.create({
          data: {
            ...item,
            orderId: insertedOrder.id,
          },
        })
      }

      await tx.cart.update({
        where: { id: cart.id },
        data: {
          items: [],
          itemsPrice: 0,
          shippingPrice: 0,
          taxPrice: 0,
          totalPrice: 0,
        },
      })

      return insertedOrder.id
    })

    if (!insertedOrderId) throw new Error('Failed to create order')

    return {
      success: true,
      message: 'Order created successfully',
      redirectTo: `/order/${insertedOrderId}`,
    }
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }
    return {
      success: false,
      message: formatError(error),
    }
  }
}
