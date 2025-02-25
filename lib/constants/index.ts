export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Prostore'
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  'A modern e-commerce store built with Next.js'
export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
export const LATEST_PRODUCTS_LIMIT =
  Number(process.env.LATEST_PRODUCTS_LIMIT) || 4

export const SIGN_IN_DEFAULT_VALUES = {
  email: '',
  password: '',
}

export const SIGN_UP_DEFAULT_VALUES = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
}

export const SHIPPING_ADDRESS_DEFAULT_VALUES = {
  fullName: '',
  streetAddress: '',
  city: '',
  postalCode: '',
  country: '',
}

// Array of regex patterns of paths to protect
export const PROTECTED_PATHS = [
  /\/shipping-address/,
  /\/payment-method/,
  /\/place-order/,
  /\/profile/,
  /\/user\/(.*)/,
  /\/order\/(.*)/,
  /\/admin\/(.*)/,
]

export const PAYMENT_METHODS = process.env.PAYMENT_METHODS
  ? process.env.PAYMENT_METHODS.split(', ')
  : ['PayPal', 'Stripe', 'CashOnDelivery']

export const DEFAULT_PAYMENT_METHOD =
  process.env.DEFAULT_PAYMENT_METHOD || 'PayPal'

export const PAGINATION_PAGE_SIZE =
  Number(process.env.PAGINATION_PAGE_SIZE) || 10

export const PRODUCT_DEFAULT_VALUES = {
  name: '',
  slug: '',
  category: '',
  images: [],
  brand: '',
  description: '',
  price: '0',
  stock: 0,
  rating: '0',
  numReviews: '0',
  isFeatured: false,
  banner: null,
}

export const USER_ROLES = process.env.USER_ROLES
  ? process.env.USER_ROLES.split(', ')
  : ['admin', 'user']

export const PRICE_RANGES = [
  { name: '$1 to $50', value: '1-50' },
  { name: '$51 to $100', value: '51-100' },
  { name: '$101 to $200', value: '101-200' },
  { name: '$201 to $500', value: '201-500' },
  { name: '$501 to $1000', value: '501-1000' },
]

export const RATINGS = [4, 3, 2, 1]

export const SORT_ORDERS = ['newest', 'lowest', 'highest', 'rating']
