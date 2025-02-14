import Link from 'next/link'
import { Metadata } from 'next/types'

import DeleteDialog from '@/components/shared/delete-dialog'
import Pagination from '@/components/shared/pagination'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { deleteProduct, getAllProducts } from '@/lib/actions/product.actions'
import { formatCurrency, shortenId, shortenProductName } from '@/lib/utils'

interface AdminProductsPageProps {
  searchParams: Promise<{ page: string; query: string; category: string }>
}

export const metadata: Metadata = {
  title: 'Admin Products',
}

export default async function AdminProductsPage({
  searchParams,
}: AdminProductsPageProps) {
  const { page, query, category } = await searchParams

  const currentPage = Number(page) || 1
  const searchText = query || ''
  const currentCategory = category || ''

  const products = await getAllProducts({
    query: searchText,
    page: currentPage,
    category: currentCategory,
    // limit: 3,
  })

  return (
    <div className="space-y-2">
      <div className="flex-between">
        <h1 className="h2-bold">Products</h1>
        <Button asChild variant="default">
          <Link href="/admin/products/create">Create Product</Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>NAME</TableHead>
            <TableHead className="text-right">PRICE</TableHead>
            <TableHead>CATEGORY</TableHead>
            <TableHead className="text-center">STOCK</TableHead>
            <TableHead className="text-center">RATING</TableHead>
            <TableHead className="w-[100px]">ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.data.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{shortenId(product.id)}</TableCell>
              <TableCell>{shortenProductName(product.name, 40)}</TableCell>
              <TableCell className="text-right">
                {formatCurrency(product.price)}
              </TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell className="text-center">{product.stock}</TableCell>
              <TableCell className="text-center">{product.rating}</TableCell>
              <TableCell className="flex gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/products/${product.id}`}>Edit</Link>
                </Button>
                <DeleteDialog id={product.id} action={deleteProduct} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {products.totalPages > 1 && (
        <Pagination page={currentPage} totalPages={products.totalPages} />
      )}
    </div>
  )
}
