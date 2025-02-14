'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Input } from '@/components/ui/input'

export default function Search() {
  const pathname = usePathname()
  const formActionUrl = pathname.includes('/admin/orders')
    ? '/admin/orders'
    : pathname.includes('/admin/users')
      ? '/admin/users'
      : '/admin/products'

  const searchParams = useSearchParams()

  const [queryState, setQueryState] = useState(searchParams.get('query') || '')

  useEffect(() => {
    setQueryState(searchParams.get('query') || '')
  }, [searchParams])

  return (
    <form action={formActionUrl} method="GET">
      <Input
        type="search"
        placeholder="Search..."
        name="query"
        value={queryState}
        onChange={(e) => setQueryState(e.target.value)}
        className="md:w-[100px] lg:w-[300px]"
      />
      <button className="sr-only" type="submit">
        Search
      </button>
    </form>
  )
}
