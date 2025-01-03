import { useCallback, useEffect, useRef, useState } from 'react'
import { Tabs } from '@arco-design/web-react'
import { useEffectCallback } from '@easy-coder/sdk/helper'
import { EasyCoderState, useElementContext, useStore } from '@easy-coder/sdk/store'

import { CustomTabItem, TabsProps } from '..'

interface Props extends Omit<TabsProps, 'dataFrom' | 'modalConfig' | 'variableValue' | 'titleRender' | 'contentRender' | 'fetchCount'> {}

export default function RenderWhenCustom({ panelClassName, panelStyle, extraRender, customData, customRender, onChange, ...extra }: Props) {
  const { id } = useElementContext()
  const { state } = useStore()
  const [activeKey, setActiveKey] = useState<string>()
  const initLockId = useRef(false)

  const findLockItem = useCallback((id: string, customData?: CustomTabItem[]) => {
    // 检查是否有lock, 若有则检查lock是否是当前menu的子节点，若是则选择到包含被lock子节点的菜单项，若不是则无需处理
    const lockInfo = new URL(location.href).searchParams.get('lockId')
    if (!lockInfo) return

    const items = lockInfo.split(',')
    const slotId = findIncludeActiveTabsSlotId(state.getValue<EasyCoderState.Desc>(), id, { type: items[0] as any, id: items[1] })
    if (!slotId) return

    const item = customData.find((item) => item.contentSlotId === slotId)
    return item
  }, [])

  useEffect(() => {
    if (!customData?.length) return

    if (!initLockId.current) {
      initLockId.current = true

      const item = findLockItem(id, customData)
      if (item) {
        setActiveKey(item.id)
        onChange?.(item)
        return
      }
    }

    setActiveKey((old) => {
      const record = customData.find((item) => item.id === old)
      if (record) return old

      onChange?.(customData[0])
      return customData[0].id
    })
  }, [id, customData])

  const handleChange = useEffectCallback(
    (key: string) => {
      const item = customData?.find((item) => item.id === key)
      if (!item) return

      setActiveKey(key)
      onChange?.(item)
    },
    [customData, onChange]
  )

  return (
    <Tabs
      {...extra}
      destroyOnHide
      activeTab={activeKey}
      extra={extraRender?.()}
      onChange={handleChange}>
      {customData?.map((item) => (
        <Tabs.TabPane
          className={panelClassName}
          style={panelStyle}
          key={item.id}
          title={customRender?.[item.titleSlotId]?.(item)}>
          {customRender?.[item.contentSlotId]?.(item)}
        </Tabs.TabPane>
      ))}
    </Tabs>
  )
}

function findIncludeActiveTabsSlotId(state: EasyCoderState.Desc, tabId: string, active: { type: 'element' | 'editor'; id: string }) {
  const tabElement = state.elementMap[tabId]
  if (!tabElement) return

  const customSlots = tabElement.slotMap?.customRender || []
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
      if (!element || active.id === tabId) return

      active = {
        type: 'editor',
        id: element.editorId,
      }
    }
  }
}
