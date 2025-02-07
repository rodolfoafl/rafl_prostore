'use client'

import { OnApproveData } from '@paypal/paypal-js'
import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from '@paypal/react-paypal-js'
import Image from 'next/image'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'
import {
  approvePayPalOrder,
  createPayPalOrder,
} from '@/lib/actions/order.action'
import { formatCurrency, formatDateTime, shortenId } from '@/lib/utils'
import { Order } from '@/types'

export default function OrderDetailsTable({
  order,
  paypalClientId,
}: {
  order: Order
  paypalClientId: string
}) {
  const { toast } = useToast()

  const {
    id,
    shippingAddress,
    orderitems,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    paymentMethod,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
  } = order

  const PrintLoadingState = () => {
    const [{ isPending, isRejected }] = usePayPalScriptReducer()
    let status = ''

    if (isPending) {
      status = 'Loading PayPal'
    } else if (isRejected) {
      status = 'Error loading PayPal'
    }

    return status
  }

  const handleCreatePayPalOrder = async () => {
    const response = await createPayPalOrder(id)

    if (!response.success) {
      toast({
        variant: 'destructive',
        description: response.message,
      })
    }

    return response.data
  }

  const handleApprovePayPalOrder = async (data: OnApproveData) => {
    const response = await approvePayPalOrder(id, { orderId: data.orderID })

    toast({
      variant: response.success ? 'default' : 'destructive',
      description: response.message,
    })
  }

  return (
    <>
      <h1 className="py-4 text-2xl">Order {shortenId(id)}</h1>

      {/* TODO: Use reusable grid component */}
      <div className="grid md:grid-cols-3 md:gap-5">
        <div className="col-span-2 space-y-4 overflow-x-auto">
          <Card>
            <CardContent className="gap-4 p-4">
              <h2 className="pb-4 text-xl">Payment Method</h2>
              <p>{paymentMethod}</p>
              <div className="mt-2">
                {isPaid ? (
                  <Badge variant="secondary">
                    Paid at {formatDateTime(paidAt!).dateTime}
                  </Badge>
                ) : (
                  <Badge variant="destructive">Not paid</Badge>
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="gap-4 p-4">
              <h2 className="pb-4 text-xl">Shipping Address</h2>
              <p>{shippingAddress.fullName}</p>
              <p>
                {shippingAddress.streetAddress}, {shippingAddress.city}{' '}
                {shippingAddress.postalCode}, {shippingAddress.country}{' '}
              </p>
              <div className="mt-2">
                {isDelivered ? (
                  <Badge variant="secondary">
                    Delivered at {formatDateTime(deliveredAt!).dateTime}
                  </Badge>
                ) : (
                  <Badge variant="destructive">Not delivered</Badge>
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="gap-4 p-4">
              <h2 className="pb-2 text-xl">Order Items</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-center">Quantity</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderitems.map((item) => (
                    <TableRow key={item.slug}>
                      <TableCell>
                        <Link
                          href={`/product/${item.slug}`}
                          className="flex items-center"
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                          />
                          <span className="px-2">{item.name}</span>
                        </Link>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="px-2">{item.qty}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="px-2">
                          {formatCurrency(item.price)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardContent className="gap-4 space-y-4 p-4">
              <div className="flex justify-between">
                <div>Items</div>
                <div className="font-semibold">
                  {formatCurrency(itemsPrice)}
                </div>
              </div>
              <div className="flex justify-between">
                <div>Shipping</div>
                <div className="font-semibold">
                  {formatCurrency(shippingPrice)}
                </div>
              </div>
              <div className="flex justify-between">
                <div>Tax</div>
                <div className="font-semibold">{formatCurrency(taxPrice)}</div>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-4">
                <div>Total</div>
                <div className="text-xl font-semibold">
                  {formatCurrency(totalPrice)}
                </div>
              </div>

              {/* PayPal Payment */}
              {!isPaid && paymentMethod === 'PayPal' && (
                <div>
                  <PayPalScriptProvider options={{ clientId: paypalClientId }}>
                    <PrintLoadingState />
                    <PayPalButtons
                      createOrder={handleCreatePayPalOrder}
                      onApprove={handleApprovePayPalOrder}
                    />
                  </PayPalScriptProvider>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
