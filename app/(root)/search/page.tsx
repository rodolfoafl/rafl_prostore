import ProductCard from '@/components/shared/product/card'
import { getAllProducts } from '@/lib/actions/product.actions'

interface SearchPageProps {
  searchParams: Promise<{
    category?: string
    q?: string
    price?: string
    rating?: string
    sort?: string
    page?: string
  }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const {
    category = 'all',
    q = 'all',
    price = 'all',
    rating = 'all',
    sort = 'newest',
    page = '1',
  } = await searchParams

  const products = await getAllProducts({
    category,
    query: q,
    price,
    rating,
    sort,
    page: Number(page),
  })

  return (
    <div className="grid md:grid-cols-5 md:gap-5">
      <div className="filter-links">{/* FILTER */}</div>
      <div className="space-y-4 md:col-span-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {products.data.length === 0 && <p>No products found</p>}

          {products.data.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  )
}
