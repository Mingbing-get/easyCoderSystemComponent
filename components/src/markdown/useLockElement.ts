import { useEffect, useRef, useState } from 'react'
import { useEffectCallback } from '@easy-coder/sdk/helper'
import { useEventBus } from '@easy-coder/sdk/store'

interface LockAreaChangeOption {
  active?: { type: 'editor' | 'element'; id: string }
  lock?: boolean
}

export default function useEditingElement(id: string) {
  const eventBus = useEventBus()
  const [editing, setEditing] = useState(false)
  const initLockId = useRef(false)

  const handleLockAreaChange = useEffectCallback(
    ({ active, lock }: LockAreaChangeOption) => {
      if (!lock) {
        setEditing(false)
      } else {
        setEditing(active.type === 'element' && active.id === id)
      }
    },
    [id]
  )

  useEffect(() => {
    if (!initLockId.current) {
      initLockId.current = true

      const lockInfo = new URL(location.href).searchParams.get('lockId')
      if (!lockInfo) return

      const items = lockInfo.split(',')
      setEditing(items[0] === 'element' && items[1] === id)
    }
  }, [id])

  useEffect(() => {
    const removeListener = eventBus.addEventListener('lockAreaChange', handleLockAreaChange)

    return removeListener
  }, [])

  return editing
}
