import Link from 'next/link'

import ProductCarousel from '@/components/shared/product/carousel'
import ProductList from '@/components/shared/product/list'
import { Button } from '@/components/ui/button'
import {
  getFeaturedProducts,
  getLatestProducts,
} from '@/lib/actions/product.actions'

export default async function HomePage() {
  const latestProducts = await getLatestProducts()
  const featuredProducts = await getFeaturedProducts()

  return (
    <>
      {featuredProducts.length > 0 && (
        <ProductCarousel data={featuredProducts} />
      )}

      {latestProducts.length > 0 && (
        <>
          <ProductList
            data={latestProducts}
            title="Newest Arrivals"
            limit={4}
          />

          <div className="my-8 flex items-center justify-center">
            <Button asChild>
              <Link href="/search">View All Products</Link>
            </Button>
          </div>
        </>
      )}
    </>
  )
}
