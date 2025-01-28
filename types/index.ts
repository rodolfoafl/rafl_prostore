import type { z } from 'zod'

import type { insertProductSchema } from '@/lib/validators'

export type Product = z.infer<typeof insertProductSchema> & {
  id: string
  rating: string
  createdAt: Date
}
