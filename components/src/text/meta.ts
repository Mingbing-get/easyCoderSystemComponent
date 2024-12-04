import { EasyCoderElement } from '@easy-coder/sdk/store'

import Text, { TextProps } from '.'

const textMeta: EasyCoderElement.Desc<TextProps> = {
  type: 'system_component_text',
  label: '文本',
  defaultAttr: {
    text: '内容',
  },
  className: {
    className: {
      label: '样式名',
    },
  },
  style: {
    style: {
      label: '样式',
    },
  },
  attr: {
    text: {
      type: 'string',
      label: '内容',
    },
  },
  export: {
    attr: {
      text: {
        type: 'string',
        label: '文本内容',
      },
    },
    event: {
      setText: {
        params: [{ type: 'text', label: '新值' }],
        label: '修改变量值',
      },
    },
  },
  Render: Text,
}

export default textMeta
