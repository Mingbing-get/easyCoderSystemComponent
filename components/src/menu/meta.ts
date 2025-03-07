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
  ResetSelectSetter,
} from '@easy-coder/sdk/design'
import { Multilingual, i18n } from '@easy-coder/sdk/i18n'

import Menu, { MenuProps } from '.'
import AddTreeNode from './setter/addTreeNode'
import RemoveTreeNode from './setter/removeTreeNode'

const customItemDefine: Record<string, EasyCoderElement.OmitApiNameVariable> = {
  id: {
    type: 'string',
    label: {
      zh: 'ID',
      en: 'ID',
    },
  },
  label: {
    type: 'string',
    label: {
      zh: '名称',
      en: 'Name',
    },
  },
}

const getModalOrVariableItemType: EasyCoderElement.DynamicVariable<MenuProps> = async (props, getAttrType) => {
  if (props.dataFrom === 'modal' && props.modalConfig?.name) {
    return {
      type: 'lookup',
      modalName: props.modalConfig.name,
      label: {
        zh: '当前项',
        en: 'Current item',
      },
    }
  }

  if (props.dataFrom === 'variable') {
    const refVariableType = await getAttrType('variableValue')

    if (refVariableType?.type === 'array') {
      return {
        ...refVariableType.item,
        label: {
          zh: '当前项',
          en: 'Current item',
        },
      }
    }
  }

  return undefined
}

