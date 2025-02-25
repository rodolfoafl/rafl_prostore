import Image from 'next/image'
import Link from 'next/link'

import ProductPrice from '@/components/shared/product/price'
import { Rating } from '@/components/shared/product/rating/rating'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import type { Product } from '@/types'

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="w-full max-w-sm transition-transform duration-700 hover:scale-95">
      <CardHeader className="items-center p-0">
        <Link href={`/product/${product.slug}`}>
          <Image
            src={product.images[0]}
            alt={product.name}
            width={300}
            height={300}
            priority
            className="rounded-t-lg"
          />
        </Link>
      </CardHeader>

      <CardContent className="grid gap-4 p-4">
        <div className="text-sm">{product.brand}</div>
        <Link href={`/product/${product.slug}`}>
          <h2 className="text-sm font-medium">{product.name}</h2>
        </Link>
        <div className="flex justify-between gap-4">
          {product.numReviews ? (
            <Rating value={Number(product.rating)} />
          ) : (
            <span className="text-sm">Not reviewed yet</span>
          )}

          {product.stock > 0 ? (
            <ProductPrice
              value={Number(product.price)}
              className="font-semibold"
            />
          ) : (
            <p className="font-semibold text-destructive">Out of stock</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
