import ProductList from '@/components/shared/product/list';
import { getLatestProducts } from '@/lib/actions/product.actions';

export default async function HomePage() {
  const latestProducts = await getLatestProducts()

  return (
    <>
      <ProductList
        data={latestProducts}
        title="Newest Arrivals"
        limit={4}
      />
    </>
  );
}
