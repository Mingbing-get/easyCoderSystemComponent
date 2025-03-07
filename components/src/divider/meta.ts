import { EasyCoderElement } from '@easy-coder/sdk/store'
import { GroupDecorator, SelectSetter, StringOrMultilingualSetter } from '@easy-coder/sdk/design'
import { i18n } from '@easy-coder/sdk/i18n'

import Divider, { DividerProps } from '.'

const dividerMeta: EasyCoderElement.Desc<DividerProps> = {
  type: 'system_component_divider',
  label: {
    zh: '分割线',
    en: 'Divider',
  },
  defaultAttr: {
    type: 'horizontal',
    orientation: 'center',
  },
  style: {
    style: {
      label: {
        zh: '样式',
        en: 'Style',
      },
      supportModels: [
        'background',
        'filter',
        'position',
        'height',
        'margin',
        'maxHeight',
        'maxWidth',
        'minHeight',
        'minWidth',
        'padding',
        'transform',
        'transition',
        'width',
      ],
    },
  },
  className: {
    className: {
      label: {
        zh: '样式名',
        en: 'Classname',
      },
    },
  },
  attr: {
    type: {
      type: 'string',
      label: {
        zh: '方向',
        en: 'Direction',
      },
      setter: SelectSetter,
      setterProps: {
        title: i18n.translate({ zh: '方向', en: 'Direction' }),
        displayAs: 'button',
        options: [
          { value: 'horizontal', label: i18n.translate({ zh: '水平', en: 'Horizontal' }) },
          { value: 'vertical', label: i18n.translate({ zh: '垂直', en: 'Vertical' }) },
        ],
      },
    },
    orientation: {
      type: 'string',
      label: {
        zh: '文字位置',
        en: 'Text location',
      },
      setter: SelectSetter,
      setterProps: {
        title: i18n.translate({ zh: '文字位置', en: 'Text location' }),
        displayAs: 'button',
        options: [
          { value: 'left', label: i18n.translate({ zh: '左', en: 'Left' }) },
          { value: 'center', label: i18n.translate({ zh: '中', en: 'Center' }) },
          { value: 'right', label: i18n.translate({ zh: '右', en: 'Right' }) },
        ],
      },
      visible: (props: DividerProps) => props.type !== 'vertical',
    },
    text: {
      type: 'multilingual',
      label: {
        zh: '文字',
        en: 'Text',
      },
      setter: StringOrMultilingualSetter,
      setterProps: {
        title: i18n.translate({ zh: '文字', en: 'Text' }),
        size: 'mini',
      },
      visible: (props: DividerProps) => props.type !== 'vertical',
    },
  },
  attrDecorators: [
    {
      id: 'base',
      Render: GroupDecorator,
      props: {
        title: i18n.translate({ zh: '基础属性', en: 'Base attributes' }),
      },
      childrenOfAttr: ['type', 'orientation', 'text'],
    },
  ],
  Render: Divider,
}

export default dividerMeta
