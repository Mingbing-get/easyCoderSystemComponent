import { Popover } from '@arco-design/web-react'
import { IconPlus } from '@arco-design/web-react/icon'

import { AddButtonProps } from '@easy-coder/sdk/design'
import { useElementContext } from '@easy-coder/sdk/store'
import { generateId, useEffectCallback } from '@easy-coder/sdk/helper'
import { i18n } from '@easy-coder/sdk/i18n'

import { CustomCollapseItem, CollapseProps } from '..'

export default function AddButton({ onAdd }: AddButtonProps<CustomCollapseItem>) {
  const { insertSlot } = useElementContext<any, CollapseProps>()

  const handleAdd = useEffectCallback(async () => {
    const slots = await insertSlot('customRender', [
      i18n.translate({ zh: '标题插槽', en: 'Title slot' }),
      i18n.translate({ zh: '额外插槽', en: 'Extra slot' }),
      i18n.translate({ zh: '内容插槽', en: 'Content slot' }),
    ])

    if (slots.length !== 3) return

    const headerSlotId = slots.find((slot) => slot.alias === i18n.translate({ zh: '标题插槽', en: 'Title slot' }))?.slotId || ''
    const extraSlotId = slots.find((slot) => slot.alias === i18n.translate({ zh: '额外插槽', en: 'Extra slot' }))?.slotId || ''
    const contentSlotId = slots.find((slot) => slot.alias === i18n.translate({ zh: '内容插槽', en: 'Content slot' }))?.slotId || ''

    onAdd?.({
      id: generateId('collapse_item'),
      headerSlotId,
      extraSlotId,
      contentSlotId,
      label: {
        zh: '折叠项',
        en: 'Collapse Item',
      },
    })
  }, [onAdd])

  return (
    <Popover
      trigger="hover"
      position="top"
      content={i18n.translate({ zh: '添加折叠项', en: 'Add collapse item' })}>
      <IconPlus
        className="add-icon"
        onClick={handleAdd}
      />
    </Popover>
  )
}
