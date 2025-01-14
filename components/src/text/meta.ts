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
      supportModels: [
        'background',
        'borderColor',
        'borderRadius',
        'borderStyle',
        'borderWidth',
        'boxShadow',
        'boxSizing',
        'color',
        'cursor',
        'fontSize',
        'fontStyle',
        'fontWeight',
        'height',
        'margin',
        'maxHeight',
        'maxWidth',
        'minHeight',
        'minWidth',
        'outline',
        'padding',
        'transform',
        'transition',
        'width',
      ],
    },
  },
  attr: {
    text: {
      type: 'string',
      label: '内容',
    },
    maxLine: {
      type: 'number',
      label: '最大显示行数',
    },
    disabledPopover: {
      type: 'boolean',
      label: '是否禁止提示',
    },
  },
  event: {
    onClick: {
      label: '点击时',
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
