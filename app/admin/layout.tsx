import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { auth } from '@/auth'
import Search from '@/components/admin/search'
import MainNav from '@/components/main-nav'
import Menu from '@/components/shared/header/menu'
import { APP_NAME } from '@/lib/constants'

const NAV_OPTIONS = [
  {
    title: 'Overview',
    href: '/admin/overview',
  },
  {
    title: 'Products',
    href: '/admin/products',
  },
  {
    title: 'Orders',
    href: '/admin/orders',
  },
  {
    title: 'Users',
    href: '/admin/users',
  },
]

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()
  if (session?.user.role !== 'admin') {
    // throw new Error('User is not authorized')
    redirect('/')
  }

  return (
    <>
      <div className="flex flex-col">
        <div className="container mx-auto border-b">
          <div className="flex h-16 items-center px-4">
            <Link href="/" className="w-22">
              <Image
                src="/images/logo.svg"
                alt={APP_NAME}
                width={48}
                height={48}
              />
            </Link>

            <MainNav className="mx-6" navOptions={NAV_OPTIONS} />
            <div className="ml-auto flex items-center space-x-4">
              <Search />
              <Menu />
            </div>
          </div>
        </div>
        <div className="container mx-auto flex-1 space-y-4 p-8 pt-6">
          {children}
        </div>
      </div>
    </>
  )
}
