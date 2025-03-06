import { useMemo } from 'react'
import classNames from 'classnames'
import { Tag as TagBase, TagProps as TagBaseProps } from '@arco-design/web-react'
import { EasyCoderElement } from '@easy-coder/sdk/store'
import { Multilingual, i18n } from '@easy-coder/sdk/i18n'

import './index.scss'

export interface TagProps extends EasyCoderElement.DataProps, Pick<TagBaseProps, 'size' | 'bordered' | 'style'> {
  className?: string
  showIcon?: boolean
  text?: string | Multilingual
  iconRender?: () => React.ReactNode
}

export default function Tag({ className, showIcon, text, iconRender, ...extra }: TagProps) {
  const icon = useMemo(() => {
    if (showIcon) {
      return iconRender?.()
    }
  }, [showIcon, iconRender])

  return (
    <TagBase
      {...extra}
      className={classNames('easy-coder-tag', className)}
      icon={icon}>
      {i18n.translateFillEmpty(text)}
    </TagBase>
  )
}
