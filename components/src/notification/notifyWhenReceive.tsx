import { useEffect } from 'react'
import { EasyCoderMessage, DataCenter } from '@easy-coder/sdk/data'

import DisplaySingleNotify from './displaySingleNotify'

interface Props {
  message: EasyCoderMessage.Define
  dataCenter: DataCenter
}

export default function NotifyWhenReceive({ message, dataCenter }: Props) {
  useEffect(() => {
    if (message.readAt) return

    if (document.visibilityState === 'visible') {
      dataCenter.read([message._id])
      return
    }

    function onVisibleChange() {
      if (document.visibilityState === 'visible') {
        dataCenter.read([message._id])
        document.removeEventListener('visibilitychange', onVisibleChange)
      }
    }
    document.addEventListener('visibilitychange', onVisibleChange)

    return () => {
      document.removeEventListener('visibilitychange', onVisibleChange)
    }
  }, [])

  return (
    <DisplaySingleNotify
      message={message}
      hideHeader
    />
  )
}
