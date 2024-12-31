import { EasyCoderElement } from '@easy-coder/sdk/store'
import { GroupDecorator, SelectSetter } from '@easy-coder/sdk/design'

import Divider, { DividerProps } from '.'

const dividerMeta: EasyCoderElement.Desc<DividerProps> = {
  type: 'system_component_divider',
  label: '分割线',
  defaultAttr: {
    type: 'horizontal',
    orientation: 'center',
  },
  style: {
    style: {
      label: '样式',
      supportModels: ['background', 'height', 'margin', 'maxHeight', 'maxWidth', 'minHeight', 'minWidth', 'padding', 'transform', 'transition', 'width'],
    },
  },
  className: {
    className: {
      label: '样式名',
    },
  },
  attr: {
    type: {
      type: 'string',
      label: '方向',
      setter: SelectSetter,
      setterProps: {
        title: '方向',
        displayAs: 'button',
        options: [
          { value: 'horizontal', label: '水平' },
          { value: 'vertical', label: '垂直' },
        ],
      },
    },
    orientation: {
      type: 'string',
      label: '文字位置',
      setter: SelectSetter,
      setterProps: {
        title: '文字位置',
        displayAs: 'button',
        options: [
          { value: 'left', label: '左' },
          { value: 'center', label: '中' },
          { value: 'right', label: '右' },
        ],
      },
      visible: (props: DividerProps) => props.type !== 'vertical',
    },
    text: {
      type: 'string',
      label: '文字',
      visible: (props: DividerProps) => props.type !== 'vertical',
    },
  },
  attrDecorators: [
    {
      id: 'base',
      Render: GroupDecorator,
      props: {
        title: '基础属性',
      },
      childrenOfAttr: ['type', 'orientation', 'text'],
    },
  ],
  Render: Divider,
}

export default dividerMeta
