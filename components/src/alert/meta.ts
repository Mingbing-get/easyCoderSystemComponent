import { EasyCoderElement } from '@easy-coder/sdk/store'
import { GroupDecorator, LineDecorator, SelectSetter, ResetSwitchSetter, StringOrMultilingualSetter } from '@easy-coder/sdk/design'
import { i18n } from '@easy-coder/sdk/i18n'

import Alert, { AlertUiProps } from '.'

const alertMeta: EasyCoderElement.Desc<AlertUiProps> = {
  type: 'system_component_alert',
  label: {
    zh: '提示',
    en: 'Alert',
  },
  defaultAttr: {
    type: 'info',
    title: {
      zh: '标题',
      en: 'Title',
    },
    content: {
      zh: '内容',
      en: 'Content',
    },
    showIcon: true,
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
        'borderColor',
        'borderRadius',
        'borderStyle',
        'borderWidth',
        'boxShadow',
        'height',
        'margin',
        'maxHeight',
        'maxWidth',
        'minHeight',
        'minWidth',
        'outline',
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
        zh: '类型',
        en: 'Type',
      },
      required: true,
      setter: SelectSetter,
      setterProps: {
        title: i18n.translate({ zh: '类型', en: 'Type' }),
        options: [
          { value: 'info', label: i18n.translate({ zh: '信息', en: 'Info' }) },
          { value: 'success', label: i18n.translate({ zh: '成功', en: 'Success' }) },
          { value: 'warning', label: i18n.translate({ zh: '警告', en: 'Warning' }) },
          { value: 'error', label: i18n.translate({ zh: '错误', en: 'Error' }) },
        ],
      },
    },

    useCustomTitle: {
      type: 'boolean',
      label: {
        zh: '自定义标题',
        en: 'Custom Title',
      },
      setter: ResetSwitchSetter,
      setterProps: {
        title: i18n.translate({ zh: '自定义标题', en: 'Custom title' }),
        size: 'small',
        whenTrue: [{ key: 'title', type: 'attr', resetValue: '标题' }],
        whenFalse: [{ key: 'titleRender', type: 'slot' }],
      },
    },
    title: {
      type: 'string',
      label: {
        zh: '标题',
        en: 'Title',
      },
      setter: StringOrMultilingualSetter,
      setterProps: {
        title: i18n.translate({ zh: '标题', en: 'Title' }),
        size: 'mini',
      },
      visible: (props: AlertUiProps) => !props.useCustomTitle,
    },

    useCustomContent: {
      type: 'boolean',
      label: {
        zh: '自定义内容',
        en: 'Custom content',
      },
      setter: ResetSwitchSetter,
      setterProps: {
        title: i18n.translate({ zh: '自定义内容', en: 'Custom content' }),
        size: 'small',
        whenTrue: [{ key: 'content', type: 'attr', resetValue: '内容' }],
        whenFalse: [{ key: 'contentRender', type: 'slot' }],
      },
    },
    content: {
      type: 'string',
      label: {
        zh: '内容',
        en: 'Content',
      },
      setter: StringOrMultilingualSetter,
      setterProps: {
        title: i18n.translate({ zh: '内容', en: 'Content' }),
        size: 'mini',
      },
      visible: (props: AlertUiProps) => !props.useCustomContent,
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
        whenFalse: [
          { key: 'useCustomIcon', type: 'attr' },
          { key: 'iconRender', type: 'slot' },
        ],
      },
    },
    useCustomIcon: {
      type: 'boolean',
      label: {
        zh: '自定义图标',
        en: 'Custom icon',
      },
      setter: ResetSwitchSetter,
      setterProps: {
        title: i18n.translate({ zh: '自定义图标', en: 'Custom icon' }),
        size: 'small',
        whenFalse: [{ key: 'iconRender', type: 'slot' }],
      },
      visible: (props: AlertUiProps) => props.showIcon,
    },

    closable: {
      type: 'boolean',
      label: {
        zh: '是否可关闭',
        en: 'Is closable',
      },
      setter: ResetSwitchSetter,
      setterProps: {
        title: i18n.translate({ zh: '是否可关闭', en: 'Is closable' }),
        size: 'small',
        whenFalse: [
          { key: 'useCustomCloseIcon', type: 'attr' },
          { key: 'closeIconRender', type: 'slot' },
        ],
      },
    },
    useCustomCloseIcon: {
      type: 'boolean',
      label: {
        zh: '自定义关闭图标',
        en: 'Custom close icon',
      },
      setter: ResetSwitchSetter,
      setterProps: {
        title: i18n.translate({ zh: '自定义关闭图标', en: 'Custom close icon' }),
        size: 'small',
        whenFalse: [{ key: 'closeIconRender', type: 'slot' }],
      },
      visible: (props: AlertUiProps) => props.closable,
    },
  },
  attrDecorators: [
    {
      id: 'type',
      Render: GroupDecorator,
      props: {
        title: i18n.translate({ zh: '基础配置', en: 'Basic configuration' }),
      },
      childrenOfAttr: ['type'],
    },
    {
      id: 'line1',
      Render: LineDecorator,
    },
    {
      id: 'title',
      Render: GroupDecorator,
      props: {
        title: i18n.translate({ zh: '标题配置', en: 'Title configuration' }),
      },
      childrenOfAttr: ['title', 'useCustomTitle'],
    },
    {
      id: 'line2',
      Render: LineDecorator,
    },
    {
      id: 'content',
      Render: GroupDecorator,
      props: {
        title: i18n.translate({ zh: '内容配置', en: 'Content configuration' }),
      },
      childrenOfAttr: ['content', 'useCustomContent'],
    },
    {
      id: 'line3',
      Render: LineDecorator,
    },
    {
      id: 'icon',
      Render: GroupDecorator,
      props: {
        title: i18n.translate({ zh: '图标配置', en: 'Icon configuration' }),
      },
      childrenOfAttr: ['showIcon', 'useCustomIcon'],
    },
    {
      id: 'line4',
      Render: LineDecorator,
    },
    {
      id: 'closeIcon',
      Render: GroupDecorator,
      props: {
        title: i18n.translate({ zh: '关闭图标配置', en: 'Close icon configuration' }),
      },
      childrenOfAttr: ['closable', 'useCustomCloseIcon'],
    },
  ],
  slot: {
    titleRender: {
      label: {
        zh: '标题插槽',
        en: 'Title slot',
      },
      defaultStyle: {
        padding: [],
      },
    },
    contentRender: {
      label: {
        zh: '内容插槽',
        en: 'Content slot',
      },
      defaultStyle: {
        padding: [],
      },
    },
    iconRender: {
      label: {
        zh: '图标插槽',
        en: 'Icon slot',
      },
      defaultStyle: {
        padding: [],
      },
    },
    closeIconRender: {
      label: {
        zh: '关闭图标插槽',
        en: 'Close icon slot',
      },
      defaultStyle: {
        padding: [],
      },
    },
  },
  event: {
    onClose: {
      label: {
        zh: '关闭时',
        en: 'On close',
      },
    },
    afterClose: {
      label: {
        zh: '关闭后',
        en: 'After close',
      },
    },
  },
  Render: Alert,
}

export default alertMeta
