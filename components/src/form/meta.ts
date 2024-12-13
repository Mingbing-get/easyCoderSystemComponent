import { EasyCoderElement } from '@easy-coder/sdk/store'
import { ModalMetaSetter, onModalDependencies } from '@easy-coder/sdk/design'

import FieldReflexInputSetter from './setter/fieldReflexInputSetter'
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
      setter: ModalMetaSetter,
      onDependencies: onModalDependencies,
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
