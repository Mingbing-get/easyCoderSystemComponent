import { Popover } from '@arco-design/web-react'
import { IconDelete } from '@arco-design/web-react/icon'
import { RemoveButtonProps } from '@easy-coder/sdk/design'

import { useElementContext } from '@easy-coder/sdk/store'
import { useEffectCallback } from '@easy-coder/sdk/helper'

import { CustomTimelineItem, TimelineProps } from '..'

export default function RemoveButton({ item, onRemove }: RemoveButtonProps<CustomTimelineItem>) {
  const { removeSlot } = useElementContext<any, TimelineProps>()

  const handleRemove = useEffectCallback(async () => {
    const willDeleteSlots = [item.contentSlotId]
    if (item.dotSlotId) {
      willDeleteSlots.push(item.dotSlotId)
    }

    const isSuccess = await removeSlot('customRender', willDeleteSlots)
    if (!isSuccess) return

    onRemove?.()
  }, [item, onRemove])

  return (
    <Popover
      trigger="hover"
      position="top"
      content="删除节点项">
      <IconDelete
        className="easy-coder-delete-icon"
        onClick={handleRemove}
      />
    </Popover>
  )
}
