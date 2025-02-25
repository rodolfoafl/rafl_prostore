import Link from 'next/link'

import ProductCard from '@/components/shared/product/card'
import { Button } from '@/components/ui/button'
import { getAllCategories, getAllProducts } from '@/lib/actions/product.actions'
import { PRICE_RANGES, RATINGS, SORT_ORDERS } from '@/lib/constants'
import { cn } from '@/lib/utils'

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
    q = 'all',
    category = 'all',
    price = 'all',
    rating = 'all',
    sort = 'newest',
    page = '1',
  } = await searchParams

  const getFilterUrl = ({
    c,
    p,
    s,
    r,
    pg,
  }: {
    c?: string
    p?: string
    s?: string
    r?: string
    pg?: string
  }) => {
    const params = {
      q,
      category,
      price,
      rating,
      sort,
      page,
    }

    if (c) params.category = c
    if (p) params.price = p
    if (s) params.sort = s
    if (r) params.rating = r
    if (pg) params.page = pg

    return `/search?${new URLSearchParams(params).toString()}`
  }

  const products = await getAllProducts({
    query: q,
    category,
    price,
    rating,
    sort,
    page: Number(page),
  })

  const categories = await getAllCategories()

  return (
    <div className="grid md:grid-cols-5 md:gap-5">
      <div className="filter-links">
        {/* TODO: Refactor to separate components (or a reusable one) */}
        <div className="mb-2 mt-3 text-xl">Departmant</div>
        <div>
          <ul className="space-y-1">
            <li>
              <Link
                className={`${(category === 'all' || category === '') && 'font-bold'}`}
                href={getFilterUrl({ c: 'all' })}
              >
                All
              </Link>
            </li>
            {categories.map((item) => (
              <li key={item.category}>
                <Link
                  className={`${item.category === category && 'font-bold'}`}
                  href={getFilterUrl({ c: item.category })}
                >
                  {item.category}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="mb-2 mt-6 text-xl">Price</div>
        <div>
          <ul className="space-y-1">
            <li>
              <Link
                className={`${price === 'all' && 'font-bold'}`}
                href={getFilterUrl({ p: 'all' })}
              >
                All
              </Link>
            </li>
            {PRICE_RANGES.map((item) => (
              <li key={item.value}>
                <Link
                  className={`${item.value === price && 'font-bold'}`}
                  href={getFilterUrl({ p: item.value })}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="mb-2 mt-6 text-xl">Customer Ratings</div>
        <div>
          <ul className="space-y-1">
            <li>
              <Link
                className={`${rating === 'all' && 'font-bold'}`}
                href={getFilterUrl({ r: 'all' })}
              >
                All
              </Link>
            </li>
            {RATINGS.map((item) => (
              <li key={item}>
                <Link
                  className={`${item.toString() === rating && 'font-bold'}`}
                  href={getFilterUrl({ r: `${item}` })}
                >
                  {`${item} star${item > 1 ? 's' : ''} & up`}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="space-y-4 md:col-span-4">
        <div className="flex-between my-4 flex-col md:flex-row">
          <div className="flex items-center gap-x-2">
            {q !== 'all' && q !== '' && `Query: ${q}`}{' '}
            {category !== 'all' && category !== '' && `Category: ${category}`}{' '}
            {price !== 'all' && `Price: ${price}`}{' '}
            {rating !== 'all' &&
              `Rating: ${rating} star${Number(rating) > 1 ? 's' : ''} & up`}
            &nbsp;
            {(q !== 'all' && q !== '') ||
            (category !== 'all' && category !== '') ||
            price !== 'all' ||
            rating !== 'all' ? (
              <Button variant="outline" size="sm" asChild>
                <Link href="/search">Clear</Link>
              </Button>
            ) : null}
          </div>
          <div>
            Sort by{' '}
            {SORT_ORDERS.map((item) => (
              <Link
                key={item}
                href={getFilterUrl({ s: item })}
                className={cn('mx-2', sort === item && 'font-bold')}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
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

export async function generateMetadata({ searchParams }: SearchPageProps) {
  const {
    q = 'all',
    category = 'all',
    price = 'all',
    rating = 'all',
  } = await searchParams

  const isQuerySet = q && q !== 'all' && q.trim() !== ''
  const isCategorySet = category && category !== 'all' && category.trim() !== ''
  const isPriceSet = price && price !== 'all' && price.trim() !== ''
  const isRatingSet = rating && rating !== 'all' && rating.trim() !== ''

  if (isQuerySet || isCategorySet || isPriceSet || isRatingSet) {
    return {
      title: `Search ${isQuerySet ? q : ''} 
        ${isCategorySet ? `: Category ${category}` : ''} 
        ${isPriceSet ? `: Price ${price}` : ''} 
        ${isRatingSet ? `: Rating ${rating}` : ''}
      `,
    }
  } else {
    return {
      title: 'Search Products',
    }
  }
}
