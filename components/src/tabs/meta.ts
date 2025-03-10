import { EasyCoderElement } from '@easy-coder/sdk/store'
import { GroupDecorator, LineDecorator, ModalMetaSetter, ObjectListSetter, SelectSetter, onModalDependencies, ResetSelectSetter } from '@easy-coder/sdk/design'
import { i18n, Multilingual } from '@easy-coder/sdk/i18n'

import AddButton from './setter/addButtonRender'
import RemoveButton from './setter/removeButtonRender'

import Tabs, { TabsProps } from '.'

const customItemDefine: Record<string, EasyCoderElement.OmitApiNameVariable> = {
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
}

const getModalOrVariableItemType: EasyCoderElement.DynamicVariable<TabsProps> = async (props, getAttrType) => {
  if (props.dataFrom === 'modal' && props.modalConfig?.name) {
    return {
      type: 'lookup',
      modalName: props.modalConfig.name,
      label: {
        zh: '当前项',
        en: 'Current Item',
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
          en: 'Current Item',
        },
      }
    }
  }

  return undefined
}

function createGetItemTypeFn(label: Multilingual = { zh: '当前项', en: 'Current Item' }) {
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
  label: {
    zh: '标签页',
    en: 'Tabs',
  },
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
      label: {
        zh: '样式',
        en: 'Style',
      },
      supportModels: [
        'background',
        'filter',
        'opacity',
        'zIndex',
        'position',
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
      label: {
        zh: '面板样式',
        en: 'Panel style',
      },
      supportModels: ['background', 'filter', 'opacity', 'zIndex', 'height', 'margin', 'maxHeight', 'minHeight', 'padding'],
    },
  },
  className: {
    className: {
      label: {
        zh: '样式名',
        en: 'Classname',
      },
    },
    panelClassName: {
      label: {
        zh: '面板样式名',
        en: 'Panel classname',
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
      label: {
        zh: '数据源',
        en: 'Data source',
      },
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
      label: {
        zh: '获取条数',
        en: 'Fetch count',
      },
      disabledFx: true,
      visible: (props: TabsProps) => props?.dataFrom === 'modal',
    },
    variableValue: {
      type: 'ref',
      canAcceptTypes: ['array', 'multipleEnum', 'multipleLookup'],
      label: {
        zh: '关联变量',
        en: 'Variable',
      },
      visible: (props: TabsProps) => props?.dataFrom === 'variable',
    },
    customData: {
      type: 'array',
      label: {
        zh: '标签项',
        en: 'Tab items',
      },
      item: {
        type: 'object',
        prototype: {
          id: { type: 'string', label: { zh: 'ID', en: 'ID' } },
          label: { type: 'multilingual', label: { zh: '标签', en: 'Label' } },
        },
      },
      setter: ObjectListSetter,
      setterProps: {
        title: i18n.translate({ zh: '标签项', en: 'Tab items' }),
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
      label: {
        zh: '方向',
        en: 'Direction',
      },
      setter: SelectSetter,
      setterProps: {
        title: i18n.translate({ zh: '方向', en: 'Direction' }),
        displayAs: 'button',
        options: [
          { value: 'horizontal', label: i18n.translate({ zh: '水平', en: 'Horizontal' }) },
          { value: 'vertical', label: i18n.translate({ zh: '垂直', en: 'Vertical' }) },
        ],
      },
    },
    overflow: {
      type: 'string',
      label: {
        zh: '溢出方式',
        en: 'Overflow',
      },
      setter: SelectSetter,
      setterProps: {
        title: i18n.translate({ zh: '溢出方式', en: 'Overflow' }),
        displayAs: 'button',
        options: [
          { value: 'scroll', label: i18n.translate({ zh: '滚动', en: 'Scroll' }) },
          { value: 'dropdown', label: i18n.translate({ zh: '下拉', en: 'Dropdown' }) },
        ],
      },
    },
    scrollPosition: {
      type: 'string',
      label: {
        zh: '选中标签位置',
        en: 'Selected tab position',
      },
      setter: SelectSetter,
      setterProps: {
        title: i18n.translate({ zh: '选中标签位置', en: 'Selected tab position' }),
        options: [
          { value: 'auto', label: i18n.translate({ zh: '自动', en: 'Auto' }) },
          { value: 'start', label: i18n.translate({ zh: '开始', en: 'Start' }) },
          { value: 'center', label: i18n.translate({ zh: '居中', en: 'Center' }) },
          { value: 'end', label: i18n.translate({ zh: '结束', en: 'End' }) },
        ],
      },
    },
    size: {
      type: 'string',
      label: {
        zh: '尺寸',
        en: 'Size',
      },
      setter: SelectSetter,
      setterProps: {
        title: i18n.translate({ zh: '尺寸', en: 'Size' }),
        options: [
          { value: 'mini', label: i18n.translate({ zh: '极小', en: 'Mini' }) },
          { value: 'small', label: i18n.translate({ zh: '小', en: 'Small' }) },
          { value: 'default', label: i18n.translate({ zh: '默认', en: 'Default' }) },
          { value: 'large', label: i18n.translate({ zh: '大', en: 'Large' }) },
        ],
      },
    },
    tabPosition: {
      type: 'string',
      label: {
        zh: '选项卡位置',
        en: 'Tab header position',
      },
      setter: SelectSetter,
      setterProps: {
        title: i18n.translate({ zh: '选项卡位置', en: 'Tab header position' }),
        options: [
          { value: 'top', label: i18n.translate({ zh: '顶部', en: 'Top' }) },
          { value: 'right', label: i18n.translate({ zh: '右侧', en: 'Right' }) },
          { value: 'bottom', label: i18n.translate({ zh: '底部', en: 'Bottom' }) },
          { value: 'left', label: i18n.translate({ zh: '左侧', en: 'Left' }) },
        ],
      },
      visible: (props: TabsProps) => props.direction !== 'vertical',
    },
    type: {
      type: 'string',
      label: {
        zh: '选项卡类型',
        en: 'Tab header type',
      },
      setter: SelectSetter,
      setterProps: {
        title: i18n.translate({ zh: '选项卡类型', en: 'Tab header type' }),
        options: [
          { value: 'line', label: i18n.translate({ zh: '线', en: 'Line' }) },
          { value: 'card', label: i18n.translate({ zh: '卡片', en: 'Card' }) },
          { value: 'card-gutter', label: i18n.translate({ zh: '卡片（带间隔）', en: 'Card (with gutter)' }) },
          { value: 'text', label: i18n.translate({ zh: '文字', en: 'Text' }) },
          { value: 'rounded', label: i18n.translate({ zh: '圆角', en: 'Rounded' }) },
          { value: 'capsule', label: i18n.translate({ zh: '胶囊', en: 'Capsule' }) },
        ],
      },
    },
  },
  attrDecorators: [
    {
      id: 'data',
      Render: GroupDecorator,
      props: {
        title: i18n.translate({ zh: '数据配置', en: 'Data setting' }),
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
        title: i18n.translate({ zh: '外观', en: 'Appearance' }),
        canFold: true,
      },
      childrenOfAttr: ['direction', 'overflow', 'scrollPosition', 'size', 'tabPosition', 'type'],
    },
  ],
  slot: {
    titleRender: {
      label: {
        zh: '标签头插槽',
        en: 'Tab header slot',
      },
      defaultStyle: {
        padding: [],
      },
      payload: {
        item: getModalOrVariableItemType,
      },
    },
    contentRender: {
      label: {
        zh: '内容插槽',
        en: 'Content slot',
      },
      defaultStyle: {
        padding: [],
      },
      payload: {
        item: getModalOrVariableItemType,
      },
    },
    extraRender: {
      label: {
        zh: '额外插槽',
        en: 'Extra slot',
      },
      defaultStyle: {
        padding: [],
      },
    },
    customRender: {
      label: {
        zh: '自定义插槽',
        en: 'Custom slot',
      },
      defaultStyle: {
        padding: [],
      },
      isMultiple: true,
      payload: customItemDefine,
    },
  },
  event: {
    onChange: {
      label: {
        zh: '改变时',
        en: 'On change',
      },
      params: [createGetItemTypeFn()],
    },
  },
  export: {
    attr: {
      activeItem: createGetItemTypeFn({ zh: '激活项', en: 'Active item' }),
    },
  },
  Render: Tabs,
}

export default tabsMeta
