import { useCallback } from 'react'
import { EasyCoderElement, useElementContext } from '@easy-coder/sdk/store'

import MarkdownEditor from './markdownEditor'
import useEditingElement from './useLockElement'

export interface MarkdownProps extends EasyCoderElement.DataProps {
  style?: React.CSSProperties
  content?: string
}

export default function Markdown({ content, ...extra }: MarkdownProps) {
  const { updateProps, id } = useElementContext<unknown, MarkdownProps>()
  const editing = useEditingElement(id)

  const handleUpdateContent = useCallback((content?: string) => {
    updateProps('content', content)
  }, [])

  return (
    <div {...extra}>
      <MarkdownEditor
        id={id}
        isPreview={!editing}
        content={content}
        onChange={handleUpdateContent}
      />
    </div>
  )
}
