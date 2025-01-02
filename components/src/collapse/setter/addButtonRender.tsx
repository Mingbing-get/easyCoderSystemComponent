import { Popover } from '@arco-design/web-react'
import { IconPlus } from '@arco-design/web-react/icon'

import { AddButtonProps } from '@easy-coder/sdk/design'
import { useElementContext } from '@easy-coder/sdk/store'
import { generateId, useEffectCallback } from '@easy-coder/sdk/helper'

import { CustomCollapseItem, CollapseProps } from '..'

export default function AddButton({ onAdd }: AddButtonProps<CustomCollapseItem>) {
  const { insertSlot } = useElementContext<any, CollapseProps>()

  const handleAdd = useEffectCallback(async () => {
    const slots = await insertSlot('customRender', ['标题插槽', '额外插槽', '内容插槽'])

    if (slots.length !== 3) return

    const headerSlotId = slots.find((slot) => slot.alias === '标题插槽')?.slotId || ''
    const extraSlotId = slots.find((slot) => slot.alias === '额外插槽')?.slotId || ''
    const contentSlotId = slots.find((slot) => slot.alias === '内容插槽')?.slotId || ''

    onAdd?.({
      id: generateId('collapse_item'),
      headerSlotId,
      extraSlotId,
      contentSlotId,
      label: '折叠项',
    })
  }, [onAdd])

  return (
    <Popover
      trigger="hover"
      position="top"
      content="添加折叠项">
      <IconPlus
        className="add-icon"
        onClick={handleAdd}
      />
    </Popover>
  )
}
