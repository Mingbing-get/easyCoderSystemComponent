import { EasyCoderElement } from '@easy-coder/sdk/store'

import Notification, { NotificationProps } from '.'

const notificationMeta: EasyCoderElement.Desc<NotificationProps> = {
  type: 'system_component_notification',
  label: '通知',
  style: {
    style: {
      label: '样式',
      supportModels: [
        'background',
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
      label: '样式名',
    },
  },
  attr: {
    showWhenReceive: {
      type: 'boolean',
      disabledFx: true,
      label: '收到通知弹窗',
    },
  },
  Render: Notification,
}

export default notificationMeta
