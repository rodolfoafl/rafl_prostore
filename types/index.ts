import type { z } from 'zod'

import type {
  cartItemSchema,
  insertCartSchema,
  insertOrderSchema,
  insertProductSchema,
  insertReviewSchema,
  paymentMethodSchema,
  paymentResultSchema,
  shippingAddressSchema,
  updateUserProfileSchema,
  updateUserSchema,
} from '@/lib/validators'

export type Product = z.infer<typeof insertProductSchema> & {
  id: string
  rating: string
  numReviews: number
  createdAt: Date
}

export type Cart = z.infer<typeof insertCartSchema>
export type CartItem = z.infer<typeof cartItemSchema>
export type ShippingAddress = z.infer<typeof shippingAddressSchema>
export type PaymentMethod = z.infer<typeof paymentMethodSchema>
export type OrderItem = CartItem
export type PaymentResult = z.infer<typeof paymentResultSchema>
export type Order = z.infer<typeof insertOrderSchema> & {
  id: string
  createdAt: Date
  isPaid: boolean
  paidAt: Date | null
  isDelivered: boolean
  deliveredAt: Date | null
  orderitems: OrderItem[]
  user: { name: string; email: string }
  paymentResult?: PaymentResult
}
export type UpdateUserProfile = z.infer<typeof updateUserProfileSchema>
export type UpdateUserFormSchema = z.infer<typeof updateUserSchema>
export type ReviewSchema = z.infer<typeof insertReviewSchema> & {
  id: string
  createdAt: Date
  user?: { name: string }
}
