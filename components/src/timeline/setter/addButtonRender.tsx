import { Popover } from '@arco-design/web-react'
import { IconPlus } from '@arco-design/web-react/icon'

import { AddButtonProps } from '@easy-coder/sdk/design'
import { useElementContext, useStateById } from '@easy-coder/sdk/store'
import { generateId, useEffectCallback } from '@easy-coder/sdk/helper'

import { CustomTimelineItem, TimelineProps } from '..'

export default function AddButton({ onAdd }: AddButtonProps<CustomTimelineItem>) {
  const { id, insertSlot } = useElementContext<any, TimelineProps>()
  const element = useStateById('element', id)

  const handleAdd = useEffectCallback(async () => {
    if (element.props?.useCustomDot) {
      const slots = await insertSlot('customRender', ['点插槽', '内容插槽'])

      if (slots.length !== 2) return

      const dotSlotId = slots.find((slot) => slot.alias === '点插槽')?.slotId || ''
      const contentSlotId = slots.find((slot) => slot.alias === '内容插槽')?.slotId || ''

      onAdd?.({
        id: generateId('timeline_item'),
        dotSlotId,
        contentSlotId,
        label: '节点项',
      })
    } else {
      const slots = await insertSlot('customRender', ['内容插槽'])

      if (slots.length !== 1) return

      const contentSlotId = slots[0]?.slotId

      onAdd?.({
        id: generateId('timeline_item'),
        contentSlotId,
        label: '节点项',
      })
    }
  }, [onAdd, element.props?.useCustomDot])

  return (
    <Popover
      trigger="hover"
      position="top"
      content="添加节点项">
      <IconPlus
        className="add-icon"
        onClick={handleAdd}
      />
    </Popover>
  )
}
