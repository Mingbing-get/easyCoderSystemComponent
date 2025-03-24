import { EasyCoderElement } from '@easy-coder/sdk/store'
import { GroupDecorator, LineDecorator, ResetSwitchSetter } from '@easy-coder/sdk/design'
import { i18n } from '@easy-coder/sdk/i18n'

import Rate, { RateProps } from '.'

const rateMeta: EasyCoderElement.Desc<RateProps> = {
  type: 'system_component_rate',
  label: {
    zh: '评分',
    en: 'Rate',
  },
  defaultAttr: {
    count: 5,
  },
  style: {
    style: {
      label: {
        zh: '样式',
        en: 'Style',
      },
      supportModels: [
        'flex',
        'background',
        'backgroundClip',
        'filter',
        'opacity',
        'zIndex',
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
    defaultValue: {
      type: 'number',
      label: {
        zh: '默认值',
        en: 'Default value',
      },
    },
    count: {
      type: 'number',
      label: {
        zh: '星的总数',
        en: 'Total of Star',
      },
    },
    tooltips: {
      type: 'array',
      label: {
        zh: '每项提示',
        en: 'Tip of item',
      },
      item: {
        type: 'multilingual',
      },
    },

    grading: {
      type: 'boolean',
      label: {
        zh: '使用笑脸分级',
        en: 'Use smiley face grading',
      },
      setter: ResetSwitchSetter,
      setterProps: {
        title: i18n.translate({ zh: '使用笑脸分级', en: 'Use smiley face grading' }),
        size: 'small',
        whenFalse: [
          { key: 'useCustomCharacter', type: 'attr' },
          { key: 'characterRender', type: 'slot' },
        ],
      },
    },
    useCustomCharacter: {
      type: 'boolean',
      label: {
        zh: '使用自定义字符',
        en: 'Use custom characters',
      },
      setter: ResetSwitchSetter,
      setterProps: {
        title: i18n.translate({ zh: '使用自定义字符', en: 'Use custom characters' }),
        size: 'small',
        whenFalse: [{ key: 'characterRender', type: 'slot' }],
      },
      visible: (props: RateProps) => !props.grading,
    },

    allowClear: {
      type: 'boolean',
      label: {
        zh: '是否允许清除',
        en: 'Allow clearing',
      },
      disabledFx: true,
    },
    allowHalf: {
      type: 'boolean',
      label: {
        zh: '是否允许半选',
        en: 'Is half selection allowed',
      },
      disabledFx: true,
    },
    disabled: {
      type: 'boolean',
      label: {
        zh: '是否禁用',
        en: 'Is disabled',
      },
    },
  },
  attrDecorators: [
    {
      id: 'data',
      Render: GroupDecorator,
      props: {
        title: i18n.translate({ zh: '数据设置', en: 'Data setting' }),
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
        title: i18n.translate({ zh: '字符设置', en: 'Chart setting' }),
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
        title: i18n.translate({ zh: '功能设置', en: 'Function setting' }),
      },
      childrenOfAttr: ['allowClear', 'allowHalf'],
    },
  ],
  event: {
    onChange: {
      label: {
        zh: '值改变时',
        en: 'On change',
      },
      params: [{ type: 'number', label: { zh: '新值', en: 'New value' } }],
    },
    onHoverChange: {
      label: {
        zh: '鼠标经过时',
        en: 'When the mouse passes by',
      },
      params: [{ type: 'number', label: { zh: '新值', en: 'New value' } }],
    },
  },
  slot: {
    characterRender: {
      label: {
        zh: '字符渲染',
        en: 'Character rendering',
      },
      defaultStyle: {
        padding: [],
      },
      payload: {
        index: {
          type: 'number',
          label: {
            zh: '顺序',
            en: 'Order',
          },
        },
      },
    },
  },
  export: {
    attr: {
      value: {
        type: 'number',
        label: {
          zh: '值',
          en: 'Value',
        },
      },
      isDisabled: {
        type: 'boolean',
        label: {
          zh: '是否禁用',
          en: 'Is disabled',
        },
      },
    },
    event: {
      setValue: {
        label: {
          zh: '设置值',
          en: 'Set value',
        },
        params: [{ type: 'number', label: { zh: '新值', en: 'New value' } }],
      },
      setDisabled: {
        label: {
          zh: '设置是否禁用',
          en: 'Set disabled',
        },
        params: [{ type: 'boolean', label: { zh: '是否禁用', en: 'Is disabled' } }],
      },
    },
  },
  Render: Rate,
}

export default rateMeta
