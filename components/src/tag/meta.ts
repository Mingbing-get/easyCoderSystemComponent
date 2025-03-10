import { EasyCoderElement } from '@easy-coder/sdk/store'
import { GroupDecorator, SelectSetter, ResetSwitchSetter, StringOrMultilingualSetter } from '@easy-coder/sdk/design'
import { i18n } from '@easy-coder/sdk/i18n'

import Tag, { TagProps } from '.'

const tagMeta: EasyCoderElement.Desc<TagProps> = {
  type: 'system_component_tag',
  label: {
    zh: '标签',
    en: 'Tag',
  },
  defaultAttr: {
    text: {
      zh: '标签',
      en: 'Tag',
    },
    size: 'default',
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
        'opacity',
        'zIndex',
        'position',
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
      label: {
        zh: '样式名',
        en: 'Classname',
      },
    },
  },
  attr: {
    text: {
      type: 'multilingual',
      label: {
        zh: '内容',
        en: 'Content',
      },
      setter: StringOrMultilingualSetter,
      setterProps: {
        title: i18n.translate({ zh: '内容', en: 'Content' }),
        size: 'mini',
      },
    },
    size: {
      type: 'string',
      label: {
        zh: '尺寸',
        en: 'Size',
      },
      setter: SelectSetter,
      setterProps: {
        title: i18n.translate({ zh: '尺寸', en: 'Size' }),
        options: [
          { value: 'small', label: i18n.translate({ zh: '小', en: 'Small' }) },
          { value: 'default', label: i18n.translate({ zh: '默认', en: 'Default' }) },
          { value: 'medium', label: i18n.translate({ zh: '中', en: 'Medium' }) },
          { value: 'large', label: i18n.translate({ zh: '大', en: 'Large' }) },
        ],
      },
    },
    bordered: {
      type: 'boolean',
      label: {
        zh: '显示边框',
        en: 'Show border',
      },
      disabledFx: true,
    },
    showIcon: {
      type: 'boolean',
      label: {
        zh: '显示图标',
        en: 'Show icon',
      },
      setter: ResetSwitchSetter,
      setterProps: {
        title: i18n.translate({ zh: '显示图标', en: 'Show icon' }),
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
        title: i18n.translate({ zh: '基础配置', en: 'Base setting' }),
      },
      childrenOfAttr: ['text', 'size', 'bordered', 'showIcon'],
    },
  ],
  slot: {
    iconRender: {
      label: {
        zh: '图标插槽',
        en: 'Icon slot',
      },
      defaultStyle: {
        padding: [],
      },
    },
  },
  Render: Tag,
}

export default tagMeta
