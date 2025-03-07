import { EasyCoderElement } from '@easy-coder/sdk/store'
import {
  EnumGroupSetter,
  GroupDecorator,
  LineDecorator,
  ModalMetaSetter,
  SelectSetter,
  StringOrMultilingualSetter,
  onEnumDependencies,
  onModalDependencies,
} from '@easy-coder/sdk/design'
import { variableTypeOptions } from '@easy-coder/sdk/variable'
import { i18n } from '@easy-coder/sdk/i18n'

import InputTypeSetter from '../input/setter/inputTypeSetter'
import InputValueSetter from '../input/setter/inputValueSetter'
import onInputValueDependencies from '../input/setter/onInputValueDependencies'
import { supportTypes } from '../input'
import { createDefineFromProps } from '../input/utils'
import Display, { DisplayProps } from '.'

const displayMeta: EasyCoderElement.Desc<DisplayProps> = {
  type: 'system_component_display',
  label: {
    zh: '展示',
    en: 'Display',
  },
  defaultAttr: {
    type: 'string',
    direction: 'row',
    tagSize: 'default',
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
        en: 'Label style',
      },
      supportModels: [
        'background',
        'filter',
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
      label: {
        zh: '值样式',
        en: 'Value style',
      },
      supportModels: [
        'background',
        'filter',
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
    valueClassName: {
      label: {
        zh: '值样式名',
        en: 'Value classname',
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
    },
    modalName: {
      type: 'string',
      label: {
        zh: '数据模型',
        en: 'Data modal',
      },
      setter: ModalMetaSetter,
      onDependencies: onModalDependencies,
      visible: (props) => props?.type === 'lookup' || props?.type === 'multipleLookup',
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
      visible: (props) => props?.type === 'enum' || props?.type === 'multipleEnum',
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
    value: {
      type: 'string',
      label: {
        zh: '值',
        en: 'Value',
      },
      setter: InputValueSetter,
      onDependencies: onInputValueDependencies,
      setterProps: {
        label: i18n.translate({ zh: '值', en: 'Value' }),
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
      label: {
        zh: '方向',
        en: 'Direction',
      },
      setter: SelectSetter,
      setterProps: {
        title: i18n.translate({ zh: '方向', en: 'Direction' }),
        options: [
          { value: 'row', label: i18n.translate({ zh: '横向', en: 'Row' }) },
          { value: 'column', label: i18n.translate({ zh: '纵向', en: 'Column' }) },
        ],
      },
    },
    tagSize: {
      type: 'string',
      label: {
        zh: '大小',
        en: 'Size',
      },
      setter: SelectSetter,
      setterProps: {
        title: i18n.translate({ zh: '大小', en: 'Size' }),
        options: [
          { value: 'small', label: i18n.translate({ zh: '小', en: 'Small' }) },
          { value: 'medium', label: i18n.translate({ zh: '中', en: 'Medium' }) },
          { value: 'default', label: i18n.translate({ zh: '默认', en: 'Default' }) },
          { value: 'large', label: i18n.translate({ zh: '大', en: 'Large' }) },
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
        title: i18n.translate({ zh: '数据类型配置', en: 'Data type setting' }),
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
        title: i18n.translate({ zh: '外观', en: 'Appearance' }),
      },
      childrenOfAttr: ['direction', 'tagSize'],
    },
  ],
  event: {
    onClick: {
      label: {
        zh: '点击时',
        en: 'On click',
      },
      params: [async (props) => createDefineFromProps(props, { label: { zh: '值', en: 'Value' } })],
    },
  },
  Render: Display,
}

export default displayMeta
