import { useCallback, useEffect, useRef, useState } from 'react'
import { IconNotification } from '@arco-design/web-react/icon'
import { Badge, Popover, Notification as NotificationUi } from '@arco-design/web-react'

import { EasyCoderElement } from '@easy-coder/sdk/store'
import { useDataCenter } from '@easy-coder/sdk/data'
import { i18n } from '@easy-coder/sdk/i18n'

import NotifyList from './notifyList'
import NotifyWhenReceive from './notifyWhenReceive'

import './index.scss'

export interface NotificationProps extends EasyCoderElement.DataProps {
  className?: string
  style?: React.CSSProperties
  showWhenReceive?: boolean
}

const topText = i18n.translate({ zh: '通知', en: 'Notification' })

export default function Notification({ showWhenReceive, ...extra }: NotificationProps) {
  const [notReadCount, setNotReadCount] = useState(0)
  const dataCenter = useDataCenter()
  const showWhenReceiveRef = useRef(showWhenReceive)
  const readIds = useRef<number[]>([])

  const fetchNodeReadCount = useCallback(async () => {
    const res = await dataCenter.get<{ count: number }>('/message/notReadCount')
    if (res.code !== 0) return

    setNotReadCount(res.data.count)
  }, [])

  useEffect(() => {
    showWhenReceiveRef.current = showWhenReceive
  }, [showWhenReceive])

  useEffect(() => {
    fetchNodeReadCount()

    const removeReceiveListener = dataCenter.addListener('onReceive', (msg) => {
      setNotReadCount((old) => old + 1)
      if (showWhenReceiveRef.current) {
        const fn = {
          success: NotificationUi.success,
          error: NotificationUi.error,
          warn: NotificationUi.warning,
          info: NotificationUi.info,
        }[msg.type]

        if (!fn) return

        fn({
          closable: true,
          title: msg.title,
          className: 'notification-wrapper',
          content: (
            <NotifyWhenReceive
              message={msg}
              dataCenter={dataCenter}
            />
          ),
        })
      }
    })

    const removeReadListener = dataCenter.addListener('onRead', (ids) => {
      const effectIds = ids.filter((id) => !readIds.current.includes(id))
      if (effectIds.length === 0) return

      readIds.current.push(...effectIds)
      setNotReadCount((old) => Math.max(0, old - effectIds.length))
    })

    return () => {
      removeReceiveListener()
      removeReadListener()
    }
  }, [])

  return (
    <Popover
      trigger="click"
      position="br"
      triggerProps={{ showArrow: false }}
      unmountOnExit={false}
      content={<NotifyList />}>
      <Popover
        trigger="hover"
        position="top"
        content={topText}>
        <Badge
          count={notReadCount}
          offset={[6, -6]}
          {...extra}>
          <IconNotification />
        </Badge>
      </Popover>
    </Popover>
  )
}
