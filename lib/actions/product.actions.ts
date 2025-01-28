'use server'

import { prisma } from '@/db/prisma'
import { LATEST_PRODUCTS_LIMIT } from '@/lib/constants'
import { convertToPlainObject } from '@/lib/utils'

// Get latest products
export async function getLatestProducts() {
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: {
      createdAt: 'desc',
    },
  })

  return convertToPlainObject(data)
}

// Get single product by slug
export async function getProductBySlug(slug: string) {
  const data = await prisma.product.findUnique({
    where: {
      slug,
    },
  })

  return data
}
