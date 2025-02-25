'use server'

import { Prisma } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { isRedirectError } from 'next/dist/client/components/redirect-error'

import { auth } from '@/auth'
import { prisma } from '@/db/prisma'
import { getUserCart } from '@/lib/actions/cart.actions'
import { getUserById } from '@/lib/actions/user.actions'
import { PAGINATION_PAGE_SIZE } from '@/lib/constants'
import { paypal } from '@/lib/paypal'
import { convertToPlainObject, formatError } from '@/lib/utils'
import { insertOrderSchema } from '@/lib/validators'
import { CartItem, PaymentResult } from '@/types'

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

export async function getOrderById(orderId: string) {
  const data = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
    include: {
      orderitems: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  })

  return convertToPlainObject(data)
}

export async function createPayPalOrder(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
    })

    if (!order) throw new Error('Order not found')

    const paypalOrder = await paypal.createOrder(Number(order.totalPrice))

    await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        paymentResult: {
          id: paypalOrder.id,
          email_address: '',
          status: '',
          pricePaid: 0,
        },
      },
    })

    return {
      success: true,
      message: 'Item order created successfully',
      data: paypalOrder.id,
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    }
  }
}

export async function approvePayPalOrder(
  orderId: string,
  data: { orderId: string },
) {
  try {
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
    })

    if (!order) throw new Error('Order not found')

    const captureData = await paypal.capturePayment(data.orderId)
    if (
      !captureData ||
      captureData.id !== (order.paymentResult as PaymentResult)?.id ||
      captureData.status !== 'COMPLETED'
    ) {
      throw new Error('Error in PayPal payment')
    }

    // TODO: Update order to paid
    await updateOrderToPaid({
      orderId,
      paymentResult: {
        id: captureData.id,
        status: captureData.status,
        email_address: captureData.payer.email_address,
        pricePaid:
          captureData.purchase_units[0]?.payments?.captures[0]?.amount?.value,
      },
    })

    revalidatePath(`/order/${orderId}`)

    return {
      success: true,
      message: 'Your order has been paid successfully',
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    }
  }
}

export async function updateOrderToPaid({
  orderId,
  paymentResult,
}: {
  orderId: string
  paymentResult?: PaymentResult
}) {
  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
    include: {
      orderitems: true,
    },
  })

  if (!order) throw new Error('Order not found')

  if (order.isPaid) throw new Error('Order is already paid')

  await prisma.$transaction(async (tx) => {
    for (const item of order.orderitems) {
      await tx.product.update({
        where: {
          id: item.productId,
        },
        data: {
          stock: { increment: -item.qty },
        },
      })
    }

    await tx.order.update({
      where: {
        id: orderId,
      },
      data: {
        isPaid: true,
        paidAt: new Date(),
        paymentResult,
      },
    })
  })

  const updatedOrder = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
    include: {
      orderitems: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  })

  if (!updatedOrder) throw new Error('Order not found')
}

export async function getUserOrders({
  limit = PAGINATION_PAGE_SIZE,
  page,
}: {
  limit?: number
  page: number
}) {
  const session = await auth()
  if (!session) throw new Error('User is not authenticated')

  const data = await prisma.order.findMany({
    where: {
      userId: session?.user?.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
    skip: (page - 1) * limit,
  })

  const dataCount = await prisma.order.count({
    where: {
      userId: session?.user?.id,
    },
  })

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  }
}

type SalesDataType = {
  month: string
  totalSales: number
}[]

export async function getOrdersSummary() {
  const ordersCount = await prisma.order.count()
  const productsCount = await prisma.product.count()
  const usersCount = await prisma.user.count()

  const totalSales = await prisma.order.aggregate({
    _sum: {
      totalPrice: true,
    },
  })

  const salesDataRaw = await prisma.$queryRaw<
    Array<{ month: string; totalSales: Prisma.Decimal }>
  >`SELECT to_char("createdAt", 'MM/YY') as "month", sum("totalPrice") as "totalSales" FROM "Order" GROUP BY to_char("createdAt", 'MM/YY')`

  const salesData: SalesDataType = salesDataRaw.map((entry) => ({
    month: entry.month,
    totalSales: Number(entry.totalSales),
  }))

  const latestSales = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: { name: true },
      },
    },
    take: 6,
  })

  return {
    ordersCount,
    productsCount,
    usersCount,
    totalSales,
    latestSales,
    salesData,
  }
}

export async function getAllOrders({
  limit = PAGINATION_PAGE_SIZE,
  page,
  query,
}: {
  limit?: number
  page: number
  query: string
}) {
  const queryFilter: Prisma.OrderWhereInput =
    query && query !== 'all'
      ? {
          user: {
            name: {
              contains: query,
              mode: 'insensitive',
            } as Prisma.StringFilter,
          },
        }
      : {}

  const data = await prisma.order.findMany({
    where: {
      ...queryFilter,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
    skip: (page - 1) * limit,
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  })

  const dataCount = await prisma.order.count({
    where: {
      ...queryFilter,
    },
  })

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  }
}

export async function deleteOrder(id: string) {
  try {
    await prisma.order.delete({
      where: {
        id,
      },
    })

    revalidatePath('/admin/orders')

    return {
      success: true,
      message: 'Order deleted successfully',
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    }
  }
}

export async function updateOrderToPaidCOD(orderId: string) {
  try {
    await updateOrderToPaid({ orderId })

    revalidatePath(`/order/${orderId}`)

    return {
      success: true,
      message: 'Order marked as paid successfully',
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    }
  }
}

export async function deliverOrder(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
    })

    if (!order) throw new Error('Order not found')
    if (!order.isPaid) throw new Error('Order is not paid yet')

    await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        isDelivered: true,
        deliveredAt: new Date(),
      },
    })

    revalidatePath(`/order/${orderId}`)

    return {
      success: true,
      message: 'Order marked as delivered successfully',
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    }
  }
}
