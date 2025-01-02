import { Carousel, CarouselProps } from '@arco-design/web-react'
import { useEffectCallback } from '@easy-coder/sdk/helper'

interface Props extends Omit<CarouselProps, 'onChange'> {
  variableValue?: any[]
  itemRender?: (payload: { item?: any }) => React.ReactNode
  onChange?: (item: any) => void
}

export default function RenderWhenVariable({ variableValue, itemRender, onChange, ...extra }: Props) {
  const handleChange = useEffectCallback(
    (index: number) => {
      if (!variableValue || variableValue.length <= index) return

      onChange?.(variableValue[index])
    },
    [variableValue, onChange]
  )

  return (
    <Carousel
      {...extra}
      onChange={handleChange}>
      {variableValue?.map((item, index) => (
        <div key={index}>{itemRender?.({ item })}</div>
      ))}
    </Carousel>
  )
}
