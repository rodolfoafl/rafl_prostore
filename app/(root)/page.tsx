import ProductCarousel from '@/components/shared/product/carousel'
import ProductList from '@/components/shared/product/list'
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
      <ProductList data={latestProducts} title="Newest Arrivals" limit={4} />
    </>
  )
}
