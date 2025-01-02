import { useMemo } from 'react'
import { Carousel, CarouselProps, Spin } from '@arco-design/web-react'
import { ModalConfig } from '@easy-coder/sdk/design'
import { EasyCoderElement, useModelRecords } from '@easy-coder/sdk/store'
import { useEffectCallback } from '@easy-coder/sdk/helper'

interface Props extends Omit<CarouselProps, 'onChange'> {
  modalConfig?: ModalConfig
  itemRender?: (payload: { item?: any }) => React.ReactNode
  onChange?: (item: Record<string, any>) => void
}

export default function RenderWhenModal({ modalConfig, itemRender, onChange, ...extra }: Props) {
  const autoFetch = useMemo(() => ({ limit: 10, condition: modalConfig?.condition }), [modalConfig?.condition])

  const { records, loading } = useModelRecords({
    modalName: modalConfig?.name,
    fields: modalConfig?.fields,
    orders: modalConfig?.orders,
    useApiId: true,
    useExampleWhenPreview: true,
    exampleCount: 5,
    autoFetch,
  })

  const handleChange = useEffectCallback(
    (index: number) => {
      if (!records?.[index]) return

      onChange?.(records[index])
    },
    [records, onChange]
  )

  if (loading) {
    const dataProps: EasyCoderElement.DataProps = {}
    for (const key in extra) {
      if (key.startsWith('data-')) {
        dataProps[key] = extra[key]
      }
    }

    return (
      <Spin
        {...dataProps}
        style={extra.style}
        className={extra.className}
        loading
      />
    )
  }

  return (
    <Carousel
      {...extra}
      onChange={handleChange}>
      {records.map((record) => (
        <div key={record._id}>{itemRender?.({ item: record })}</div>
      ))}
    </Carousel>
  )
}
