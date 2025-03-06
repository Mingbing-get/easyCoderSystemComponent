import { Popover } from '@arco-design/web-react'
import { IconDelete } from '@arco-design/web-react/icon'

import { RemoveButtonProps } from '@easy-coder/sdk/design'
import { useElementContext } from '@easy-coder/sdk/store'
import { useEffectCallback } from '@easy-coder/sdk/helper'
import { i18n } from '@easy-coder/sdk/i18n'

import { CustomCarouselItem, CarouselProps } from '..'

export default function RemoveButton({ item, onRemove }: RemoveButtonProps<CustomCarouselItem>) {
  const { removeSlot } = useElementContext<any, CarouselProps>()

  const handleRemove = useEffectCallback(async () => {
    const isSuccess = await removeSlot('customRender', [item.slotId])
    if (!isSuccess) return

    onRemove?.()
  }, [item, onRemove])

  return (
    <Popover
      trigger="hover"
      position="top"
      content={i18n.translate({ zh: '删除轮播项', en: 'Delete carousel item' })}>
      <IconDelete
        className="easy-coder-delete-icon"
        onClick={handleRemove}
      />
    </Popover>
  )
}
