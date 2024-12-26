import { useCallback, useEffect, useRef, useState } from 'react'
import { List, Message, Spin } from '@arco-design/web-react'

import { useDataCenter, EasyCoderMessage, EasyCoderData } from '@easy-coder/sdk/data'
import { useEffectCallback } from '@easy-coder/sdk/helper'

import DisplaySingleNotify from '../displaySingleNotify'

import './index.scss'

interface Props {}

export default function NotifyList({}: Props) {
  const [scrollLoading, setScrollLoading] = useState(false)
  const [messageList, setMessageList] = useState<EasyCoderMessage.Define[]>([])
  const [observer, setObserver] = useState<IntersectionObserver>()
  const [readIds, setReadIds] = useState<number[]>([])
  const hasMore = useRef(true)
  const listDomRef = useRef<HTMLDivElement>(null)
  const dataCenter = useDataCenter()

  const fetchMessage = useCallback(async () => {
    if (!hasMore.current) return

    const page = Math.floor(messageList.length / 10)

    setScrollLoading(true)

    const res = await dataCenter.post<EasyCoderData.WithPage<EasyCoderMessage.Define>>('/message/query', { page })
    if (res.code !== 0) {
      Message.error(res.msg || '网络错误')
    } else {
      setMessageList((old) => {
        const newList = [...old]

        res.data.list.forEach((item) => {
          if (newList.some((oldItem) => oldItem._id === item._id)) return

          newList.push(item)
        })

        return newList
      })
      if (res.data.list.length + res.data.page * res.data.pageSize >= res.data.total) {
        hasMore.current = false
      }
    }

    setScrollLoading(false)
  }, [messageList])

  const onIntersection = useEffectCallback(
    async (entries: IntersectionObserverEntry[]) => {
      const needReadIds: number[] = []

      entries.forEach((item) => {
        if (!item.isIntersecting) return

        const messageId = item.target.getAttribute('data-notify-id')
        if (!messageId || readIds.includes(Number(messageId))) return

        const message = messageList.find((item) => item._id === Number(messageId))
        if (!message || message.readAt) return

        needReadIds.push(message._id)
      })

      if (needReadIds.length === 0) return

      const res = await dataCenter.read(needReadIds)
      if (res.code !== 0) {
        Message.error(res.msg || '网络错误')
        return
      }

      setReadIds((old) => [...old, ...needReadIds])
    },
    [messageList, readIds]
  )

  useEffect(() => {
    fetchMessage()

    const observer = new IntersectionObserver(onIntersection, {
      root: listDomRef.current,
      threshold: 0.8,
    })

    setObserver(observer)
    const removeReceiveListener = dataCenter.addListener('onReceive', (msg) => {
      setMessageList((old) => {
        if (old.some((item) => item._id === msg._id)) return old

        return [msg, ...old]
      })
    })

    const removeReadListener = dataCenter.addListener('onRead', (ids) => {
      setReadIds((old) => [...old, ...ids])
    })

    return () => {
      removeReceiveListener()
      removeReadListener()
      observer.disconnect()
    }
  }, [])

  return (
    <List
      ref={listDomRef}
      className="notify-list"
      scrollLoading={scrollLoading ? <Spin loading={true} /> : undefined}
      dataSource={messageList}
      onReachBottom={fetchMessage}
      bordered={false}
      header={
        <div className="notify-list-header">
          <h2>通知</h2>
        </div>
      }
      render={(item) => (
        <DisplaySingleNotify
          key={item._id}
          message={item}
          isRead={readIds.includes(item._id)}
          observer={observer}
        />
      )}
    />
  )
}
