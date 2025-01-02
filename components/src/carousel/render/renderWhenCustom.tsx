import { useEffect, useRef } from 'react'
import { Carousel, CarouselProps } from '@arco-design/web-react'
import { EasyCoderState, useElementContext, useStore } from '@easy-coder/sdk/store'
import { useEffectCallback } from '@easy-coder/sdk/helper'

import { CustomCarouselItem, CustomCarouselItemRender } from '..'

interface Props extends Omit<CarouselProps, 'onChange'> {
  customData?: CustomCarouselItem[]
  customRender?: Record<string, CustomCarouselItemRender>
  onChange?: (item: CustomCarouselItem) => void
}

export default function RenderWhenCustom({ customData, customRender, onChange, ...extra }: Props) {
  const { id } = useElementContext()
  const { state } = useStore()
  const carousel: CarouselProps['carousel'] = useRef()
  const initLockId = useRef(false)

  useEffect(() => {
    if (!customData?.length) return

    if (!initLockId.current) {
      initLockId.current = true

      // 检查是否有lock, 若有则检查lock是否是当前menu的子节点，若是则选择到包含被lock子节点的菜单项，若不是则无需处理
      const lockInfo = new URL(location.href).searchParams.get('lockId')
      if (!lockInfo) return

      const items = lockInfo.split(',')
      const slotId = findIncludeActiveCarouselSlotId(state.getValue<EasyCoderState.Desc>(), id, { type: items[0] as any, id: items[1] })
      if (!slotId) return

      const index = customData.findIndex((item) => item.slotId === slotId)
      if (index === -1) return

      carousel.current?.goto({ index, resetAutoPlayInterval: true })
    }
  }, [customData, id])

  const handleChange = useEffectCallback(
    (index: number) => {
      if (!customData?.[index]) return

      onChange?.(customData[index])
    },
    [customData, onChange]
  )

  return (
    <Carousel
      {...extra}
      onChange={handleChange}
      carousel={carousel}>
      {customData?.map((item) => (
        <div key={item.id}>{customRender?.[item.slotId]?.(item)}</div>
      ))}
    </Carousel>
  )
}

function findIncludeActiveCarouselSlotId(state: EasyCoderState.Desc, carouselId: string, active: { type: 'element' | 'editor'; id: string }) {
  const carouselElement = state.elementMap[carouselId]
  if (!carouselElement) return

  const customSlots = carouselElement.slotMap?.customRender || []
  if (!customSlots.length) return

  while (true) {
    if (active.type === 'editor') {
      const editor = state.editorMap[active.id]
      if (!editor || editor.type !== 'slot') return

      if (customSlots.includes(active.id)) return active.id

      active = {
        type: 'element',
        id: editor.elementId,
      }
    } else {
      const element = state.elementMap[active.id]
      if (!element || active.id === carouselId) return

      active = {
        type: 'editor',
        id: element.editorId,
      }
    }
  }
}
