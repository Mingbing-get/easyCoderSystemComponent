import { Popover } from '@arco-design/web-react'
import { IconPlus } from '@arco-design/web-react/icon'

import { AddButtonProps } from '@easy-coder/sdk/design'
import { useElementContext, useInsertElement, SLOT_VARIABLE } from '@easy-coder/sdk/store'
import { generateId, useEffectCallback } from '@easy-coder/sdk/helper'
import { i18n } from '@easy-coder/sdk/i18n'

import { CustomMenu, MenuProps } from '..'

export default function AddTreeNode({ onAdd }: AddButtonProps<CustomMenu>) {
  const { insertSlot } = useElementContext<any, MenuProps>()
  const insertElement = useInsertElement()

  const handleAdd = useEffectCallback(async () => {
    const slots = await insertSlot('customRender', [i18n.translate({ zh: '菜单标题', en: 'Menu title' }), i18n.translate({ zh: '内容', en: 'Content' })])

    if (slots.length !== 2) return

    const labelSlotId = slots.find((slot) => slot.alias === i18n.translate({ zh: '菜单标题', en: 'Menu title' }))?.slotId || ''
    const contentSlotId = slots.find((slot) => slot.alias === i18n.translate({ zh: '内容', en: 'Content' }))?.slotId || ''

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
      content={i18n.translate({ zh: '添加菜单项', en: 'Add menu item' })}>
      <IconPlus
        className="add-icon"
        onClick={handleAdd}
      />
    </Popover>
  )
}
