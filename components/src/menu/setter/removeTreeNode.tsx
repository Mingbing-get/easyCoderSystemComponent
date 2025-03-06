import { Popover } from '@arco-design/web-react'
import { IconDelete } from '@arco-design/web-react/icon'
import { RemoveButtonProps } from '@easy-coder/sdk/design'

import { useElementContext } from '@easy-coder/sdk/store'
import { useEffectCallback } from '@easy-coder/sdk/helper'
import { i18n } from '@easy-coder/sdk/i18n'

import { CustomMenu, MenuProps } from '..'

export default function RemoveTreeNode({ item, onRemove }: RemoveButtonProps<CustomMenu>) {
  const { removeSlot } = useElementContext<any, MenuProps>()

  const handleRemove = useEffectCallback(async () => {
    const isSuccess = await removeSlot('customRender', [item.contentSlotId, item.labelSlotId])
    if (!isSuccess) return

    onRemove?.()
  }, [item, onRemove])

  return (
    <Popover
      trigger="hover"
      position="top"
      content={i18n.translate({ zh: '删除菜单项', en: 'Delete menu item' })}>
      <IconDelete
        className="easy-coder-delete-icon"
        onClick={handleRemove}
      />
    </Popover>
  )
}
