'use server'

import { CartItem } from '@/types'

export async function addItemToCart(data: CartItem) {
  console.log('Adding item to cart', data)

  return {
    success: true,
    message: 'Item added to cart',
  }
}
