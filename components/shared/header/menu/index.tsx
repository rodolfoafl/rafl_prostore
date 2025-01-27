import ModeToggle from '@/components/shared/header/mode-toggle.tsx'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { EllipsisVertical, ShoppingCart, User } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function Menu() {
  return (
    <div className='flex justify-end gap-3'>
      <nav className="hidden md:flex w-full max-w-xs gap-1">
        <ModeToggle />
        <Button asChild variant='ghost'>
          <Link href='/cart'>
            <ShoppingCart /> Cart
          </Link>
        </Button>
        <Button asChild>
          <Link href='/sign-in'>
            <User /> Sign In
          </Link>
        </Button>
      </nav>

      <nav className="md:hidden">
        <Sheet >
          <SheetTrigger className='align-middle'>
            <EllipsisVertical />
          </SheetTrigger>
          <SheetContent className='flex flex-col items-start'>
            <SheetTitle>Menu</SheetTitle>
            <ModeToggle />
            <Button asChild variant='ghost'>
              <Link href='/cart'>
                <ShoppingCart /> Cart
              </Link>
            </Button>
            <Button asChild>
              <Link href='/sign-in'>
                <User /> Sign In
              </Link>
            </Button>
            <SheetDescription />
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  )
}
