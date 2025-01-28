'use client'

import Image from 'next/image'
import { useState } from 'react'

import { cn } from '@/lib/utils'

interface ProductImagesProps {
  images: string[]
}

export default function ProductImages({ images }: ProductImagesProps) {
  const [currentState, setCurrentState] = useState(0)

  return (
    <div className="space-y-4">
      <Image
        src={images[currentState]}
        alt="Product Image"
        width={1000}
        height={1000}
        className="min-h-[300px] rounded-lg object-cover object-center"
      />

      <div className="flex">
        {images.map((image, index) => (
          <div
            key={image}
            onClick={() => setCurrentState(index)}
            onKeyUp={(e) => {
              if (e.key === 'Enter') setCurrentState(index)
            }}
            className={cn(
              'mr-2 cursor-pointer rounded-lg border hover:border-orange-600',
              currentState === index && 'border-orange-500',
            )}
          >
            <Image
              src={image}
              alt="image"
              width={100}
              height={100}
              className="rounded-lg"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
