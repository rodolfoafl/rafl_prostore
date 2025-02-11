import { Metadata } from 'next/types'

import ProductForm from '@/components/admin/product-form'

export const metadata: Metadata = {
  title: 'Create Product',
}

export default function CreateProductPage() {
  return (
    <>
      <h2 className="h2-bold">Create Product</h2>
      <div className="my-8">
        <ProductForm type="create" />
      </div>
    </>
  )
}
