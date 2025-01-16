import { EasyCoderElement } from '@easy-coder/sdk/store'
import { EnumGroupSetter, GroupDecorator, LineDecorator, ModalMetaSetter, SelectSetter, onEnumDependencies, onModalDependencies } from '@easy-coder/sdk/design'
import { variableTypeOptions } from '@easy-coder/sdk/variable'

import InputTypeSetter from '../input/setter/inputTypeSetter'
import InputValueSetter from '../input/setter/inputValueSetter'
import onInputValueDependencies from '../input/setter/onInputValueDependencies'
import { supportTypes } from '../input'
import { createDefineFromProps } from '../input/utils'
import Display, { DisplayProps } from '.'

const displayMeta: EasyCoderElement.Desc<DisplayProps> = {
  type: 'system_component_display',
  label: '展示',
  defaultAttr: {
    type: 'string',
    direction: 'row',
    tagSize: 'default',
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
    valueStyle: {
      label: '值样式',
      supportModels: [
        'background',
        'borderColor',
        'borderRadius',
        'borderStyle',
        'borderWidth',
        'boxShadow',
        'color',
        'cursor',
        'fontSize',
        'fontStyle',
        'fontWeight',
        'margin',
        'outline',
        'padding',
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
    valueClassName: {
      label: '值样式名',
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
    },
    modalName: {
      type: 'string',
      label: '数据模型',
      setter: ModalMetaSetter,
      onDependencies: onModalDependencies,
      visible: (props) => props?.type === 'lookup' || props?.type === 'multipleLookup',
    },
    enumGroupName: {
      type: 'string',
      label: '选项组',
      setter: EnumGroupSetter,
      onDependencies: onEnumDependencies,
      setterProps: {
        title: '选项组',
      },
      visible: (props) => props?.type === 'enum' || props?.type === 'multipleEnum',
    },
    label: {
      type: 'string',
      label: '标签',
    },
    value: {
      type: 'string',
      label: '值',
      setter: InputValueSetter,
      onDependencies: onInputValueDependencies,
      setterProps: {
        label: '值',
        type: {
          _type: 'dynamic',
          fn: (props?: DisplayProps) => props?.type,
        },
        modalName: {
          _type: 'dynamic',
          fn: (props?: DisplayProps) => props?.modalName,
        },
        enumGroupName: {
          _type: 'dynamic',
          fn: (props?: DisplayProps) => props?.enumGroupName,
        },
      },
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
    tagSize: {
      type: 'string',
      label: '大小',
      setter: SelectSetter,
      setterProps: {
        title: '大小',
        options: [
          { value: 'small', label: '小' },
          { value: 'medium', label: '中' },
          { value: 'default', label: '默认' },
          { value: 'large', label: '大' },
        ],
      },
      visible: (props?: DisplayProps) => ['boolean', 'enum', 'lookup', 'multipleEnum', 'multipleLookup'].includes(props?.type),
    },
  },
  attrDecorators: [
    {
      id: 'define_config',
      Render: GroupDecorator,
      props: {
        title: '数据类型配置',
      },
      childrenOfAttr: ['type', 'modalName', 'enumGroupName', 'label', 'value'],
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
      childrenOfAttr: ['direction', 'tagSize'],
    },
  ],
  event: {
    onClick: {
      label: '点击时',
      params: [async (props) => createDefineFromProps(props, { label: '值' })],
    },
  },
  Render: Display,
}

export default displayMeta
