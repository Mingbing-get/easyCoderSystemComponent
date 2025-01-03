import { useEffect, useRef, useState } from 'react'
import { Collapse } from '@arco-design/web-react'
import { EasyCoderState, useElementContext, useStore } from '@easy-coder/sdk/store'

import { CollapseProps } from '..'

interface Props extends Omit<CollapseProps, 'triggerRegion' | 'dataFrom' | 'modalConfig' | 'variableValue' | 'extraRender' | 'headerRender' | 'contentRender'> {
  triggerRegion?: 'header' | 'icon'
}

export default function RenderWhenCustom({ itemClassName, itemStyle, contentStyle, customData, customRender, ...extra }: Props) {
  const { id } = useElementContext()
  const { state } = useStore()
  const [activeKeys, setActiveKeys] = useState<string[]>()
  const initLockId = useRef(false)

  useEffect(() => {
    if (!customData?.length) return

    if (!initLockId.current) {
      initLockId.current = true

      // 检查是否有lock, 若有则检查lock是否是当前menu的子节点，若是则选择到包含被lock子节点的菜单项，若不是则无需处理
      const lockInfo = new URL(location.href).searchParams.get('lockId')
      if (!lockInfo) return

      const items = lockInfo.split(',')
      const slotId = findIncludeActiveCollapseSlotId(state.getValue<EasyCoderState.Desc>(), id, { type: items[0] as any, id: items[1] })
      if (!slotId) return

      const item = customData.find((item) => item.contentSlotId === slotId)
      if (!item) return

      setActiveKeys([item.id])
    }
  }, [id, customData])

  return (
    <Collapse
      {...extra}
      activeKey={activeKeys}
      onChange={(_, keys) => setActiveKeys(keys)}
      destroyOnHide>
      {customData?.map((item) => (
        <Collapse.Item
          key={item.id}
          name={item.id}
          className={itemClassName}
          style={itemStyle}
          contentStyle={contentStyle}
          header={customRender?.[item.headerSlotId]?.(item)}
          extra={customRender?.[item.extraSlotId]?.(item)}>
          {customRender?.[item.contentSlotId]?.(item)}
        </Collapse.Item>
      ))}
    </Collapse>
  )
}

function findIncludeActiveCollapseSlotId(state: EasyCoderState.Desc, collapseId: string, active: { type: 'element' | 'editor'; id: string }) {
  const collapseElement = state.elementMap[collapseId]
  if (!collapseElement) return

  const customSlots = collapseElement.slotMap?.customRender || []
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
      if (!element || active.id === collapseId) return

      active = {
        type: 'editor',
        id: element.editorId,
      }
    }
  }
}
