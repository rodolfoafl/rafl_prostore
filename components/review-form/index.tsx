import { zodResolver } from '@hookform/resolvers/zod'
import { StarIcon } from 'lucide-react'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import {
  createUpdateReview,
  getReviewFromUser,
} from '@/lib/actions/review.actions'
import { REVIEW_FORM_DEFAULT_VALUES } from '@/lib/constants'
import { insertReviewSchema } from '@/lib/validators'
import { ReviewSchema } from '@/types'

interface ReviewFormProps {
  userId: string
  productId: string
  onReviewSubmitted?: () => void
}

export default function ReviewForm({
  userId,
  productId,
  onReviewSubmitted,
}: ReviewFormProps) {
  const [openState, setOpenState] = useState(false)
  const { toast } = useToast()

  const form = useForm<ReviewSchema>({
    resolver: zodResolver(insertReviewSchema),
    defaultValues: REVIEW_FORM_DEFAULT_VALUES,
  })

  const handleOpenForm = async () => {
    form.setValue('userId', userId)
    form.setValue('productId', productId)

    const review = await getReviewFromUser({
      productId,
    })

    if (review) {
      form.setValue('title', review.title)
      form.setValue('description', review.description)
      form.setValue('rating', review.rating)
    }

    setOpenState(true)
  }

  const onSubmit: SubmitHandler<ReviewSchema> = async (values) => {
    const response = await createUpdateReview({
      ...values,
      productId,
    })

    if (!response.success) {
      return toast({
        variant: 'destructive',
        description: response.message,
      })
    }

    setOpenState(false)

    onReviewSubmitted?.()

    toast({
      description: response.message,
    })
  }

  return (
    <Dialog open={openState} onOpenChange={setOpenState}>
      <Button onClick={handleOpenForm}>Write a Review</Button>
      <DialogContent className="sm:max-w-[426px]">
        <Form {...form}>
          <form action="post" onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Write a Review</DialogTitle>
              <DialogDescription>
                Share your thoughts with other customers
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter title" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter description" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={!field.value ? undefined : field.value.toString()}
                      defaultValue={
                        !field.value ? undefined : field.value.toString()
                      }
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a rating" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.from({ length: 5 }).map((_, index) => (
                          <SelectItem
                            key={index}
                            value={(index + 1).toString()}
                          >
                            <span className="flex flex-row items-center gap-x-2">
                              {index + 1}
                              <div>
                                {Array.from({ length: index + 1 }).map(
                                  (_, idx) => (
                                    <StarIcon
                                      key={idx}
                                      className="inline size-4"
                                    />
                                  ),
                                )}
                              </div>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
