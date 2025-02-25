'use client'

import { Calendar, UserIcon } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import ReviewForm from '@/components/review-form'
import { Rating } from '@/components/shared/product/rating/rating'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { getAllReviewsFromProduct } from '@/lib/actions/review.actions'
import { formatDateTime } from '@/lib/utils'
import { ReviewSchema } from '@/types'

interface ReviewListProps {
  userId: string
  productId: string
  productSlug: string
}

export default function ReviewList({
  userId,
  productId,
  productSlug,
}: ReviewListProps) {
  const [reviewsState, setReviewsState] = useState<ReviewSchema[]>([])

  const reload = async () => {
    const response = await getAllReviewsFromProduct({ productId })
    setReviewsState([...response.data])
  }

  useEffect(() => {
    const fetchReviews = async () => {
      const response = await getAllReviewsFromProduct({
        productId,
      })

      setReviewsState(response.data)
    }

    fetchReviews()
  }, [productId])

  return (
    <div className="space-y-4">
      {reviewsState.length === 0 && <div>No reviews yet</div>}
      {userId ? (
        <ReviewForm
          userId={userId}
          productId={productId}
          onReviewSubmitted={reload}
        />
      ) : (
        <div>
          Please
          <Link
            className="px-1 font-semibold text-yellow-400"
            href={`/sign-in?callbackUrl=/product/${productSlug}`}
          >
            sign in
          </Link>
          to write a review
        </div>
      )}
      <div className="flex flex-col gap-3">
        {reviewsState.map((review) => (
          <Card key={review.id}>
            <CardHeader>
              <div className="flex-between">
                <CardTitle>{review.title}</CardTitle>
              </div>
              <CardDescription>{review.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4 text-sm text-muted-foreground">
                <Rating value={review.rating} />
                <div className="flex items-center">
                  <UserIcon className="mr-1 size-3" />
                  {review.user ? review.user.name : 'User'}
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-1 size-3" />
                  {formatDateTime(review.createdAt).dateTime}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
