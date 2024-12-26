import { useCallback } from 'react'
import { Button } from '@arco-design/web-react'
import { EasyCoderMessage } from '@easy-coder/sdk/data'

interface Props {
  extra: EasyCoderMessage.UrlExtra
}

export default function ShowExtraWhenUrl({ extra }: Props) {
  const handleClick = useCallback(() => {
    window.open(extra.url)
  }, [extra])

  return (
    <Button
      size="mini"
      type="text"
      onClick={handleClick}>
      查看详情
    </Button>
  )
}
