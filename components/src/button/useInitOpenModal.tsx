import { useEffect, useRef } from 'react'

import { EasyCoderState, useElementContext, useStore } from '@easy-coder/sdk/store'
import { useEffectCallback } from '@easy-coder/sdk/helper'

export default function useInitOpenModal(fn: () => void) {
  const { id } = useElementContext()
  const { state } = useStore()
  const initLockId = useRef(false)

  const executeFn = useEffectCallback(() => {
    fn()
  }, [fn])

  useEffect(() => {
    if (!initLockId.current) {
      initLockId.current = true

      const lockInfo = new URL(location.href).searchParams.get('lockId')
      if (!lockInfo) return

      const items = lockInfo.split(',')
      const slotId = findIncludeButtonModalSlotId(state.getValue<EasyCoderState.Desc>(), id, { type: items[0] as any, id: items[1] })
      if (!slotId) return

      executeFn()
    }
  }, [id])
}

function findIncludeButtonModalSlotId(state: EasyCoderState.Desc, tabId: string, active: { type: 'element' | 'editor'; id: string }) {
  const buttonElement = state.elementMap[tabId]
  if (!buttonElement) return

  const customSlots = buttonElement.slotMap?.confirmDescription || []
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
