import { Popover } from '@arco-design/web-react'
import { IconPlus } from '@arco-design/web-react/icon'

import { AddButtonProps } from '@easy-coder/sdk/design'
import { useElementContext } from '@easy-coder/sdk/store'
import { generateId, useEffectCallback } from '@easy-coder/sdk/helper'
import { i18n } from '@easy-coder/sdk/i18n'

import { CustomTabItem, TabsProps } from '..'

export default function AddButton({ onAdd }: AddButtonProps<CustomTabItem>) {
  const { insertSlot } = useElementContext<any, TabsProps>()

  const handleAdd = useEffectCallback(async () => {
    const titleSlotAlias = i18n.translate({ zh: '标题插槽', en: 'Title slot' })
    const contentSlotAlias = i18n.translate({ zh: '内容插槽', en: 'Content slot' })
    const slots = await insertSlot('customRender', [titleSlotAlias, contentSlotAlias])

    if (slots.length !== 2) return

    const titleSlotId = slots.find((slot) => slot.alias === titleSlotAlias)?.slotId || ''
    const contentSlotId = slots.find((slot) => slot.alias === contentSlotAlias)?.slotId || ''

    onAdd?.({
      id: generateId('collapse_item'),
      titleSlotId,
      contentSlotId,
      label: {
        zh: '标签项',
        en: 'Tab item',
      },
    })
  }, [onAdd])

  return (
    <Popover
      trigger="hover"
      position="top"
      content={i18n.translate({ zh: '添加标签项', en: 'Add tab item' })}>
      <IconPlus
        className="add-icon"
        onClick={handleAdd}
      />
    </Popover>
  )
}
