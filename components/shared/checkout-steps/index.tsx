import { Fragment } from 'react'

import { cn } from '@/lib/utils'

export enum StepsEnum {
  SIGN_IN = 'Sign In',
  SHIPPING_ADDRESS = 'Shipping Address',
  PAYMENT_METHOD = 'Payment Method',
  PLACE_ORDER = 'Place Order',
}

const STEPS = Object.values(StepsEnum)

export default function CheckoutSteps({ current = 0 }) {
  return (
    <div className="flex-between mb-10 flex-col space-x-2 space-y-2 md:flex-row">
      {STEPS.map((step, index) => (
        <Fragment key={step}>
          <div
            className={cn(
              'w-56 rounded-full p-2 text-center text-sm',
              index === current ? 'bg-secondary' : '',
            )}
          >
            {step}
          </div>
          {step !== StepsEnum.PLACE_ORDER && (
            <hr className="mx-2 w-16 border-t border-gray-300" />
          )}
        </Fragment>
      ))}
    </div>
  )
}
