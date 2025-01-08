import { EasyCoderElement } from '@easy-coder/sdk/store'

import PersonalCenter, { PersonalCenterProps } from '.'

const personalCenterMeta: EasyCoderElement.Desc<PersonalCenterProps> = {
  type: 'system_component_personalCenter',
  label: '个人中心',
  style: {
    style: {
      label: '样式',
      defaultValue: {
        cursor: 'pointer',
      },
      supportModels: [
        'background',
        'cursor',
        'width',
        'height',
        'margin',
        'padding',
        'maxHeight',
        'maxWidth',
        'minWidth',
        'minHeight',
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
  Render: PersonalCenter,
}

export default personalCenterMeta
