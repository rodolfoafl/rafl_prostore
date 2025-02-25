/* eslint-disable @typescript-eslint/no-var-requires */
import { Resend } from 'resend'

import PurchaseReceiptEmail from '@/email/purchase-receipt'
import { APP_NAME, SENDER_EMAIL } from '@/lib/constants'
import { Order } from '@/types'

require('dotenv').config()

const resend = new Resend(process.env.RESEND_API_KEY as string)

export const sendPurchaseReceipt = async ({ order }: { order: Order }) => {
  console.log('Sending purchase receipt email')

  await resend.emails.send({
    from: `${APP_NAME} <${SENDER_EMAIL}>`,
    to: order.user.email,
    subject: `Order Confirmation: ${order.id}`,
    react: <PurchaseReceiptEmail order={order} />,
  })
}
