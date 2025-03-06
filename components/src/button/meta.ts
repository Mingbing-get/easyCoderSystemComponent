import { EasyCoderElement } from '@easy-coder/sdk/store'
import { StringOrMultilingualSetter } from '@easy-coder/sdk/design'
import { i18n } from '@easy-coder/sdk/i18n'

import Button, { ButtonProps } from '.'

const buttonMeta: EasyCoderElement.Desc<ButtonProps> = {
  type: 'system_component_button',
  label: {
    zh: '按钮',
    en: 'Button',
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
      defaultValue: {
        padding: [
          {
            value: 4,
            unit: 'px',
          },
          {
            value: 8,
            unit: 'px',
          },
          {
            value: 4,
            unit: 'px',
          },
          {
            value: 8,
            unit: 'px',
          },
        ],
        borderRadius: [
          {
            value: 4,
            unit: 'px',
          },
          {
            value: 4,
            unit: 'px',
          },
          {
            value: 4,
            unit: 'px',
          },
          {
            value: 4,
            unit: 'px',
          },
        ],
        borderColor: ['#ccc', '#ccc', '#ccc', '#ccc'],
        borderStyle: ['solid', 'solid', 'solid', 'solid'],
        borderWidth: [
          {
            value: 1,
            unit: 'px',
          },
          {
            value: 1,
            unit: 'px',
          },
          {
            value: 1,
            unit: 'px',
          },
          {
            value: 1,
            unit: 'px',
          },
        ],
        background: [
          {
            type: 'color',
            value: '#fff',
          },
        ],
      },
      label: {
        zh: '样式',
        en: 'Style',
      },
    },
  },
  attr: {
    disabled: {
      type: 'boolean',
      label: {
        zh: '禁止',
        en: 'Disabled',
      },
    },
    loading: {
      type: 'boolean',
      label: {
        zh: '加载中',
        en: 'Loading',
      },
    },
    needConfirm: {
      type: 'boolean',
      label: {
        zh: '开启二次确认',
        en: 'Enable secondary confirmation',
      },
      disabledFx: true,
    },
    confirmTitle: {
      type: 'multilingual',
      label: {
        zh: '二次确认标题',
        en: 'Secondary confirmation title',
      },
      setter: StringOrMultilingualSetter,
      setterProps: {
        title: i18n.translate({ zh: '二次确认标题', en: 'Secondary confirmation title' }),
        size: 'mini',
      },
      visible: (props: ButtonProps) => props?.needConfirm,
    },
  },
  slot: {
    children: {
      defaultStyle: {},
      label: {
        zh: '子节点',
        en: 'Sub node',
      },
    },
    confirmDescription: {
      defaultStyle: {},
      label: {
        zh: '二次确认描述',
        en: 'Secondary confirmation description',
      },
    },
  },
  event: {
    onClick: {
      label: {
        zh: '点击时',
        en: 'On click',
      },
    },
  },
  export: {
    attr: {
      disabled: {
        type: 'boolean',
        label: {
          zh: '是否禁止',
          en: 'Is Disabled',
        },
      },
      loading: {
        type: 'boolean',
        label: {
          zh: '是否加载中',
          en: 'Is loading',
        },
      },
    },
    event: {
      setDisabled: {
        params: [{ type: 'boolean', label: { zh: '新值', en: 'New value' } }],
        label: {
          zh: '设置是否禁止',
          en: 'Set disabled',
        },
      },
      setLoading: {
        params: [{ type: 'boolean', label: { zh: '新值', en: 'New value' } }],
        label: {
          zh: '设置是否加载中',
          en: 'Set loading',
        },
      },
    },
  },
  onCreate: async (options) => {
    const childrenSlotIds = options.currentElement.slotMap?.['children']
    if (!childrenSlotIds?.length) return

    const childrenSlot = options.getEditorById(childrenSlotIds[0])
    if (!childrenSlot) return

    const elementId = await options.createElement('system_component_text', childrenSlotIds[0], { text: { zh: '按钮', en: 'Button' } })
    childrenSlot.elements.push(elementId)
  },
  Render: Button,
}

export default buttonMeta
