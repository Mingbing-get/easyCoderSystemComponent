import { EasyCoderElement } from '@easy-coder/sdk/store'

import Button, { ButtonProps } from '.'

const buttonMeta: EasyCoderElement.Desc<ButtonProps> = {
  type: 'system_component_button',
  label: '按钮',
  className: {
    className: {
      label: '样式名',
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
      label: '样式',
    },
  },
  attr: {
    disabled: {
      type: 'boolean',
      label: '禁止',
    },
    loading: {
      type: 'boolean',
      label: '加载中',
    },
  },
  slot: {
    children: {
      defaultStyle: {},
      label: '子节点',
    },
  },
  event: {
    onClick: {
      label: '点击时',
    },
  },
  export: {
    attr: {
      disabled: {
        type: 'boolean',
        label: '是否禁止',
      },
      loading: {
        type: 'boolean',
        label: '是否加载中',
      },
    },
    event: {
      setDisabled: {
        params: [{ type: 'boolean', label: '新值' }],
        label: '设置是否禁止',
      },
      setLoading: {
        params: [{ type: 'boolean', label: '新值' }],
        label: '设置是否加载中',
      },
    },
  },
  onCreate: async (options) => {
    const childrenSlotIds = options.currentElement.slotMap?.['children']
    if (!childrenSlotIds?.length) return

    const childrenSlot = options.getEditorById(childrenSlotIds[0])
    if (!childrenSlot) return

    const elementId = await options.createElement('system_component_text', childrenSlotIds[0], { text: '按钮' })
    childrenSlot.elements.push(elementId)
  },
  Render: Button,
}

export default buttonMeta
