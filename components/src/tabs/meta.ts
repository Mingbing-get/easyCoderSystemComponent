import { EasyCoderElement } from '@easy-coder/sdk/store'
import { GroupDecorator, LineDecorator, ModalMetaSetter, ObjectListSetter, SelectSetter, onModalDependencies } from '@easy-coder/sdk/design'

import ResetSelectSetter from '../alert/setter/resetSelectSetter'
import AddButton from './setter/addButtonRender'
import RemoveButton from './setter/removeButtonRender'

import Tabs, { TabsProps } from '.'

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

const getModalOrVariableItemType: EasyCoderElement.DynamicVariable<TabsProps> = async (props, getAttrType) => {
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
  const getItemType: EasyCoderElement.DynamicVariable<TabsProps> = async (props, getAttrType) => {
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

const tabsMeta: EasyCoderElement.Desc<TabsProps> = {
  type: 'system_component_tabs',
  label: '标签页',
  defaultAttr: {
    dataFrom: 'modal',
    fetchCount: 10,
    direction: 'horizontal',
    overflow: 'scroll',
    scrollPosition: 'auto',
    size: 'default',
    tabPosition: 'top',
    type: 'line',
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
    panelStyle: {
      label: '面板样式',
      supportModels: ['background', 'height', 'margin', 'maxHeight', 'minHeight', 'padding'],
    },
  },
  className: {
    className: {
      label: '样式名',
    },
    panelClassName: {
      label: '面板样式名',
    },
  },
  attr: {
    dataFrom: {
      type: 'string',
      label: '数据来源',
      setter: ResetSelectSetter,
      setterProps: {
        title: '数据来源',
        options: [
          { value: 'modal', label: '数据模型' },
          { value: 'variable', label: '关联变量' },
          { value: 'custom', label: '自定义' },
        ],
        when: {
          modal: [
            { key: 'variableValue', type: 'attr' },
            { key: 'customData', type: 'attr' },
            { key: 'customRender', type: 'multipleSlot' },
          ],
          variable: [
            { key: 'modalConfig', type: 'attr' },
            { key: 'customData', type: 'attr' },
            { key: 'customRender', type: 'multipleSlot' },
          ],
          custom: [
            { key: 'modalConfig', type: 'attr' },
            { key: 'variableValue', type: 'attr' },
            { key: 'titleRender', type: 'slot' },
            { key: 'contentRender', type: 'slot' },
          ],
        },
      },
    },
    modalConfig: {
      type: 'object',
      prototype: {},
      label: '数据源',
      setter: ModalMetaSetter,
      setterProps: {
        showField: true,
        showCondition: true,
        showOrder: true,
      },
      visible: (props: TabsProps) => props?.dataFrom === 'modal',
      onDependencies: onModalDependencies,
    },
    fetchCount: {
      type: 'number',
      label: '获取条数',
      disabledFx: true,
      visible: (props: TabsProps) => props?.dataFrom === 'modal',
    },
    variableValue: {
      type: 'ref',
      canAcceptTypes: ['array', 'multipleEnum', 'multipleLookup'],
      label: '关联变量',
      visible: (props: TabsProps) => props?.dataFrom === 'variable',
    },
    customData: {
      type: 'array',
      label: '标签项',
      item: {
        type: 'object',
        prototype: {
          id: { type: 'string', label: 'ID' },
          label: { type: 'string', label: '标签' },
        },
      },
      setter: ObjectListSetter,
      setterProps: {
        title: '标签项',
        labelRender: {
          fieldName: 'label',
          canEdit: true,
        },
        AddButtonRender: AddButton,
        RemoveButtonRender: RemoveButton,
      },
      visible: (props: TabsProps) => props?.dataFrom === 'custom',
    },

    direction: {
      type: 'string',
      label: '方向',
      setter: SelectSetter,
      setterProps: {
        title: '方向',
        displayAs: 'button',
        options: [
          { value: 'horizontal', label: '水平' },
          { value: 'vertical', label: '垂直' },
        ],
      },
    },
    overflow: {
      type: 'string',
      label: '溢出方式',
      setter: SelectSetter,
      setterProps: {
        title: '溢出方式',
        displayAs: 'button',
        options: [
          { value: 'scroll', label: '滚动' },
          { value: 'dropdown', label: '下拉' },
        ],
      },
    },
    scrollPosition: {
      type: 'string',
      label: '选中标签位置',
      setter: SelectSetter,
      setterProps: {
        title: '选中标签位置',
        options: [
          { value: 'auto', label: '自动' },
          { value: 'start', label: '开始' },
          { value: 'center', label: '居中' },
          { value: 'end', label: '结尾' },
        ],
      },
    },
    size: {
      type: 'string',
      label: '尺寸',
      setter: SelectSetter,
      setterProps: {
        title: '尺寸',
        options: [
          { value: 'mini', label: '极小' },
          { value: 'small', label: '小' },
          { value: 'default', label: '默认' },
          { value: 'large', label: '大' },
        ],
      },
    },
    tabPosition: {
      type: 'string',
      label: '选项卡位置',
      setter: SelectSetter,
      setterProps: {
        title: '选项卡位置',
        options: [
          { value: 'top', label: '上' },
          { value: 'right', label: '右' },
          { value: 'bottom', label: '下' },
          { value: 'left', label: '左' },
        ],
      },
      visible: (props: TabsProps) => props.direction !== 'vertical',
    },
    type: {
      type: 'string',
      label: '选项卡类型',
      setter: SelectSetter,
      setterProps: {
        title: '选项卡类型',
        options: [
          { value: 'line', label: '线' },
          { value: 'card', label: '卡片' },
          { value: 'card-gutter', label: '卡片留间隙' },
          { value: 'text', label: '文本' },
          { value: 'rounded', label: '圆角' },
          { value: 'capsule', label: '胶囊' },
        ],
      },
    },
  },
  attrDecorators: [
    {
      id: 'data',
      Render: GroupDecorator,
      props: {
        title: '数据配置',
        canFold: true,
      },
      childrenOfAttr: ['dataFrom', 'variableValue', 'modalConfig', 'fetchCount', 'customData'],
    },
    {
      id: 'line1',
      Render: LineDecorator,
    },
    {
      id: 'style',
      Render: GroupDecorator,
      props: {
        title: '外观',
        canFold: true,
      },
      childrenOfAttr: ['direction', 'overflow', 'scrollPosition', 'size', 'tabPosition', 'type'],
    },
  ],
  slot: {
    titleRender: {
      label: '标签头插槽',
      defaultStyle: {
        padding: [],
      },
      payload: {
        item: getModalOrVariableItemType,
      },
    },
    contentRender: {
      label: '内容插槽',
      defaultStyle: {
        padding: [],
      },
      payload: {
        item: getModalOrVariableItemType,
      },
    },
    extraRender: {
      label: '额外插槽',
      defaultStyle: {
        padding: [],
      },
    },
    customRender: {
      label: '自定义插槽',
      defaultStyle: {
        padding: [],
      },
      isMultiple: true,
      payload: customItemDefine,
    },
  },
  event: {
    onChange: {
      label: '改变时',
      params: [createGetItemTypeFn()],
    },
  },
  export: {
    attr: {
      activeItem: createGetItemTypeFn('激活项'),
    },
  },
  Render: Tabs,
}

export default tabsMeta
