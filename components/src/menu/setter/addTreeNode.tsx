import { Popover } from '@arco-design/web-react'
import { IconPlus } from '@arco-design/web-react/icon'

import { AddButtonProps } from '@easy-coder/sdk/design'
import { useElementContext, useInsertElement, SLOT_VARIABLE } from '@easy-coder/sdk/store'
import { generateId, useEffectCallback } from '@easy-coder/sdk/helper'

import { CustomMenu, MenuProps } from '..'

export default function AddTreeNode({ onAdd }: AddButtonProps<CustomMenu>) {
  const { insertSlot } = useElementContext<any, MenuProps>()
  const insertElement = useInsertElement()

  const handleAdd = useEffectCallback(async () => {
    const slots = await insertSlot('customRender', ['菜单标题', '内容'])

    if (slots.length !== 2) return

    const labelSlotId = slots.find((slot) => slot.alias === '菜单标题')?.slotId || ''
    const contentSlotId = slots.find((slot) => slot.alias === '内容')?.slotId || ''

    await insertElement('system_component_text', labelSlotId, undefined, {
      text: {
        _type: 'fx',
        code: `$${SLOT_VARIABLE}.${labelSlotId}.label`,
      },
    })

    onAdd?.({
      id: generateId('menu_item'),
      labelSlotId,
      contentSlotId,
    })
  }, [onAdd])

  return (
    <Popover
      trigger="hover"
      position="top"
      content="添加菜单项">
      <IconPlus
        className="add-icon"
        onClick={handleAdd}
      />
    </Popover>
  )
}
