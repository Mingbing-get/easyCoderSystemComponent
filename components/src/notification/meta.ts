import { EasyCoderElement } from '@easy-coder/sdk/store'

import Notification, { NotificationProps } from '.'

const notificationMeta: EasyCoderElement.Desc<NotificationProps> = {
  type: 'system_component_notification',
  label: {
    zh: '通知',
    en: 'Notification',
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
        'borderColor',
        'borderRadius',
        'borderStyle',
        'borderWidth',
        'color',
        'cursor',
        'fontSize',
        'fontStyle',
        'fontWeight',
        'margin',
        'outline',
        'padding',
        'transform',
        'transition',
      ],
      defaultValue: {
        fontSize: { value: 20, unit: 'px' },
        cursor: 'pointer',
      },
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
    showWhenReceive: {
      type: 'boolean',
      disabledFx: true,
      label: {
        zh: '收到通知弹窗',
        en: 'Received notification pop-up window',
      },
    },
  },
  Render: Notification,
}

export default notificationMeta
