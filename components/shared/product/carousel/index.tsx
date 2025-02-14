'use client'

import Autoplay from 'embla-carousel-autoplay'
import Image from 'next/image'
import Link from 'next/link'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Product } from '@/types'

export default function ProductCarousel({ data }: { data: Product[] }) {
  return (
    <Carousel
      className="mb-12 w-full"
      opts={{ loop: true }}
      plugins={[
        Autoplay({
          delay: 5000,
          stopOnInteraction: true,
          stopOnMouseEnter: true,
        }),
      ]}
    >
      <CarouselContent>
        {data.map((product: Product) => (
          <CarouselItem key={product.id}>
            <Link href={`/product/${product.slug}`}>
              <div className="relative mx-auto">
                <Image
                  src={product.banner || ''}
                  alt={product.name}
                  height={0}
                  width={0}
                  sizes="100vw"
                  className="h-auto w-full"
                />
                <div className="absolute inset-0 flex items-end justify-center">
                  <h2 className="bg-gray-900 bg-opacity-50 px-2 text-2xl font-bold text-white">
                    {product.name}
                  </h2>
                </div>
              </div>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      {data.length > 1 && (
        <>
          <CarouselPrevious />
          <CarouselNext />
        </>
      )}
    </Carousel>
  )
}
