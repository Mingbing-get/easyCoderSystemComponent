import { useEffect, useMemo, useState } from 'react'
import { EasyCoderElement, useElementContext, useEnv } from '@easy-coder/sdk/store'

export interface TextProps extends EasyCoderElement.DataProps {
  style?: React.CSSProperties
  className?: string
  text?: string
}

interface TextExport {
  text?: string
  setText: (text?: string) => void
}

export default function Text({ text, ...extra }: TextProps) {
  const [_text, setText] = useState(text)
  const { exportAttr, exportEvent } = useElementContext<TextExport>()
  const { isPreviewing } = useEnv()

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

  return <span {...extra}>{renderText}</span>
}
