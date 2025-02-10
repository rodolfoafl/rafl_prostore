'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

import { cn } from '@/lib/utils'

type MainNavProps = {
  navOptions: { href: string; title: string }[]
} & React.HTMLAttributes<HTMLElement>

export default function MainNav({
  navOptions,
  className,
  ...props
}: MainNavProps) {
  const pathname = usePathname()

  return (
    <nav
      className={cn('flex items-center space-x-4 lg:space-x-6', className)}
      {...props}
    >
      {navOptions.map((opt) => (
        <Link
          key={opt.href}
          href={opt.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            pathname.includes(opt.href) ? '' : 'text-muted-foreground',
          )}
        >
          {opt.title}
        </Link>
      ))}
    </nav>
  )
}
