import { MenuIcon } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { getAllCategories } from '@/lib/actions/product.actions'

export default async function CategoryDrawer() {
  const categories = await getAllCategories()

  return (
    <Drawer direction="left">
      <DrawerTrigger asChild>
        <Button variant="outline">
          <MenuIcon />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-full max-w-sm">
        <DrawerHeader>
          <DrawerTitle>Select a category</DrawerTitle>
        </DrawerHeader>
        <div className="mt-2 space-y-2">
          {categories.map((item) => (
            <Button
              key={item.category}
              variant="ghost"
              className="w-full justify-start"
              asChild
            >
              <DrawerClose asChild>
                <Link href={`/search?category=${item.category}`}>
                  {item.category} ({item._count})
                </Link>
              </DrawerClose>
            </Button>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