function createGetItemTypeFn(label: Multilingual = { zh: '当前项', en: 'Current item' }) {
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
  label: {
    zh: '导航栏',
    en: 'Menu',
  },
  defaultAttr: {
    mode: 'vertical',
    theme: 'light',
    canResizeMenu: true,
    defaultWidth: 150,
    dataFrom: 'modal',
  },
  style: {
    style: {
      label: {
        zh: '外层样式',
        en: 'Outer style',
      },
    },
    menuStyle: {
      label: {
        zh: '菜单样式',
        en: 'Menu style',
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
        'padding',
        'outline',
        'transform',
        'transition',
      ],
    },
    contentStyle: {
      label: {
        zh: '内容区样式',
        en: 'Content style',
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
      label: {
        zh: '外层样式名',
        en: 'Outer classname',
      },
    },
    menuClassName: {
      label: {
        zh: '菜单样式名',
        en: 'Menu classname',
      },
    },
    contentClassName: {
      label: {
        zh: '内容区样式名',
        en: 'Content classname',
      },
    },
  },
  attr: {
    dataFrom: {
      type: 'string',
      label: {
        zh: '数据来源',
        en: 'Data from',
      },
      setter: ResetSelectSetter,
      setterProps: {
        title: i18n.translate({ zh: '数据来源', en: 'Data from' }),
        options: [
          { value: 'modal', label: i18n.translate({ zh: '数据模型', en: 'Data modal' }) },
          { value: 'variable', label: i18n.translate({ zh: '关联变量', en: 'Variable' }) },
          { value: 'custom', label: i18n.translate({ zh: '自定义', en: 'Custom' }) },
        ],
        when: {
          modal: [
            { key: 'customData', type: 'attr' },
            { key: 'variableValue', type: 'attr' },
            { key: 'childKeyName', type: 'attr' },
            { key: 'idKeyName', type: 'attr' },
            { key: 'customRender', type: 'multipleSlot' },
          ],
          variable: [
            { key: 'customData', type: 'attr' },
            { key: 'modalConfig', type: 'attr' },
            { key: 'parentFieldName', type: 'attr' },
            { key: 'customRender', type: 'multipleSlot' },
          ],
          custom: [
            { key: 'modalConfig', type: 'attr' },
            { key: 'parentFieldName', type: 'attr' },
            { key: 'variableValue', type: 'attr' },
            { key: 'childKeyName', type: 'attr' },
            { key: 'idKeyName', type: 'attr' },
            { key: 'labelRender', type: 'slot' },
            { key: 'contentRender', type: 'slot' },
          ],
        },
      },
    },
    customData: {
      type: 'array',
      label: {
        zh: '菜单项配置',
        en: 'Menu item config',
      },
      item: {
        type: 'object',
        prototype: {
          id: {
            type: 'string',
            label: {
              zh: 'ID',
              en: 'ID',
            },
            required: true,
          },
          label: {
            type: 'multilingual',
            label: {
              zh: '名称',
              en: 'Name',
            },
          },
        },
      },
      setter: ObjectTreeSetter,
      setterProps: {
        title: i18n.translate({ zh: '菜单项配置', en: 'Menu item config' }),
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
      label: {
        zh: '数据模型',
        en: 'Data modal',
      },
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
      label: {
        zh: '关联父级字段',
        en: 'Parent field',
      },
      setter: SingleModalFieldPickSetter,
      onDependencies: (options) => onModalFieldDependencies(options?.props?.modalConfig?.name, options),
      setterProps: {
        title: i18n.translate({ zh: '关联父级字段', en: 'Parent field' }),
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
      label: {
        zh: '选择变量',
        en: 'Select variable',
      },
      canAcceptTypes: ['array'],
      visible: (props) => props?.dataFrom === 'variable',
    },
    childKeyName: {
      type: 'string',
      label: {
        zh: '下级字段',
        en: 'Child field',
      },
      visible: (props) => props?.dataFrom === 'variable',
      setter: VariableNextLevelSetter,
      setterProps: {
        title: i18n.translate({ zh: '下级字段', en: 'Child field' }),
        path: {
          _type: 'dynamic',
          fn: (props: MenuProps) => props?.variableValue,
        },
        acceptTypes: ['array'],
      },
    },
    idKeyName: {
      type: 'string',
      label: {
        zh: '唯一值字段',
        en: 'Unique value field',
      },
      visible: (props) => props?.dataFrom === 'variable',
      setter: VariableNextLevelSetter,
      setterProps: {
        title: i18n.translate({ zh: '唯一值字段', en: 'Unique value field' }),
        path: {
          _type: 'dynamic',
          fn: (props: MenuProps) => props?.variableValue,
        },
        acceptTypes: ['string', 'number', 'datetime', 'date', 'float', 'text'],
      },
    },

    mode: {
      type: 'string',
      label: {
        zh: '方向',
        en: 'Direction',
      },
      setter: SelectSetter,
      setterProps: {
        title: i18n.translate({ zh: '方向', en: 'Direction' }),
        displayAs: 'button',
        options: [
          {
            value: 'vertical',
            label: i18n.translate({ zh: '垂直', en: 'Vertical' }),
          },
          {
            value: 'horizontal',
            label: i18n.translate({ zh: '水平', en: 'Horizontal' }),
          },
        ],
      },
    },
    theme: {
      type: 'string',
      label: {
        zh: '主题',
        en: 'Theme',
      },
      setter: SelectSetter,
      setterProps: {
        title: i18n.translate({ zh: '主题', en: 'Theme' }),
        displayAs: 'button',
        options: [
          {
            value: 'light',
            label: i18n.translate({ zh: '亮色', en: 'Light' }),
          },
          {
            value: 'dark',
            label: i18n.translate({ zh: '暗色', en: 'Dark' }),
          },
        ],
      },
    },
    canResizeMenu: {
      type: 'boolean',
      label: {
        zh: '是否可拖拽大小',
        en: 'Can resize',
      },
      visible: (props) => props?.mode === 'vertical',
    },
    defaultWidth: {
      type: 'number',
      label: {
        zh: '默认宽度',
        en: 'Default width',
      },
      visible: (props) => props?.mode === 'vertical',
    },
  },
  attrDecorators: [
    {
      id: 'data',
      childrenOfAttr: ['dataFrom', 'customData', 'modalConfig', 'parentFieldName', 'variableValue', 'childKeyName', 'idKeyName'],
      Render: GroupDecorator,
      props: {
        title: i18n.translate({ zh: '数据配置', en: 'Data settings' }),
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
        title: i18n.translate({ zh: '外观', en: 'Appearance' }),
        canFold: true,
      },
    },
  ],
  slot: {
    customRender: {
      label: {
        zh: '自定义插槽',
        en: 'Custom slot',
      },
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
          label: {
            zh: 'ID',
            en: 'ID',
          },
        },
        label: {
          type: 'multilingual',
          label: {
            zh: '名称',
            en: 'Name',
          },
        },
      },
    },
    extraRender: {
      label: {
        zh: '额外插槽',
        en: 'Extra slot',
      },
    },
    labelRender: {
      label: {
        zh: '标签插槽',
        en: 'Label slot',
      },
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
      label: {
        zh: '内容插槽',
        en: 'Content slot',
      },
      payload: { item: getModalOrVariableItemType },
    },
  },
  event: {
    onActiveChange: {
      label: {
        zh: '选中改变时',
        en: 'Active change',
      },
      params: [createGetItemTypeFn()],
    },
  },
  export: {
    attr: {
      activeItem: createGetItemTypeFn({ zh: '选中项', en: 'Active item' }),
    },
  },
  Render: Menu,
}

export default menuMeta
