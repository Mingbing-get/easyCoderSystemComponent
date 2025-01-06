import { EasyCoderElement } from '@easy-coder/sdk/store'
import { GroupDecorator, LineDecorator, ResetSwitchSetter } from '@easy-coder/sdk/design'

import Rate, { RateProps } from '.'

const rateMeta: EasyCoderElement.Desc<RateProps> = {
  type: 'system_component_rate',
  label: '评分',
  defaultAttr: {
    count: 5,
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
    defaultValue: {
      type: 'number',
      label: '默认值',
    },
    count: {
      type: 'number',
      label: '星的总数',
    },
    tooltips: {
      type: 'array',
      label: '每项提示',
      item: {
        type: 'string',
      },
    },

    grading: {
      type: 'boolean',
      label: '使用笑脸分级',
      setter: ResetSwitchSetter,
      setterProps: {
        title: '使用笑脸分级',
        size: 'small',
        whenFalse: [
          { key: 'useCustomCharacter', type: 'attr' },
          { key: 'characterRender', type: 'slot' },
        ],
      },
    },
    useCustomCharacter: {
      type: 'boolean',
      label: '使用自定义字符',
      setter: ResetSwitchSetter,
      setterProps: {
        title: '使用自定义字符',
        size: 'small',
        whenFalse: [{ key: 'characterRender', type: 'slot' }],
      },
      visible: (props: RateProps) => !props.grading,
    },

    allowClear: {
      type: 'boolean',
      label: '是否允许清除',
      disabledFx: true,
    },
    allowHalf: {
      type: 'boolean',
      label: '是否允许半选',
      disabledFx: true,
    },
    disabled: {
      type: 'boolean',
      label: '是否禁用',
    },
  },
  attrDecorators: [
    {
      id: 'data',
      Render: GroupDecorator,
      props: {
        title: '数据设置',
      },
      childrenOfAttr: ['defaultValue', 'count', 'tooltips', 'disabled'],
    },
    {
      id: 'line1',
      Render: LineDecorator,
    },
    {
      id: 'chart',
      Render: GroupDecorator,
      props: {
        title: '字符设置',
      },
      childrenOfAttr: ['grading', 'useCustomCharacter'],
    },
    {
      id: 'line2',
      Render: LineDecorator,
    },
    {
      id: 'pro',
      Render: GroupDecorator,
      props: {
        title: '功能设置',
      },
      childrenOfAttr: ['allowClear', 'allowHalf'],
    },
  ],
  event: {
    onChange: {
      label: '值改变时',
      params: [{ type: 'number', label: '新值' }],
    },
    onHoverChange: {
      label: '鼠标经过时',
      params: [{ type: 'number', label: '数值' }],
    },
  },
  slot: {
    characterRender: {
      label: '字符渲染',
      defaultStyle: {
        padding: [],
      },
      payload: {
        index: {
          type: 'number',
          label: '顺序',
        },
      },
    },
  },
  export: {
    attr: {
      value: {
        type: 'number',
        label: '值',
      },
      isDisabled: {
        type: 'boolean',
        label: '是否禁用',
      },
    },
    event: {
      setValue: {
        label: '设置值',
        params: [{ type: 'number', label: '新值' }],
      },
      setDisabled: {
        label: '设置是否禁用',
        params: [{ type: 'boolean', label: '是否禁用' }],
      },
    },
  },
  Render: Rate,
}

export default rateMeta
