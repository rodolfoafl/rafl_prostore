'use server'

import { revalidatePath } from 'next/cache'

import { auth } from '@/auth'
import { prisma } from '@/db/prisma'
import { formatError } from '@/lib/utils'
import { insertReviewSchema } from '@/lib/validators'
import { ReviewSchema } from '@/types'

export async function createUpdateReview(data: ReviewSchema) {
  try {
    const session = await auth()
    if (!session) {
      throw new Error('User not authenticated')
    }

    const review = insertReviewSchema.parse({
      ...data,
      userId: session?.user?.id,
    })

    const product = await prisma.product.findUnique({
      where: {
        id: review.productId,
      },
    })

    if (!product) {
      throw new Error('Product not found')
    }

    const existingReview = await prisma.review.findFirst({
      where: {
        userId: review.userId,
        productId: review.productId,
      },
    })

    await prisma.$transaction(async (tx) => {
      if (existingReview) {
        await tx.review.update({
          where: {
            id: existingReview.id,
          },
          data: {
            title: review.title,
            description: review.description,
            rating: review.rating,
          },
        })
      } else {
        await tx.review.create({
          data: review,
        })
      }

      const avgRating = await tx.review.aggregate({
        _avg: {
          rating: true,
        },
        where: {
          productId: review.productId,
        },
      })

      const totalReviews = await tx.review.count({
        where: {
          productId: review.productId,
        },
      })

      await tx.product.update({
        where: {
          id: review.productId,
        },
        data: {
          rating: avgRating._avg.rating || 0,
          numReviews: totalReviews,
        },
      })
    })

    revalidatePath(`/product/${product.slug}`)

    return {
      success: true,
      message: 'Review submitted successfully',
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    }
  }
}

export async function getAllReviewsFromProduct({
  productId,
}: {
  productId: string
}) {
  const data = await prisma.review.findMany({
    where: {
      productId,
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return { data }
}

export async function getReviewFromUser({ productId }: { productId: string }) {
  const session = await auth()
  if (!session) {
    throw new Error('User not authenticated')
  }

  return await prisma.review.findFirst({
    where: {
      userId: session?.user?.id,
      productId,
    },
  })
}
