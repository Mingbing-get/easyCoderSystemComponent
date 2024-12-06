import { EasyCoderElement } from '@easy-coder/sdk/store'
import { SelectSetter, ObjectTreeSetter, GroupDecorator, LineDecorator } from '@easy-coder/sdk/design'

import Menu, { MenuProps } from '.'
import AddTreeNode from './setter/addTreeNode'
import RemoveTreeNode from './setter/removeTreeNode'

const menuMeta: EasyCoderElement.Desc<MenuProps> = {
  type: 'system_component_menu',
  label: '导航栏',
  defaultAttr: {
    mode: 'vertical',
    theme: 'light',
    canResizeMenu: true,
    defaultWidth: 150,
  },
  style: {
    style: {
      label: '外层样式',
    },
    menuStyle: {
      label: '菜单样式',
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
        'padding',
        'outline',
        'transform',
        'transition',
      ],
    },
    contentStyle: {
      label: '内容区样式',
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
        'transform',
        'transition',
      ],
      defaultValue: {
        padding: [
          { value: 8, unit: 'px' },
          { value: 8, unit: 'px' },
          { value: 8, unit: 'px' },
          { value: 8, unit: 'px' },
        ],
      },
    },
  },
  className: {
    className: {
      label: '外层样式名',
    },
    menuClassName: {
      label: '菜单样式名',
    },
    contentClassName: {
      label: '内容区样式名',
    },
  },
  attr: {
    customData: {
      type: 'array',
      label: '菜单项配置',
      item: {
        type: 'object',
        prototype: {
          id: {
            type: 'string',
            label: 'ID',
            required: true,
          },
          label: {
            type: 'string',
            label: '名称',
          },
        },
      },
      setter: ObjectTreeSetter,
      setterProps: {
        title: '菜单项配置',
        labelRender: {
          fieldName: 'label',
          canEdit: true,
        },
        AddButtonRender: AddTreeNode,
        RemoveButtonRender: RemoveTreeNode,
      },
    },

    mode: {
      type: 'string',
      label: '方向',
      setter: SelectSetter,
      setterProps: {
        title: '方向',
        displayAs: 'button',
        options: [
          {
            value: 'vertical',
            label: '垂直',
          },
          {
            value: 'horizontal',
            label: '水平',
          },
        ],
      },
    },
    theme: {
      type: 'string',
      label: '主题',
      setter: SelectSetter,
      setterProps: {
        title: '主题',
        displayAs: 'button',
        options: [
          {
            value: 'light',
            label: '白色',
          },
          {
            value: 'dark',
            label: '黑色',
          },
        ],
      },
    },
    canResizeMenu: {
      type: 'boolean',
      label: '是否可拖拽大小',
      visible: (props) => props?.mode === 'vertical',
    },
    defaultWidth: {
      type: 'number',
      label: '默认宽度',
      visible: (props) => props?.mode === 'vertical',
    },
  },
  attrDecorators: [
    {
      id: 'data',
      childrenOfAttr: ['customData'],
      Render: GroupDecorator,
      props: {
        title: '数据配置',
        canFold: true,
      },
    },
    {
      id: 'line1',
      Render: LineDecorator,
    },
    {
      id: 'style',
      childrenOfAttr: ['mode', 'theme', 'canResizeMenu', 'defaultWidth'],
      Render: GroupDecorator,
      props: {
        title: '外观',
        canFold: true,
      },
    },
  ],
  slot: {
    customRender: {
      label: '自定义插槽',
      isMultiple: true,
      defaultStyle: {
        padding: [
          { value: 6, unit: 'px' },
          { value: 0, unit: 'px' },
          { value: 6, unit: 'px' },
          { value: 0, unit: 'px' },
        ],
      },
      payload: {
        id: {
          type: 'string',
          label: 'ID',
        },
        label: {
          type: 'string',
          label: '名称',
        },
      },
    },
    extraRender: {
      label: '额外插槽',
    },
  },
  Render: Menu,
}

export default menuMeta
