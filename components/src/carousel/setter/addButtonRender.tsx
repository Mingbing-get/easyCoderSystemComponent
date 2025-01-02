import { Popover } from '@arco-design/web-react'
import { IconPlus } from '@arco-design/web-react/icon'

import { AddButtonProps } from '@easy-coder/sdk/design'
import { useElementContext } from '@easy-coder/sdk/store'
import { generateId, useEffectCallback } from '@easy-coder/sdk/helper'

import { CustomCarouselItem, CarouselProps } from '..'

export default function AddButton({ onAdd }: AddButtonProps<CustomCarouselItem>) {
  const { insertSlot } = useElementContext<any, CarouselProps>()

  const handleAdd = useEffectCallback(async () => {
    const slots = await insertSlot('customRender', ['自定义插槽'])

    if (slots.length !== 1) return

    const slotId = slots[0].slotId

    onAdd?.({
      id: generateId('menu_item'),
      slotId,
      label: '轮播项',
    })
  }, [onAdd])

  return (
    <Popover
      trigger="hover"
      position="top"
      content="添加轮播项">
      <IconPlus
        className="add-icon"
        onClick={handleAdd}
      />
    </Popover>
  )
}
