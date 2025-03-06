import { EasyCoderElement } from '@easy-coder/sdk/store'
import { i18n } from '@easy-coder/sdk/i18n'

import IconPickSetter from './iconPickSetter'
import Icon, { IconProps } from '.'

const iconMeta: EasyCoderElement.Desc<IconProps> = {
  type: 'system_component_icon',
  label: {
    zh: '图标',
    en: 'Icon',
  },
  defaultAttr: {
    iconName: 'FaPlus',
  },
  style: {
    style: {
      label: {
        zh: '样式',
        en: 'style',
      },
      supportModels: [
        'background',
        'borderColor',
        'borderRadius',
        'borderStyle',
        'borderWidth',
        'boxShadow',
        'color',
        'cursor',
        'fontSize',
        'fontWeight',
        'margin',
        'outline',
        'padding',
        'transform',
        'transition',
      ],
    },
  },
  className: {
    className: {
      label: {
        zh: '样式名',
        en: 'classname',
      },
    },
  },
  attr: {
    iconName: {
      type: 'string',
      required: true,
      label: {
        zh: '图标',
        en: 'Icon',
      },
      setter: IconPickSetter,
      setterProps: {
        title: i18n.translate({ zh: '图标', en: 'Icon' }),
      },
    },
  },
  Render: Icon,
}

export default iconMeta
