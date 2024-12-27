import { EasyCoderElement } from '@easy-coder/sdk/store'
import { GroupDecorator, LineDecorator, SelectSetter } from '@easy-coder/sdk/design'

import ResetSwitchSetter from './setter/resetSwitchSetter'
import Alert, { AlertUiProps } from '.'

const alertMeta: EasyCoderElement.Desc<AlertUiProps> = {
  type: 'system_component_alert',
  label: '提示',
  defaultAttr: {
    type: 'info',
    title: '标题',
    content: '内容',
    showIcon: true,
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
      label: '样式名',
    },
  },
  attr: {
    type: {
      type: 'string',
      label: '类型',
      required: true,
      setter: SelectSetter,
      setterProps: {
        title: '类型',
        options: [
          { value: 'info', label: '信息' },
          { value: 'success', label: '成功' },
          { value: 'warning', label: '警告' },
          { value: 'error', label: '错误' },
        ],
      },
    },

    useCustomTitle: {
      type: 'boolean',
      label: '自定义标题',
      setter: ResetSwitchSetter,
      setterProps: {
        title: '自定义标题',
        size: 'small',
        whenTrue: [{ key: 'title', type: 'attr', resetValue: '标题' }],
        whenFalse: [{ key: 'titleRender', type: 'slot' }],
      },
    },
    title: {
      type: 'string',
      label: '标题',
      visible: (props: AlertUiProps) => !props.useCustomTitle,
    },

    useCustomContent: {
      type: 'boolean',
      label: '自定义内容',
      setter: ResetSwitchSetter,
      setterProps: {
        title: '自定义内容',
        size: 'small',
        whenTrue: [{ key: 'content', type: 'attr', resetValue: '内容' }],
        whenFalse: [{ key: 'contentRender', type: 'slot' }],
      },
    },
    content: {
      type: 'string',
      label: '内容',
      visible: (props: AlertUiProps) => !props.useCustomContent,
    },

    showIcon: {
      type: 'boolean',
      label: '显示图标',
      setter: ResetSwitchSetter,
      setterProps: {
        title: '显示图标',
        size: 'small',
        whenFalse: [
          { key: 'useCustomIcon', type: 'attr' },
          { key: 'iconRender', type: 'slot' },
        ],
      },
    },
    useCustomIcon: {
      type: 'boolean',
      label: '自定义图标',
      setter: ResetSwitchSetter,
      setterProps: {
        title: '自定义图标',
        size: 'small',
        whenFalse: [{ key: 'iconRender', type: 'slot' }],
      },
      visible: (props: AlertUiProps) => props.showIcon,
    },

    closable: {
      type: 'boolean',
      label: '是否可关闭',
      setter: ResetSwitchSetter,
      setterProps: {
        title: '是否可关闭',
        size: 'small',
        whenFalse: [
          { key: 'useCustomCloseIcon', type: 'attr' },
          { key: 'closeIconRender', type: 'slot' },
        ],
      },
    },
    useCustomCloseIcon: {
      type: 'boolean',
      label: '自定义关闭图标',
      setter: ResetSwitchSetter,
      setterProps: {
        title: '自定义关闭图标',
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
        title: '基础配置',
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
        title: '标题配置',
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
        title: '内容配置',
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
        title: '图标配置',
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
        title: '关闭图标配置',
      },
      childrenOfAttr: ['closable', 'useCustomCloseIcon'],
    },
  ],
  slot: {
    titleRender: {
      label: '标题插槽',
      defaultStyle: {
        padding: [],
      },
    },
    contentRender: {
      label: '内容插槽',
      defaultStyle: {
        padding: [],
      },
    },
    iconRender: {
      label: '图标插槽',
      defaultStyle: {
        padding: [],
      },
    },
    closeIconRender: {
      label: '关闭图标插槽',
      defaultStyle: {
        padding: [],
      },
    },
  },
  event: {
    onClose: {
      label: '关闭时',
    },
    afterClose: {
      label: '关闭后',
    },
  },
  Render: Alert,
}

export default alertMeta
