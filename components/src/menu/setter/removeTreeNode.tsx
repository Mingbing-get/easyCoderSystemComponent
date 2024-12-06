import { Popover } from '@arco-design/web-react'
import { IconDelete } from '@arco-design/web-react/icon'
import { RemoveButtonProps } from '@easy-coder/sdk/design'

import { useElementContext } from '@easy-coder/sdk/store'
import { useEffectCallback } from '@easy-coder/sdk/helper'

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
      content="删除菜单项">
      <IconDelete
        className="easy-coder-delete-icon"
        onClick={handleRemove}
      />
    </Popover>
  )
}
