import { useMemo } from 'react'
import classNames from 'classnames'
import { Alert, AlertProps } from '@arco-design/web-react'
import { useEnv, EasyCoderElement } from '@easy-coder/sdk/store'
import { Multilingual, i18n } from '@easy-coder/sdk/i18n'

import './index.scss'

export interface AlertUiProps extends EasyCoderElement.DataProps, Pick<AlertProps, 'type' | 'style' | 'afterClose' | 'onClose'> {
  className?: string

  useCustomTitle?: boolean
  title?: string | Multilingual
  titleRender?: () => React.ReactNode

  useCustomContent?: boolean
  content?: string | Multilingual
  contentRender?: () => React.ReactNode

  showIcon?: boolean
  useCustomIcon?: boolean
  iconRender?: () => React.ReactNode

  closable?: boolean
  useCustomCloseIcon?: boolean
  closeIconRender?: () => React.ReactNode
}

export default function AlertUi({
  className,

  useCustomTitle,
  title,
  titleRender,

  useCustomContent,
  content,
  contentRender,

  showIcon,
  useCustomIcon,
  iconRender,

  closable,
  useCustomCloseIcon,
  closeIconRender,

  ...extra
}: AlertUiProps) {
  const { isPreviewing } = useEnv()

  const _title = useMemo(() => {
    if (useCustomTitle) {
      return titleRender?.()
    }

    return i18n.translate(title)
  }, [useCustomTitle, title, titleRender])

  const _content = useMemo(() => {
    if (useCustomContent) {
      return contentRender?.()
    }

    return i18n.translate(content)
  }, [useCustomContent, content, contentRender])

  const icon = useMemo(() => {
    if (showIcon && useCustomIcon) {
      return iconRender?.()
    }
  }, [showIcon, useCustomIcon, iconRender])

  const closeIcon = useMemo(() => {
    if (closable && useCustomCloseIcon) {
      if (isPreviewing) {
        return (
          <span
            style={{ display: 'inline-block', minWidth: '1rem' }}
            onClick={(e) => e.stopPropagation()}>
            {closeIconRender?.()}
          </span>
        )
      }

      return closeIconRender?.()
    }
  }, [closable, useCustomCloseIcon, closeIconRender, isPreviewing])

  return (
    <Alert
      {...extra}
      className={classNames(className, 'easy-coder-system-alert')}
      title={_title}
      content={_content}
      showIcon={showIcon}
      icon={icon}
      closable={closable}
      closeElement={closeIcon}
    />
  )
}
