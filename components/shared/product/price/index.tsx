import { cn } from "@/lib/utils"

type ProductPriceProps = {
  value: number
  className?: string
}

export default function ProductPrice({ value, className }: ProductPriceProps) {
  // Ensure two decimal places
  const stringValue = value.toFixed(2)

  // Get the int/float
  const [intValue, floatValue] = stringValue.split('.')

  return (
    <p className={cn('text-2xl', className)}>
      <span className="text-xs align-super">$</span>
      {intValue}
      <span className="text-xs align-super">.{floatValue}</span>
    </p>
  )
}
