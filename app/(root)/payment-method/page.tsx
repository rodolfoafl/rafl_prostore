import { Metadata } from 'next'

import { auth } from '@/auth'
import PaymentMethodForm from '@/components/payment-method-form'
import CheckoutSteps from '@/components/shared/checkout-steps'
import { getUserById } from '@/lib/actions/user.actions'

export const metadata: Metadata = {
  title: 'Select Payment Method',
}

export default async function PaymentMethodPage() {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) throw new Error('User not found')

  const user = await getUserById(userId)

  return (
    <div className="min-h-screen">
      <CheckoutSteps current={2} />
      <PaymentMethodForm preferredPaymentMethod={user.paymentMethod} />
    </div>
  )
}
