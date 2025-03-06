import { useCallback } from 'react'
import { Button } from '@arco-design/web-react'

import { EasyCoderMessage } from '@easy-coder/sdk/data'
import { i18n } from '@easy-coder/sdk/i18n'

interface Props {
  extra: EasyCoderMessage.UrlExtra
}

const viewDetails = i18n.translate({ zh: '查看详情', en: 'View details' })

export default function ShowExtraWhenUrl({ extra }: Props) {
  const handleClick = useCallback(() => {
    window.open(extra.url)
  }, [extra])

  return (
    <Button
      size="mini"
      type="text"
      onClick={handleClick}>
      {viewDetails}
    </Button>
  )
}
