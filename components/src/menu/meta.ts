import { EasyCoderElement } from '@easy-coder/sdk/store'
import {
  SelectSetter,
  ObjectTreeSetter,
  GroupDecorator,
  LineDecorator,
  ModalMetaSetter,
  onModalDependencies,
  onModalFieldDependencies,
  SingleModalFieldPickSetter,
  VariableNextLevelSetter,
} from '@easy-coder/sdk/design'

import Menu, { MenuProps } from '.'
import AddTreeNode from './setter/addTreeNode'
import RemoveTreeNode from './setter/removeTreeNode'
import DataFromSetter from './setter/dataFromSetter'

const customItemDefine: Record<string, EasyCoderElement.OmitApiNameVariable> = {
  id: {
    type: 'string',
    label: 'ID',
  },
  label: {
    type: 'string',
    label: '名称',
  },
}

const getModalOrVariableItemType: EasyCoderElement.DynamicVariable<MenuProps> = async (props, getAttrType) => {
  if (props.dataFrom === 'modal' && props.modalConfig?.name) {
    return {
      type: 'lookup',
      modalName: props.modalConfig.name,
      label: '当前项',
    }
  }

  if (props.dataFrom === 'variable') {
    const refVariableType = await getAttrType('variableValue')

    if (refVariableType?.type === 'array') {
      return {
        ...refVariableType.item,
        label: '当前项',
      }
    }
  }

  return undefined
}

function createGetItemTypeFn(label: string = '当前项') {
  const getItemType: EasyCoderElement.DynamicVariable<MenuProps> = async (props, getAttrType) => {
    if (props.dataFrom === 'custom') {
      return {
        type: 'object',
        label,
        prototype: customItemDefine,
      }
    }

    return getModalOrVariableItemType(props, getAttrType)
  }

  return getItemType
}

const menuMeta: EasyCoderElement.Desc<MenuProps> = {
  type: 'system_component_menu',
  label: '导航栏',
  defaultAttr: {
    mode: 'vertical',
    theme: 'light',
    canResizeMenu: true,
    defaultWidth: 150,
    dataFrom: 'modal',
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
    dataFrom: {
      type: 'string',
      label: '数据来源',
      setter: DataFromSetter,
      setterProps: {
        title: '数据来源',
      },
    },
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
      visible: (props) => props?.dataFrom === 'custom',
    },
    modalConfig: {
      type: 'object',
      label: '数据模型',
      prototype: {},
      setter: ModalMetaSetter,
      onDependencies: onModalDependencies,
      setterProps: {
        showField: true,
        showCondition: true,
        showOrder: true,
      },
      visible: (props) => props?.dataFrom === 'modal',
    },
    parentFieldName: {
      type: 'string',
      label: '关联父级字段',
      setter: SingleModalFieldPickSetter,
      onDependencies: (options) => onModalFieldDependencies(options?.props?.modalConfig?.name, options),
      setterProps: {
        title: '关联父级字段',
        modalName: {
          _type: 'dynamic',
          fn: (props: MenuProps) => props?.modalConfig?.name,
        },
        acceptFieldTypes: ['lookupSelf'],
      },
      visible: (props) => props?.dataFrom === 'modal',
    },
    variableValue: {
      type: 'ref',
      label: '选择变量',
      canAcceptTypes: ['array'],
      visible: (props) => props?.dataFrom === 'variable',
    },
    childKeyName: {
      type: 'string',
      label: '下级字段',
      visible: (props) => props?.dataFrom === 'variable',
      setter: VariableNextLevelSetter,
      setterProps: {
        title: '下级字段',
        path: {
          _type: 'dynamic',
          fn: (props: MenuProps) => props?.variableValue,
        },
        acceptTypes: ['array'],
      },
    },
    idKeyName: {
      type: 'string',
      label: '唯一值字段',
      visible: (props) => props?.dataFrom === 'variable',
      setter: VariableNextLevelSetter,
      setterProps: {
        title: '唯一值字段',
        path: {
          _type: 'dynamic',
          fn: (props: MenuProps) => props?.variableValue,
        },
        acceptTypes: ['string', 'number', 'datetime', 'date', 'float', 'text'],
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
      childrenOfAttr: ['dataFrom', 'customData', 'modalConfig', 'parentFieldName', 'variableValue', 'childKeyName', 'idKeyName'],
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
    labelRender: {
      label: '标签插槽',
      defaultStyle: {
        padding: [
          { value: 6, unit: 'px' },
          { value: 0, unit: 'px' },
          { value: 6, unit: 'px' },
          { value: 0, unit: 'px' },
        ],
      },
      payload: { item: getModalOrVariableItemType },
    },
    contentRender: {
      label: '内容插槽',
      payload: { item: getModalOrVariableItemType },
    },
  },
  event: {
    onActiveChange: {
      label: '选中改变时',
      params: [createGetItemTypeFn()],
    },
  },
  export: {
    attr: {
      activeItem: createGetItemTypeFn('选中项'),
    },
  },
  Render: Menu,
}

export default menuMeta
