import type { z } from 'zod'

import type {
  cartItemSchema,
  insertCartSchema,
  insertProductSchema,
  paymentMethodSchema,
  shippingAddressSchema,
} from '@/lib/validators'

export type Product = z.infer<typeof insertProductSchema> & {
  id: string
  rating: string
  createdAt: Date
}

export type Cart = z.infer<typeof insertCartSchema>
export type CartItem = z.infer<typeof cartItemSchema>
export type ShippingAddress = z.infer<typeof shippingAddressSchema>
export type PaymentMethod = z.infer<typeof paymentMethodSchema>
