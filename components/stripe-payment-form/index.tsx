'use client'

import {
  Elements,
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useTheme } from 'next-themes'
import { FormEvent, useState } from 'react'

import { Button } from '@/components/ui/button'
import { SERVER_URL } from '@/lib/constants'
import { formatCurrency } from '@/lib/utils'

interface StripePaymentProps {
  priceInCents: number
  orderId: string
  clientSecret: string
}

export default function StripePaymentForm({
  priceInCents,
  orderId,
  clientSecret,
}: StripePaymentProps) {
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string,
  )

  const { theme, systemTheme } = useTheme()
  const stripeTheme =
    theme === 'dark'
      ? 'night'
      : theme === 'light'
        ? 'stripe'
        : systemTheme === 'light'
          ? 'stripe'
          : 'night'

  const StripeForm = () => {
    const stripe = useStripe()
    const elements = useElements()

    const [isLoadingState, setIsLoadingState] = useState(false)
    const [errorMessageState, setErrorMessageState] = useState('')
    const [emailState, setEmailState] = useState('')

    const handleSubmit = async (e: FormEvent) => {
      e.preventDefault()

      if (stripe == null || elements == null || emailState == null) return

      setIsLoadingState(true)

      stripe
        .confirmPayment({
          elements,
          confirmParams: {
            return_url: `${SERVER_URL}/order/${orderId}/stripe-payment-success`,
          },
        })
        .then(({ error }) => {
          if (
            error?.type === 'card_error' ||
            error?.type === 'validation_error'
          ) {
            setErrorMessageState(error.message ?? 'An unknown error occured')
          } else if (error) {
            setErrorMessageState('An unknown error occured')
          }
        })
        .finally(() => setIsLoadingState(false))
    }

    return (
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="text-xl">Stripe Checkout</div>
        {errorMessageState && (
          <div className="text-destructive">{errorMessageState}</div>
        )}
        <PaymentElement />
        <div>
          <LinkAuthenticationElement
            onChange={(e) => setEmailState(e.value.email)}
          />
        </div>
        <Button
          className="w-full"
          size="lg"
          disabled={stripe == null || elements == null || isLoadingState}
        >
          {isLoadingState
            ? 'Processing...'
            : `Purchase ${formatCurrency(priceInCents / 100)}`}
        </Button>
      </form>
    )
  }

  return (
    <Elements
      options={{
        clientSecret,
        appearance: {
          theme: stripeTheme,
        },
      }}
      stripe={stripePromise}
    >
      <StripeForm />
    </Elements>
  )
}
