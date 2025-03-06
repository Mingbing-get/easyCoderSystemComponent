import { Popover } from '@arco-design/web-react'
import { IconDelete } from '@arco-design/web-react/icon'

import { RemoveButtonProps } from '@easy-coder/sdk/design'
import { useElementContext } from '@easy-coder/sdk/store'
import { useEffectCallback } from '@easy-coder/sdk/helper'
import { i18n } from '@easy-coder/sdk/i18n'

import { CustomTabItem, TabsProps } from '..'

export default function RemoveButton({ item, onRemove }: RemoveButtonProps<CustomTabItem>) {
  const { removeSlot } = useElementContext<any, TabsProps>()

  const handleRemove = useEffectCallback(async () => {
    const isSuccess = await removeSlot('customRender', [item.titleSlotId, item.contentSlotId])
    if (!isSuccess) return

    onRemove?.()
  }, [item, onRemove])

  return (
    <Popover
      trigger="hover"
      position="top"
      content={i18n.translate({ zh: '删除标签项', en: 'Delete tab item' })}>
      <IconDelete
        className="easy-coder-delete-icon"
        onClick={handleRemove}
      />
    </Popover>
  )
}
