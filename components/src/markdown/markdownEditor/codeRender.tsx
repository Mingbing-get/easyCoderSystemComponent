import { i18n } from '@easy-coder/sdk/i18n'
import { Popover, Message } from '@arco-design/web-react'
import { IconCopy } from '@arco-design/web-react/icon'
import copyText from './copyText'

interface Props {
  children?: React.ReactNode
}

export default function CodeRender({ children }: Props) {
  return (
    <div className="easy-coder-markdown-code">
      <Popover
        trigger="hover"
        position="top"
        content={i18n.translate({ zh: '复制代码', en: 'Copy code' })}>
        <IconCopy
          className="easy-coder-markdown-code-copy"
          onClick={async () => {
            await copyText(String(children))
            Message.success(i18n.translate({ zh: '复制成功', en: 'Copy success' }))
          }}
        />
      </Popover>
      {children}
    </div>
  )
}
