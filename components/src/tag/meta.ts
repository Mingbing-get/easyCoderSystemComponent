import { EasyCoderElement } from '@easy-coder/sdk/store'
import { GroupDecorator, SelectSetter, ResetSwitchSetter } from '@easy-coder/sdk/design'

import Tag, { TagProps } from '.'

const tagMeta: EasyCoderElement.Desc<TagProps> = {
  type: 'system_component_tag',
  label: '标签',
  defaultAttr: {
    text: '标签',
    size: 'default',
  },
  style: {
    style: {
      label: '样式',
      supportModels: [
        'background',
        'borderRadius',
        'color',
        'cursor',
        'fontSize',
        'fontStyle',
        'fontWeight',
        'margin',
        'padding',
        'transform',
        'transition',
        'boxShadow',
      ],
    },
  },
  className: {
    className: {
      label: '样式名',
    },
  },
  attr: {
    text: {
      type: 'string',
      label: '内容',
    },
    size: {
      type: 'string',
      label: '尺寸',
      setter: SelectSetter,
      setterProps: {
        title: '尺寸',
        options: [
          { value: 'small', label: '小' },
          { value: 'default', label: '默认' },
          { value: 'medium', label: '中' },
          { value: 'large', label: '大' },
        ],
      },
    },
    bordered: {
      type: 'boolean',
      label: '显示边框',
      disabledFx: true,
    },
    showIcon: {
      type: 'boolean',
      label: '显示图标',
      setter: ResetSwitchSetter,
      setterProps: {
        title: '显示图标',
        size: 'small',
        whenFalse: [{ key: 'iconRender', type: 'slot' }],
      },
    },
  },
  attrDecorators: [
    {
      id: 'data',
      Render: GroupDecorator,
      props: {
        title: '基础配置',
      },
      childrenOfAttr: ['text', 'size', 'bordered', 'showIcon'],
    },
  ],
  slot: {
    iconRender: {
      label: '图标插槽',
      defaultStyle: {
        padding: [],
      },
    },
  },
  Render: Tag,
}

export default tagMeta
