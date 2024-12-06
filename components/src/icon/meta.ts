import { EasyCoderElement } from '@easy-coder/sdk/store'

import IconPickSetter from './iconPickSetter'
import Icon, { IconProps } from '.'

const iconMeta: EasyCoderElement.Desc<IconProps> = {
  type: 'system_component_icon',
  label: '图标',
  defaultAttr: {
    iconName: 'FaPlus',
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
      label: '样式名',
    },
  },
  attr: {
    iconName: {
      type: 'string',
      required: true,
      label: '图标',
      setter: IconPickSetter,
      setterProps: {
        title: '图标',
      },
    },
  },
  Render: Icon,
}

export default iconMeta
