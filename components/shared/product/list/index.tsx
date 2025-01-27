import ProductCard from "@/components/shared/product/card"

type ProductListProps = {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  data: any
  title: string
  limit?: number
}

export default function ProductList({ data, title, limit = 4 }: ProductListProps) {
  const limitedData = limit ? data.slice(0, limit) : data

  return (
    <div className="my-10">
      <h2 className="h2-bold mb-4">
        {title}
      </h2>

      {data.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
          {limitedData.map((product: any) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <div>
          <p>No products found</p>
        </div>
      )}
    </div>
  )
}
