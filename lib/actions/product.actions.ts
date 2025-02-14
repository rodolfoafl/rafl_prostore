'use server'

import { revalidatePath } from 'next/cache'

import { prisma } from '@/db/prisma'
import { LATEST_PRODUCTS_LIMIT, PAGINATION_PAGE_SIZE } from '@/lib/constants'
import { convertToPlainObject, formatError } from '@/lib/utils'
import { insertProductSchema, updateProductSchema } from '@/lib/validators'
import { Product } from '@/types'

export async function getLatestProducts() {
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: {
      createdAt: 'desc',
    },
  })

  return convertToPlainObject(data)
}

export async function getProductBySlug(slug: string) {
  const data = await prisma.product.findUnique({
    where: {
      slug,
    },
  })

  return data
}

export async function getAllProducts({
  query,
  limit = PAGINATION_PAGE_SIZE,
  page,
  category,
}: {
  query: string
  limit?: number
  page: number
  category?: string
}) {
  console.log('query', query)
  console.log('category', category)

  const data = await prisma.product.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    skip: (page - 1) * limit,
    take: limit,
  })

  const dataCount = await prisma.product.count()

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  }
}

export async function deleteProduct(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id,
      },
    })

    if (!product) throw new Error('Product not found')

    await prisma.product.delete({
      where: {
        id,
      },
    })

    revalidatePath('/admin/products')

    return {
      success: true,
      message: 'Product deleted successfully',
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    }
  }
}

export async function createProduct(data: Product) {
  try {
    const product = insertProductSchema.parse(data)
    await prisma.product.create({ data: product })

    revalidatePath('/admin/products')

    return {
      success: true,
      message: 'Product created successfully',
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    }
  }
}

export async function updateProduct(data: Product) {
  try {
    const product = updateProductSchema.parse(data)
    const existingProduct = await prisma.product.findUnique({
      where: {
        id: product.id,
      },
    })

    if (!existingProduct) throw new Error('Product not found')

    await prisma.product.update({
      where: {
        id: product.id,
      },
      data: product,
    })

    revalidatePath('/admin/products')

    return {
      success: true,
      message: 'Product updated successfully',
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    }
  }
}

export async function getProductById(id: string) {
  const data = await prisma.product.findUnique({
    where: {
      id,
    },
  })

  return convertToPlainObject(data)
}
