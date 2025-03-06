import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import classNames from 'classnames'
import { Popover } from '@arco-design/web-react'
import { EasyCoderElement, useElementContext, useEnv } from '@easy-coder/sdk/store'
import { Multilingual, i18n } from '@easy-coder/sdk/i18n'

import './index.scss'

export interface TextProps extends EasyCoderElement.DataProps {
  style?: React.CSSProperties
  className?: string
  text?: string | Multilingual
  maxLine?: number
  disabledPopover?: boolean
  onClick?: () => void
}

interface TextExport {
  text?: string | Multilingual
  setText: (text?: string | Multilingual) => void
}

export default function Text({ text, maxLine = 1, disabledPopover, style, className, ...extra }: TextProps) {
  const wrapperRef = useRef<HTMLSpanElement>(null)
  const [textOverFlow, setTextOverFlow] = useState(false)
  const [_text, setText] = useState(text)
  const { exportAttr, exportEvent } = useElementContext<TextExport>()
  const { isPreviewing } = useEnv()

  useLayoutEffect(() => {
    if (!wrapperRef.current) return

    setTextOverFlow(
      wrapperRef.current.clientWidth - wrapperRef.current.scrollWidth < -2 || wrapperRef.current.clientHeight - wrapperRef.current.scrollHeight < -2
    )
  }, [_text, maxLine])

  useEffect(() => {
    setText(text)
  }, [text])

  useEffect(() => {
    exportEvent('setText', setText)

    return () => exportEvent('setText', undefined)
  }, [])

  useEffect(() => {
    exportAttr('text', _text)
  }, [_text])

  const renderText = useMemo(() => {
    if (!isPreviewing || !!_text) return i18n.translate(_text)

    return i18n.translate({ zh: '示例', en: 'example' })
  }, [isPreviewing, _text])

  return (
    <Popover
      disabled={disabledPopover || !textOverFlow}
      position="top"
      trigger="hover"
      content={renderText}>
      <span
        {...extra}
        ref={wrapperRef}
        style={{ ...style, '--max-line': maxLine } as React.CSSProperties}
        className={classNames('easy-coder-text', className)}>
        <span>{renderText}</span>
      </span>
    </Popover>
  )
}
