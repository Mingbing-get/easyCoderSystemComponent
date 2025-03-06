import { useLayoutEffect, useMemo, useRef } from 'react'
import classNames from 'classnames'
import { Badge } from '@arco-design/web-react'
import { IconInfo, IconClose, IconCheck, IconExclamation } from '@arco-design/web-react/icon'

import { EasyCoderMessage } from '@easy-coder/sdk/data'
import { i18n } from '@easy-coder/sdk/i18n'

import ShowExtraWhenUrl from './showExtraWhenUrl'
import ShowExtraWhenPage from './showExtraWhenPage'

import './index.scss'

interface Props {
  style?: React.CSSProperties
  className?: string
  observer?: IntersectionObserver
  isRead?: boolean
  hideHeader?: boolean
  message: EasyCoderMessage.Define
}

const dayAgo = i18n.translate({ zh: '天前', en: 'day ago' })
const hourAgo = i18n.translate({ zh: '小时前', en: 'hour ago' })
const minuteAgo = i18n.translate({ zh: '分钟前', en: 'minute ago' })
const withinOneMinute = i18n.translate({ zh: '1分钟内', en: 'Within 1 minute' })

export default function DisplaySingleNotify({ style, className, observer, isRead, hideHeader, message }: Props) {
  const domRef = useRef<HTMLDivElement>(null)

  const Icon = useMemo(() => {
    if (message.type === 'error') {
      return IconClose
    }

    if (message.type === 'warn') {
      return IconExclamation
    }

    if (message.type === 'success') {
      return IconCheck
    }

    return IconInfo
  }, [message.type])

  useLayoutEffect(() => {
    if (!domRef.current) return

    observer?.observe(domRef.current)

    return () => {
      observer?.unobserve(domRef.current)
    }
  }, [])

  return (
    <div
      ref={domRef}
      data-notify-id={message._id}
      className={classNames('single-notify-wrapper', `type-${message.type || 'info'}`, className)}
      style={style}>
      {!hideHeader && (
        <div className="single-notify-header">
          <Badge
            style={{ zIndex: 0 }}
            dot
            count={isRead || message.readAt ? 0 : 1}>
            <Icon className="notify-type-icon" />
          </Badge>
          <h3>{message.title}</h3>
        </div>
      )}
      <div className="single-notify-body">
        <p className="single-notify-content">{message.content}</p>
        {message.extra?.type === 'url' && <ShowExtraWhenUrl extra={message.extra} />}
        {message.extra?.type === 'page' && <ShowExtraWhenPage extra={message.extra} />}
      </div>
      <div className="single-notify-footer">
        <span className="create-time">{formatDate(message._created_at)}</span>
      </div>
    </div>
  )
}

function formatDate(str: string) {
  const date = new Date(str)
  const now = new Date()

  const diff = now.getTime() - date.getTime()
  const millisecondsOfDay = 24 * 60 * 60 * 1000
  const millisecondsOfHour = 60 * 60 * 1000
  const millisecondsOfMinute = 60 * 1000

  const diffOfDay = Math.floor(diff / millisecondsOfDay)
  if (diffOfDay >= 30) {
    return `${date.getFullYear()}-${_tow(date.getMonth() + 1)}-${_tow(date.getDate())} ${_tow(date.getHours())}:${_tow(date.getMinutes())}:${_tow(
      date.getSeconds()
    )}`
  }

  if (diffOfDay > 0) {
    return `${diffOfDay}${dayAgo}`
  }

  const diffOfHour = Math.floor(diff / millisecondsOfHour)
  if (diffOfHour > 0) {
    return `${diffOfHour}${hourAgo}`
  }

  const diffOfMinute = Math.floor(diff / millisecondsOfMinute)
  if (diffOfMinute > 0) {
    return `${diffOfMinute}${minuteAgo}`
  }

  return withinOneMinute
}

function _tow(num: number) {
  return `${num}`.padStart(2, '0')
}
