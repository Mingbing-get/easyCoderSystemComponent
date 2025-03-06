import { Popover } from '@arco-design/web-react'
import { IconPlus } from '@arco-design/web-react/icon'

import { AddButtonProps } from '@easy-coder/sdk/design'
import { useElementContext } from '@easy-coder/sdk/store'
import { generateId, useEffectCallback } from '@easy-coder/sdk/helper'
import { i18n } from '@easy-coder/sdk/i18n'

import { CustomCarouselItem, CarouselProps } from '..'

export default function AddButton({ onAdd }: AddButtonProps<CustomCarouselItem>) {
  const { insertSlot } = useElementContext<any, CarouselProps>()

  const handleAdd = useEffectCallback(async () => {
    const slots = await insertSlot('customRender', [i18n.translate({ zh: '自定义插槽', en: 'Custom slot' })])

    if (slots.length !== 1) return

    const slotId = slots[0].slotId

    onAdd?.({
      id: generateId('carousel_item'),
      slotId,
      label: {
        zh: '轮播项',
        en: 'Carousel item',
      },
    })
  }, [onAdd])

  return (
    <Popover
      trigger="hover"
      position="top"
      content={i18n.translate({ zh: '添加轮播项', en: 'Add a carousel item' })}>
      <IconPlus
        className="add-icon"
        onClick={handleAdd}
      />
    </Popover>
  )
}
