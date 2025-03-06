import { EasyCoderElement } from '@easy-coder/sdk/store'
import {
  EnumGroupSetter,
  GroupDecorator,
  LineDecorator,
  ModalConditionSetter,
  ModalMetaSetter,
  SelectSetter,
  StringOrMultilingualSetter,
  onEnumDependencies,
  onModalDependencies,
  onModalConditionDependencies,
} from '@easy-coder/sdk/design'
import { variableTypeOptions } from '@easy-coder/sdk/variable'
import { i18n } from '@easy-coder/sdk/i18n'

import InputTypeSetter from './setter/inputTypeSetter'
import InputValueSetter from './setter/inputValueSetter'
import onInputValueDependencies from './setter/onInputValueDependencies'
import { createDefineFromProps } from './utils'
import Input, { InputProps, supportTypes } from '.'
import EnumDisabledSetter from './setter/enumDisabledSetter'

const inputMeta: EasyCoderElement.Desc<InputProps> = {
  type: 'system_component_input',
  label: {
    zh: '输入框',
    en: 'Input',
  },
  defaultAttr: {
    type: 'string',
    direction: 'row',
    size: 'default',
  },
  style: {
    style: {
      label: {
        zh: '样式',
        en: 'Style',
      },
      supportModels: [
        'background',
        'borderColor',
        'borderRadius',
        'borderStyle',
        'borderWidth',
        'boxShadow',
        'boxSizing',
        'cursor',
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
    labelStyle: {
      label: {
        zh: '标签样式',
        en: 'Label Style',
      },
      supportModels: [
        'background',
        'borderColor',
        'borderRadius',
        'borderStyle',
        'borderWidth',
        'boxShadow',
        'boxSizing',
        'color',
        'cursor',
        'fontSize',
        'fontStyle',
        'fontWeight',
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
    labelClassName: {
      label: {
        zh: '标签样式名',
        en: 'Label classname',
      },
    },
  },
  attr: {
    type: {
      type: 'string',
      label: {
        zh: '输入框类型',
        en: 'Input type',
      },
      setter: InputTypeSetter,
      setterProps: {
        title: i18n.translate({ zh: '输入框类型', en: 'Input type' }),
        options: variableTypeOptions.filter((option) => supportTypes.includes(option.value as any)),
      },
      visible: (props: InputProps) => !props?.isInForm,
    },
    modalName: {
      type: 'string',
      label: {
        zh: '数据模型',
        en: 'Data model',
      },
      setter: ModalMetaSetter,
      onDependencies: onModalDependencies,
      visible: (props: InputProps) => !props?.isInForm && (props?.type === 'lookup' || props?.type === 'multipleLookup'),
    },
    condition: {
      type: 'object',
      label: {
        zh: '过滤条件',
        en: 'Filter condition',
      },
      prototype: {},
      setter: ModalConditionSetter,
      onDependencies: onModalConditionDependencies,
      setterProps: {
        title: i18n.translate({ zh: '过滤条件', en: 'Filter condition' }),
        modalName: {
          _type: 'dynamic',
          fn: (props: InputProps) => props?.modalName?.name || '',
        },
      },
      visible: (props: InputProps) => (props?.type === 'lookup' || props?.type === 'multipleLookup') && !!props?.modalName,
    },
    enumGroupName: {
      type: 'string',
      label: {
        zh: '选项组',
        en: 'Option group',
      },
      setter: EnumGroupSetter,
      onDependencies: onEnumDependencies,
      setterProps: {
        title: i18n.translate({ zh: '选项组', en: 'Option group' }),
      },
      visible: (props: InputProps) => !props?.isInForm && (props?.type === 'enum' || props?.type === 'multipleEnum'),
    },
    disableEnumNames: {
      type: 'array',
      label: {
        zh: '可用选项',
        en: 'Available options',
      },
      item: {
        type: 'string',
      },
      setter: EnumDisabledSetter,
      setterProps: {
        title: {
          zh: '可用选项',
          en: 'Available options',
        },
        enumGroupName: {
          _type: 'dynamic',
          fn: (props: InputProps) => props?.enumGroupName || '',
        },
      },
      visible: (props: InputProps) => (props?.type === 'enum' || props?.type === 'multipleEnum') && !!props.enumGroupName,
    },
    maxLength: {
      type: 'number',
      label: {
        zh: '最多文件数',
        en: 'Maximum number of files',
      },
      disabledFx: true,
      visible: (props: InputProps) => !props?.isInForm && props?.type === 'file',
    },
    label: {
      type: 'multilingual',
      label: {
        zh: '标签',
        en: 'Label',
      },
      setter: StringOrMultilingualSetter,
      setterProps: {
        title: i18n.translate({ zh: '标签', en: 'Label' }),
        size: 'mini',
      },
    },
    extraText: {
      type: 'multilingual',
      label: {
        zh: '提示文本',
        en: 'Extra text',
      },
      setter: StringOrMultilingualSetter,
      setterProps: {
        title: i18n.translate({ zh: '提示文本', en: 'Extra text' }),
        size: 'mini',
      },
    },
    disabled: {
      type: 'boolean',
      label: {
        zh: '是否禁用',
        en: 'Disabled',
      },
    },
    required: {
      type: 'boolean',
      label: {
        zh: '是否必填',
        en: 'Required',
      },
    },
    value: {
      type: 'string',
      label: {
        zh: '默认值',
        en: 'Default value',
      },
      setter: InputValueSetter,
      onDependencies: onInputValueDependencies,
      setterProps: {
        label: {
          zh: '默认值',
          en: 'Default value',
        },
        type: {
          _type: 'dynamic',
          fn: (props?: InputProps) => props?.type,
        },
        modalName: {
          _type: 'dynamic',
          fn: (props?: InputProps) => props?.modalName,
        },
        enumGroupName: {
          _type: 'dynamic',
          fn: (props?: InputProps) => props?.enumGroupName,
        },
        maxLength: {
          _type: 'dynamic',
          fn: (props?: InputProps) => props?.maxLength,
        },
      },
      visible: (props: InputProps) => !props?.isInForm,
    },

    direction: {
      type: 'string',
      label: {
        zh: '方向',
        en: 'Direction',
      },
      setter: SelectSetter,
      setterProps: {
        title: i18n.translate({ zh: '方向', en: 'Direction' }),
        options: [
          { value: 'row', label: i18n.translate({ zh: '横向', en: 'Horizontal' }) },
          { value: 'column', label: i18n.translate({ zh: '纵向', en: 'Vertical' }) },
        ],
      },
    },
    size: {
      type: 'string',
      label: {
        zh: '大小',
        en: 'Size',
      },
      setter: SelectSetter,
      setterProps: {
        title: i18n.translate({ zh: '大小', en: 'Size' }),
        options: [
          { value: 'mini', label: i18n.translate({ zh: '极小', en: 'Mini' }) },
          { value: 'small', label: i18n.translate({ zh: '小', en: 'Small' }) },
          { value: 'default', label: i18n.translate({ zh: '默认', en: 'Default' }) },
          { value: 'large', label: i18n.translate({ zh: '大', en: 'Large' }) },
        ],
      },
    },

    isInForm: {
      type: 'boolean',
      label: {
        zh: '是否是表单的字段',
        en: 'Is in form',
      },
      setter: () => null,
    },
  },
  attrDecorators: [
    {
      id: 'define_config',
      Render: GroupDecorator,
      props: {
        title: i18n.translate({ zh: '数据类型配置', en: 'Data type config' }),
      },
      childrenOfAttr: [
        'type',
        'modalName',
        'condition',
        'enumGroupName',
        'disableEnumNames',
        'maxLength',
        'label',
        'extraText',
        'disabled',
        'required',
        'value',
      ],
    },
    {
      id: 'line1',
      Render: LineDecorator,
    },
    {
      id: 'style_config',
      Render: GroupDecorator,
      props: {
        title: i18n.translate({ zh: '外观', en: 'Appearance' }),
      },
      childrenOfAttr: ['direction', 'size'],
    },
  ],
  event: {
    onChange: {
      label: {
        zh: '值改变时',
        en: 'On change',
      },
      params: [async (props) => createDefineFromProps(props, { label: { zh: '值', en: 'Value' } })],
    },
  },
  export: {
    attr: {
      value: async (props) => createDefineFromProps(props, { label: { zh: '值', en: 'Value' } }),
      isDisabled: {
        type: 'boolean',
        label: {
          zh: '是否禁用',
          en: 'Disabled',
        },
      },
      hasError: {
        type: 'boolean',
        label: {
          zh: '是否有错误',
          en: 'Has error',
        },
      },
    },
    event: {
      setValue: {
        label: {
          zh: '设置值',
          en: 'Set value',
        },
        params: [async (props) => createDefineFromProps(props, { label: { zh: '新值', en: 'New Value' } })],
      },
      setDisabled: {
        label: {
          zh: '设置禁用',
          en: 'Set disabled',
        },
        params: [
          {
            type: 'boolean',
            label: {
              zh: '是否禁用',
              en: 'Is disabled',
            },
          },
        ],
      },
      setExtraText: {
        label: {
          zh: '设置提示文本',
          en: 'Set extra text',
        },
        params: [
          {
            type: 'multilingual',
            label: {
              zh: '提示文本',
              en: 'Extra text',
            },
          },
        ],
      },
      setErrorText: {
        label: {
          zh: '设置错误文本',
          en: 'Set error text',
        },
        params: [
          {
            type: 'multilingual',
            label: {
              zh: '错误文本',
              en: 'Error text',
            },
          },
        ],
      },
    },
  },
  Render: Input,
}

export default inputMeta
