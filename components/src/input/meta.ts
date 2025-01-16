import { EasyCoderElement } from '@easy-coder/sdk/store'
import {
  EnumGroupSetter,
  GroupDecorator,
  LineDecorator,
  ModalConditionSetter,
  ModalMetaSetter,
  SelectSetter,
  onEnumDependencies,
  onModalDependencies,
  onModalConditionDependencies,
} from '@easy-coder/sdk/design'
import { variableTypeOptions } from '@easy-coder/sdk/variable'

import InputTypeSetter from './setter/inputTypeSetter'
import InputValueSetter from './setter/inputValueSetter'
import onInputValueDependencies from './setter/onInputValueDependencies'
import { createDefineFromProps } from './utils'
import Input, { InputProps, supportTypes } from '.'
import EnumDisabledSetter from './setter/enumDisabledSetter'

const inputMeta: EasyCoderElement.Desc<InputProps> = {
  type: 'system_component_input',
  label: '输入框',
  defaultAttr: {
    type: 'string',
    direction: 'row',
    size: 'default',
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
      label: '标签样式',
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
      label: '样式名',
    },
    labelClassName: {
      label: '标签样式名',
    },
  },
  attr: {
    type: {
      type: 'string',
      label: '输入框类型',
      setter: InputTypeSetter,
      setterProps: {
        title: '输入框类型',
        options: variableTypeOptions.filter((option) => supportTypes.includes(option.value as any)),
      },
      visible: (props: InputProps) => !props?.isInForm,
    },
    modalName: {
      type: 'string',
      label: '数据模型',
      setter: ModalMetaSetter,
      onDependencies: onModalDependencies,
      visible: (props: InputProps) => !props?.isInForm && (props?.type === 'lookup' || props?.type === 'multipleLookup'),
    },
    condition: {
      type: 'object',
      label: '过滤条件',
      prototype: {},
      setter: ModalConditionSetter,
      onDependencies: onModalConditionDependencies,
      setterProps: {
        title: '过滤条件',
        modalName: {
          _type: 'dynamic',
          fn: (props: InputProps) => props?.modalName?.name || '',
        },
      },
      visible: (props: InputProps) => (props?.type === 'lookup' || props?.type === 'multipleLookup') && !!props?.modalName,
    },
    enumGroupName: {
      type: 'string',
      label: '选项组',
      setter: EnumGroupSetter,
      onDependencies: onEnumDependencies,
      setterProps: {
        title: '选项组',
      },
      visible: (props: InputProps) => !props?.isInForm && (props?.type === 'enum' || props?.type === 'multipleEnum'),
    },
    disableEnumNames: {
      type: 'array',
      label: '可用选项',
      item: {
        type: 'string',
      },
      setter: EnumDisabledSetter,
      setterProps: {
        title: '可用选项',
        enumGroupName: {
          _type: 'dynamic',
          fn: (props: InputProps) => props?.enumGroupName || '',
        },
      },
      visible: (props: InputProps) => (props?.type === 'enum' || props?.type === 'multipleEnum') && !!props.enumGroupName,
    },
    maxLength: {
      type: 'number',
      label: '最多文件数',
      disabledFx: true,
      visible: (props: InputProps) => !props?.isInForm && props?.type === 'file',
    },
    label: {
      type: 'string',
      label: '标签',
    },
    extraText: {
      type: 'string',
      label: '提示文本',
    },
    disabled: {
      type: 'boolean',
      label: '是否禁用',
    },
    required: {
      type: 'boolean',
      label: '是否必填',
    },
    value: {
      type: 'string',
      label: '默认值',
      setter: InputValueSetter,
      onDependencies: onInputValueDependencies,
      setterProps: {
        label: '默认值',
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
      label: '方向',
      setter: SelectSetter,
      setterProps: {
        title: '方向',
        options: [
          { value: 'row', label: '横向' },
          { value: 'column', label: '纵向' },
        ],
      },
    },
    size: {
      type: 'string',
      label: '大小',
      setter: SelectSetter,
      setterProps: {
        title: '大小',
        options: [
          { value: 'mini', label: '极小' },
          { value: 'small', label: '小' },
          { value: 'default', label: '默认' },
          { value: 'large', label: '大' },
        ],
      },
    },

    isInForm: {
      type: 'boolean',
      label: '是否是表单的字段',
      setter: () => null,
    },
  },
  attrDecorators: [
    {
      id: 'define_config',
      Render: GroupDecorator,
      props: {
        title: '数据类型配置',
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
        title: '外观',
      },
      childrenOfAttr: ['direction', 'size'],
    },
  ],
  event: {
    onChange: {
      label: '值改变时',
      params: [async (props) => createDefineFromProps(props, { label: '值' })],
    },
  },
  export: {
    attr: {
      value: async (props) => createDefineFromProps(props, { label: '值' }),
      isDisabled: {
        type: 'boolean',
        label: '是否禁用',
      },
      hasError: {
        type: 'boolean',
        label: '是否有错误',
      },
    },
    event: {
      setValue: {
        label: '设置值',
        params: [async (props) => createDefineFromProps(props, { label: '新值' })],
      },
      setDisabled: {
        label: '设置禁用',
        params: [
          {
            type: 'boolean',
            label: '是否禁用',
          },
        ],
      },
      setExtraText: {
        label: '设置提示文本',
        params: [
          {
            type: 'string',
            label: '提示文本',
          },
        ],
      },
      setErrorText: {
        label: '设置错误文本',
        params: [
          {
            type: 'string',
            label: '错误文本',
          },
        ],
      },
    },
  },
  Render: Input,
}

export default inputMeta
