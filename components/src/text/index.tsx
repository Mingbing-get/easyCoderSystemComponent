import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { EasyCoderElement, useElementContext, useEnv } from '@easy-coder/sdk/store'
import { Popover } from '@arco-design/web-react'
import classNames from 'classnames'

import './index.scss'

export interface TextProps extends EasyCoderElement.DataProps {
  style?: React.CSSProperties
  className?: string
  text?: string
  maxLine?: number
  disabledPopover?: boolean
}

interface TextExport {
  text?: string
  setText: (text?: string) => void
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
  }, [])

  useEffect(() => {
    exportAttr('text', _text)
  }, [_text])

  const renderText = useMemo(() => {
    if (!isPreviewing || !!_text) return _text

    return 'example'
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
