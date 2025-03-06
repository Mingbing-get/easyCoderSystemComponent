import { EasyCoderElement } from '@easy-coder/sdk/store'
import { GroupDecorator, onModalDependencies } from '@easy-coder/sdk/design'
import { Multilingual, i18n } from '@easy-coder/sdk/i18n'

import FormModalSetter from './setter/formModalSetter'
import FieldReflexInputSetter from './setter/fieldReflexInputSetter'
import FormDefaultValueSetter from './setter/formDefaultValueSetter'
import { onFormFieldDependencies } from './setter/onFormFieldDependencies'
import Form, { FormProps } from '.'

function createTypeFn(label: Multilingual) {
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
  label: {
    zh: '表单',
    en: 'Form',
  },
  className: {
    className: {
      label: {
        zh: '样式名',
        en: 'Classname',
      },
    },
  },
  style: {
    style: {
      label: {
        zh: '样式',
        en: 'Style',
      },
    },
  },
  attr: {
    modalConfig: {
      type: 'object',
      label: {
        zh: '数据模型',
        en: 'Data model',
      },
      prototype: {},
      setter: FormModalSetter,
      onDependencies: onModalDependencies,
    },
    defaultValue: {
      type: 'object',
      label: {
        zh: '默认值',
        en: 'Default value',
      },
      prototype: {},
      setter: FormDefaultValueSetter,
      setterProps: {
        title: i18n.translate({ zh: '默认值', en: 'Default value' }),
        modalName: {
          _type: 'dynamic',
          fn: (props?: FormProps) => props?.modalConfig?.name,
        },
      },
      onDependencies: onFormFieldDependencies,
    },
    fieldReflexInputElement: {
      type: 'object',
      label: {
        zh: '字段配置',
        en: 'Field configuration',
      },
      prototype: {},
      setter: FieldReflexInputSetter,
      setterProps: {
        title: i18n.translate({ zh: '字段配置', en: 'Field configuration' }),
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
        title: i18n.translate({ zh: '数据配置', en: 'Data configuration' }),
        canFold: false,
      },
      childrenOfAttr: ['modalConfig', 'defaultValue', 'fieldReflexInputElement'],
    },
  ],
  slot: {
    children: {
      label: {
        zh: '子节点',
        en: 'Children',
      },
      payload: {
        value: createTypeFn({ zh: '值', en: 'Value' }),
      },
    },
  },
  event: {
    onChange: {
      label: {
        zh: '值改变时',
        en: 'Value change',
      },
      params: [createTypeFn({ zh: '新值', en: 'New value' })],
    },
  },
  export: {
    attr: {
      value: createTypeFn({ zh: '值', en: 'Value' }),
    },
    event: {
      setValue: {
        label: {
          zh: '设置值',
          en: 'Set value',
        },
        params: [createTypeFn({ zh: '新值', en: 'New value' })],
      },
      clear: {
        label: {
          zh: '清空值',
          en: 'Clear value',
        },
      },
    },
  },
  Render: Form,
}

export default formMeta
