import { EasyCoderElement } from '@easy-coder/sdk/store'
import { GroupDecorator, onModalDependencies } from '@easy-coder/sdk/design'

import FormModalSetter from './setter/formModalSetter'
import FieldReflexInputSetter from './setter/fieldReflexInputSetter'
import FormDefaultValueSetter from './setter/formDefaultValueSetter'
import { onFormFieldDependencies } from './setter/onFormFieldDependencies'
import Form, { FormProps } from '.'

function createTypeFn(label: string) {
  const createTypeFromProps: EasyCoderElement.DynamicVariable<FormProps> = async (props) => {
    if (!props?.modalConfig?.name) return

    return {
      type: 'lookup',
      label,
      modalName: props.modalConfig.name,
    }
  }

  return createTypeFromProps
}

const formMeta: EasyCoderElement.Desc<FormProps> = {
  type: 'system_component_form',
  label: '表单',
  className: {
    className: {
      label: '样式名',
    },
  },
  style: {
    style: {
      label: '样式',
    },
  },
  attr: {
    modalConfig: {
      type: 'object',
      label: '数据模型',
      prototype: {},
      setter: FormModalSetter,
      onDependencies: onModalDependencies,
    },
    defaultValue: {
      type: 'object',
      label: '默认值',
      prototype: {},
      setter: FormDefaultValueSetter,
      setterProps: {
        title: '默认值',
        modalName: {
          _type: 'dynamic',
          fn: (props?: FormProps) => props?.modalConfig?.name,
        },
      },
      onDependencies: onFormFieldDependencies,
    },
    fieldReflexInputElement: {
      type: 'object',
      label: '字段配置',
      prototype: {},
      setter: FieldReflexInputSetter,
      setterProps: {
        title: '字段配置',
        modalName: {
          _type: 'dynamic',
          fn: (props: FormProps) => props?.modalConfig?.name,
        },
      },
    },
  },
  attrDecorators: [
    {
      id: 'data_setting',
      Render: GroupDecorator,
      props: {
        title: '数据配置',
        canFold: false,
      },
      childrenOfAttr: ['modalConfig', 'defaultValue', 'fieldReflexInputElement'],
    },
  ],
  slot: {
    children: {
      label: '子节点',
      payload: {
        value: createTypeFn('值'),
      },
    },
  },
  event: {
    onChange: {
      label: '值改变时',
      params: [createTypeFn('新值')],
    },
  },
  export: {
    attr: {
      value: createTypeFn('值'),
    },
    event: {
      setValue: {
        label: '设置值',
        params: [createTypeFn('新值')],
      },
      clear: {
        label: '清空值',
      },
    },
  },
  Render: Form,
}

export default formMeta
