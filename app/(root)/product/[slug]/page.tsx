import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import AddToCart from '@/components/shared/product/add-to-cart'
import ProductImages from '@/components/shared/product/images'
import ProductPrice from '@/components/shared/product/price'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { getUserCart } from '@/lib/actions/cart.actions'
import { getProductBySlug } from '@/lib/actions/product.actions'

interface ProductDetailsPageProps {
  params: Promise<{ slug: string }>
}

export default async function ProductDetailsPage({
  params,
}: ProductDetailsPageProps) {
  const { slug } = await params

  const product = await getProductBySlug(slug)
  if (!product) {
    notFound()
  }

  const cart = await getUserCart()

  return (
    <>
      <section>
        <div className="grid grid-cols-1 md:grid-cols-5">
          {/* Images column */}
          <div className="col-span-2">
            <ProductImages images={product.images} />
          </div>
          <div className="col-span-2 p-5">
            {/* Details column */}
            <div className="flex flex-col gap-6">
              <p>
                {product.brand} {product.category}
              </p>
              <h1 className="h3-bold">{product.name}</h1>
              <p>
                {product.rating} of {product.numReviews} Reviews
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <ProductPrice
                  value={Number(product.price)}
                  className="w-24 rounded-full bg-green-100 px-5 py-2 text-green-700"
                />
              </div>
            </div>
            <div className="mt-10">
              <p className="font-semibold">Description</p>
              <p>{product.description}</p>
            </div>
          </div>
          {/* Action column */}
          <div>
            <Card>
              <CardContent className="p-4">
                <div className="mb-2 flex justify-between">
                  <div>Price</div>
                  <div>
                    <ProductPrice value={Number(product.price)} />
                  </div>
                </div>
                <div className="mb-2 flex justify-between">
                  <div>Status</div>
                  {product.stock > 0 ? (
                    <Badge variant="outline">In Stock</Badge>
                  ) : (
                    <Badge variant="destructive">Out of Stock</Badge>
                  )}
                </div>
                {product.stock > 0 ? (
                  <div className="mt-5 flex justify-center">
                    <AddToCart
                      cart={cart}
                      item={{
                        productId: product.id,
                        name: product.name,
                        slug: product.slug,
                        price: product.price,
                        qty: 1,
                        image: product.images![0],
                      }}
                    />
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  )
}

export async function generateMetadata({
  params,
}: ProductDetailsPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  return {
    title: product?.name,
    description: product?.description,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SERVER_URL}/product/${product?.slug}`,
    },
    openGraph: {
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/product/${product?.slug}`,
      images: [
        {
          url: product?.images[0] || '',
          width: 1200,
          height: 630,
        },
      ],
    },
  }
}
