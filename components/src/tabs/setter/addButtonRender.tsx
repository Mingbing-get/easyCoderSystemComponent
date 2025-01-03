import { Popover } from '@arco-design/web-react'
import { IconPlus } from '@arco-design/web-react/icon'

import { AddButtonProps } from '@easy-coder/sdk/design'
import { useElementContext } from '@easy-coder/sdk/store'
import { generateId, useEffectCallback } from '@easy-coder/sdk/helper'

import { CustomTabItem, TabsProps } from '..'

export default function AddButton({ onAdd }: AddButtonProps<CustomTabItem>) {
  const { insertSlot } = useElementContext<any, TabsProps>()

  const handleAdd = useEffectCallback(async () => {
    const slots = await insertSlot('customRender', ['标题插槽', '内容插槽'])

    if (slots.length !== 2) return

    const titleSlotId = slots.find((slot) => slot.alias === '标题插槽')?.slotId || ''
    const contentSlotId = slots.find((slot) => slot.alias === '内容插槽')?.slotId || ''

    onAdd?.({
      id: generateId('collapse_item'),
      titleSlotId,
      contentSlotId,
      label: '标签项',
    })
  }, [onAdd])

  return (
    <Popover
      trigger="hover"
      position="top"
      content="添加标签项">
      <IconPlus
        className="add-icon"
        onClick={handleAdd}
      />
    </Popover>
  )
}
