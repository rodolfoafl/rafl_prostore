import ProductList from '@/components/shared/product/list';

import sampleData from '@/db/sample-data';

export default function HomePage() {
  const { products } = sampleData;

  return (
    <>
      <ProductList
        data={products}
        title="Newest Arrivals"
        limit={4}
      />
    </>
  );
}
