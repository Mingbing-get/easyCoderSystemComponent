import { memo, useCallback, useEffect, useState } from 'react'
import { useDebounceAndThrottle } from '@easy-coder/sdk/helper'
import { useDataCenter } from '@easy-coder/sdk/data'
import classNames from 'classnames'

import MdEditor from 'react-markdown-editor-lite'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import remarkFrontmatter from 'remark-frontmatter'

import { remarkCodeWrap } from './remarkPlugin'
import CodeRender from './codeRender'
import { fileDownloadPrefix } from '../config'
import AiPlugin from './aiPlugin'

import 'react-markdown-editor-lite/lib/index.css'
import './index.scss'

MdEditor.use(AiPlugin)

const plugins = [
  'header',
  'font-bold',
  'font-italic',
  'font-strikethrough',
  'list-unordered',
  'list-ordered',
  'block-quote',
  'block-wrap',
  'block-code-inline',
  'block-code-block',
  'table',
  'image',
  'link',
  'clear',
  'ai-plugin',
  'logger',
  'mode-toggle',
  'full-screen',
]

interface Props {
  id?: string
  content?: string
  isPreview?: boolean
  onChange?: (content?: string) => void
}

function Editor({ id, content, isPreview, onChange }: Props) {
  const [value, setValue] = useState(content)
  const dataCenter = useDataCenter()

  useEffect(() => {
    setValue(content)
  }, [content])

  const triggerChange = useDebounceAndThrottle(
    useCallback((content?: string) => {
      onChange?.(content)
    }, []),
    1000
  )

  const handleChange = useCallback((data: { html: string; text: string }) => {
    setValue(data.text)
    triggerChange(data.text)
  }, [])

  if (isPreview) {
    return (
      <div className="custom-html-style">
        <ReactMarkdown
          rehypePlugins={[rehypeRaw]}
          remarkPlugins={[remarkCodeWrap(content), remarkGfm, remarkBreaks, remarkFrontmatter]}
          components={{
            code: CodeRender,
          }}>
          {content}
        </ReactMarkdown>
      </div>
    )
  }

  return (
    <MdEditor
      id={id}
      className={classNames('easy-coder-markdown-editor')}
      style={{ minHeight: '100%' }}
      value={value}
      onChange={handleChange}
      plugins={plugins}
      onImageUpload={async (file: File) => {
        const fileInfo = await dataCenter.uploadFile(file, true)

        return `${fileDownloadPrefix}/${fileInfo.token}`
      }}
      renderHTML={(text) => (
        <ReactMarkdown
          rehypePlugins={[rehypeRaw]}
          remarkPlugins={[remarkCodeWrap(text), remarkGfm, remarkBreaks, remarkFrontmatter]}
          components={{
            code: CodeRender,
          }}>
          {text}
        </ReactMarkdown>
      )}
    />
  )
}

export default memo(Editor, (prev, next) => {
  return prev.content === next.content && prev.isPreview === next.isPreview
})
