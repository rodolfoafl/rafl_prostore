import Image from 'next/image'
import Link from 'next/link'

import CategoryDrawer from '@/components/shared/header/category-drawer'
import Menu from '@/components/shared/header/menu'
import { APP_NAME } from '@/lib/constants'

export default function Header() {
  return (
    <header className="w-full border-b">
      <div className="wrapper flex-between">
        <div className="flex-start">
          <CategoryDrawer />
          <Link href="/" className="flex-start ml-4">
            <Image
              src="/images/logo.svg"
              alt={`${APP_NAME} logo`}
              height="48"
              width="48"
              priority
            />
            <span className="ml-3 hidden text-2xl font-bold lg:block">
              {APP_NAME}
            </span>
          </Link>
        </div>
        <Menu />
      </div>
    </header>
  )
}
