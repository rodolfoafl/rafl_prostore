import { notFound } from 'next/navigation'
import { Metadata } from 'next/types'

import ProductForm from '@/components/admin/product-form'
import { getProductById } from '@/lib/actions/product.actions'

export const metadata: Metadata = {
  title: 'Update Product',
}

interface UpdateProductPageProps {
  params: Promise<{ id: string }>
}

export default async function UpdateProductPage({
  params,
}: UpdateProductPageProps) {
  const { id } = await params

  const product = await getProductById(id)
  if (!product) return notFound()

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <h1 className="h2-bold">Update Product</h1>
      <ProductForm type="update" product={product} productId={id} />
    </div>
  )
}
