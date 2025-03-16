import { EasyCoderElement } from '@easy-coder/sdk/store'

import PersonalCenter, { PersonalCenterProps } from '.'

const personalCenterMeta: EasyCoderElement.Desc<PersonalCenterProps> = {
  type: 'system_component_personalCenter',
  label: {
    zh: '个人中心',
    en: 'Personal center',
  },
  style: {
    style: {
      label: {
        zh: '样式',
        en: 'Style',
      },
      defaultValue: {
        cursor: 'pointer',
      },
      supportModels: [
        'background',
        'backgroundClip',
        'filter',
        'opacity',
        'zIndex',
        'position',
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
      label: {
        zh: '样式名',
        en: 'Classname',
      },
    },
  },
  Render: PersonalCenter,
}

export default personalCenterMeta
