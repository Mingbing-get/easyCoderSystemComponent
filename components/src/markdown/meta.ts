import { EasyCoderElement } from '@easy-coder/sdk/store'

import ContentOnDependencies from './contentOnDependencies'
import Markdown, { MarkdownProps } from '.'

const markdownMeta: EasyCoderElement.Desc<MarkdownProps> = {
  type: 'system_component_markdown',
  label: {
    zh: 'markdown',
    en: 'markdown',
  },
  style: {
    style: {
      label: {
        zh: '样式',
        en: 'style',
      },
      supportModels: [
        'borderColor',
        'borderRadius',
        'borderStyle',
        'borderWidth',
        'boxShadow',
        'boxSizing',
        'height',
        'width',
        'maxHeight',
        'minHeight',
        'maxWidth',
        'minWidth',
        'position',
        'opacity',
        'outline',
        'padding',
        'margin',
        'transform',
        'transition',
        'zIndex',
      ],
    },
  },
  attr: {
    content: {
      label: {
        zh: '内容',
        en: 'content',
      },
      type: 'text',
      setter: () => null,
      onDependencies: ContentOnDependencies,
    },
  },
  Render: Markdown,
}

export default markdownMeta
