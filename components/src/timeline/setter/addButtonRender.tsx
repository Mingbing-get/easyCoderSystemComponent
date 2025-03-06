import { Popover } from '@arco-design/web-react'
import { IconPlus } from '@arco-design/web-react/icon'

import { AddButtonProps } from '@easy-coder/sdk/design'
import { useElementContext, useStateById } from '@easy-coder/sdk/store'
import { generateId, useEffectCallback } from '@easy-coder/sdk/helper'
import { i18n } from '@easy-coder/sdk/i18n'

import { CustomTimelineItem, TimelineProps } from '..'

export default function AddButton({ onAdd }: AddButtonProps<CustomTimelineItem>) {
  const { id, insertSlot } = useElementContext<any, TimelineProps>()
  const element = useStateById('element', id)

  const handleAdd = useEffectCallback(async () => {
    const dotSlotAlias = i18n.translate({ zh: '点插槽', en: 'Dot slot' })
    const contentSlotAlias = i18n.translate({ zh: '内容插槽', en: 'Content slot' })
    if (element.props?.useCustomDot) {
      const slots = await insertSlot('customRender', [dotSlotAlias, contentSlotAlias])

      if (slots.length !== 2) return

      const dotSlotId = slots.find((slot) => slot.alias === dotSlotAlias)?.slotId || ''
      const contentSlotId = slots.find((slot) => slot.alias === contentSlotAlias)?.slotId || ''

      onAdd?.({
        id: generateId('timeline_item'),
        dotSlotId,
        contentSlotId,
        label: {
          zh: '节点项',
          en: 'Timeline item',
        },
      })
    } else {
      const slots = await insertSlot('customRender', [contentSlotAlias])

      if (slots.length !== 1) return

      const contentSlotId = slots[0]?.slotId

      onAdd?.({
        id: generateId('timeline_item'),
        contentSlotId,
        label: {
          zh: '节点项',
          en: 'Timeline item',
        },
      })
    }
  }, [onAdd, element.props?.useCustomDot])

  return (
    <Popover
      trigger="hover"
      position="top"
      content={i18n.translate({ zh: '添加节点项', en: 'Add timeline item' })}>
      <IconPlus
        className="add-icon"
        onClick={handleAdd}
      />
    </Popover>
  )
}
