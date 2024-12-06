import { useEffect, useRef, useState } from 'react'
import { useEffectCallback, useUrlState } from '@easy-coder/sdk/helper'
import { EasyCoderState, useElementContext, useStore } from '@easy-coder/sdk/store'

import { CustomMenu } from '..'

export default function useMenuSelected(data?: CustomMenu[]) {
  const { id } = useElementContext()
  const { state } = useStore()
  const isInit = useRef({ lockId: false, openKey: false })

  const [selectedKey, setSelectedKey] = useUrlState<string>({
    searchKey: id,
  })
  const [openKeys, setOpenKeys] = useState<string[]>([])

  useEffect(() => {
    if (!selectedKey || !data?.length || isInit.current.openKey) return

    isInit.current.openKey = true

    const path = findMenuPath(data, selectedKey)
    if (path.length <= 1) return

    setOpenKeys(path.slice(0, path.length - 1))
  }, [data])

  useEffect(() => {
    if (selectedKey || !data?.length) return

    if (!isInit.current.lockId) {
      isInit.current.lockId = true

      // 检查是否有lock, 若有则检查lock是否是当前menu的子节点，若是则选择到包含被lock子节点的菜单项，若不是则无需处理
      const lockInfo = new URL(location.href).searchParams.get('lockId')
      if (lockInfo) {
        const items = lockInfo.split(',')
        const slotId = findIncludeActiveMenuSlotId(state.getValue<EasyCoderState.Desc>(), id, { type: items[0] as any, id: items[1] })
        if (slotId) {
          const slotInMenuItem = findMenuItemBySlotId(data, slotId)
          if (slotInMenuItem) {
            setSelectedKey(slotInMenuItem.id)

            const path = findMenuPath(data, slotInMenuItem.id)
            if (path.length > 1) {
              setOpenKeys(path.slice(0, path.length - 1))
            }

            return
          }
        }
      }
    }

    setSelectedKey(data[0].id)
  }, [selectedKey, data, id])

  const onClickMenuItem = useEffectCallback(
    (id: string) => {
      const item = findCustomMenuById(data, id)
      if (!!item?.children?.length) {
        setOpenKeys((old) => {
          if (old.includes(id)) {
            return old.filter((oldId) => oldId !== id)
          }

          return [...old, id]
        })
      }

      if (id === selectedKey) return

      setSelectedKey(id)
    },
    [selectedKey, data]
  )

  return {
    openKeys,
    selectedKey,
    setSelectedKey,
    onClickMenuItem,
  }
}

function findIncludeActiveMenuSlotId(state: EasyCoderState.Desc, menuId: string, active: { type: 'element' | 'editor'; id: string }) {
  const menuElement = state.elementMap[menuId]
  if (!menuElement) return

  const customSlots = menuElement.slotMap?.customRender || []
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
      if (!element || active.id === menuId) return

      active = {
        type: 'editor',
        id: element.editorId,
      }
    }
  }
}

export function findMenuItemBySlotId(data: CustomMenu[], slotId: string) {
  for (const item of data) {
    if (item.contentSlotId === slotId || item.labelSlotId === slotId) return item

    if (item.children) {
      const subItem = findMenuItemBySlotId(item.children, slotId)
      if (subItem) return subItem
    }
  }
}

export function findCustomMenuById(customMenu: CustomMenu[] = [], id: string): CustomMenu | undefined {
  for (const item of customMenu) {
    if (item.id === id) return item

    if (item.children) {
      const subItem = findCustomMenuById(item.children, id)
      if (subItem) return subItem
    }
  }
}

export function findMenuPath(customMenu: CustomMenu[] = [], id: string, prePath: string[] = []): string[] {
  for (const item of customMenu) {
    if (item.id === id) return [...prePath, id]

    if (item.children?.length) {
      const path = findMenuPath(item.children, id, [...prePath, item.id])
      if (path.length > 0) return path
    }
  }

  return []
}
