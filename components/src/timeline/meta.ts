import { EasyCoderElement } from '@easy-coder/sdk/store'
import {
  GroupDecorator,
  LineDecorator,
  ModalMetaSetter,
  ObjectListSetter,
  SelectSetter,
  onModalDependencies,
  ResetSelectSetter,
  ResetSwitchSetter,
} from '@easy-coder/sdk/design'
import { i18n } from '@easy-coder/sdk/i18n'

import useCustomDotSetter from './setter/useCustomDotSetter'
import AddButton from './setter/addButtonRender'
import RemoveButton from './setter/removeButtonRender'
import PanelRender from './setter/panelRender'

import Timeline, { TimelineProps } from '.'

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

const getModalOrVariableItemType: EasyCoderElement.DynamicVariable<TimelineProps> = async (props, getAttrType) => {
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

const timelineMeta: EasyCoderElement.Desc<TimelineProps> = {
  type: 'system_component_timeline',
  label: {
    zh: '时间线',
    en: 'Timeline',
  },
  defaultAttr: {
    dataFrom: 'modal',
    direction: 'horizontal',
    mode: 'top',
    dotType: 'solid',
    lineType: 'solid',
    fetchCount: 10,
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
        'position',
        'borderColor',
        'borderRadius',
        'borderStyle',
        'borderWidth',
        'boxShadow',
        'boxSizing',
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
    itemStyle: {
      label: {
        zh: '节点项样式',
        en: 'Item style',
      },
      supportModels: ['background', 'filter', 'borderColor', 'borderRadius', 'borderStyle', 'borderWidth', 'boxShadow', 'margin', 'outline', 'padding'],
    },
  },
  className: {
    className: {
      label: {
        zh: '样式名',
        en: 'Classname',
      },
    },
    itemClassName: {
      label: {
        zh: '节点项样式名',
        en: 'Item classname',
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
            { key: 'customDotRender', type: 'slot' },
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
      visible: (props: TimelineProps) => props?.dataFrom === 'modal',
      onDependencies: onModalDependencies,
    },
    fetchCount: {
      type: 'number',
      label: {
        zh: '获取条数',
        en: 'Fetch count',
      },
      disabledFx: true,
      visible: (props: TimelineProps) => props?.dataFrom === 'modal',
    },
    variableValue: {
      type: 'ref',
      canAcceptTypes: ['array', 'multipleEnum', 'multipleLookup'],
      label: {
        zh: '关联变量',
        en: 'Variable',
      },
      visible: (props: TimelineProps) => props?.dataFrom === 'variable',
    },
    customData: {
      type: 'array',
      label: {
        zh: '节点项',
        en: 'Timeline item',
      },
      item: {
        type: 'object',
        prototype: {
          id: { type: 'string', label: { zh: 'ID', en: 'ID' } },
          label: { type: 'multilingual', label: { zh: '标签', en: 'Label' } },
          dotType: { type: 'string', label: { zh: '点类型', en: 'Dot type' } },
          lineType: { type: 'string', label: { zh: '线类型', en: 'Dot type' } },
        },
      },
      setter: ObjectListSetter,
      setterProps: {
        title: i18n.translate({ zh: '节点项', en: 'Timeline item' }),
        labelRender: {
          fieldName: 'label',
          canEdit: true,
        },
        AddButtonRender: AddButton,
        RemoveButtonRender: RemoveButton,
        PanelRender,
      },
      visible: (props: TimelineProps) => props?.dataFrom === 'custom',
    },

    usePending: {
      type: 'boolean',
      label: {
        zh: '使用幽灵节点',
        en: 'Use ghost nodes',
      },
      setter: ResetSwitchSetter,
      setterProps: {
        title: i18n.translate({ zh: '使用幽灵节点', en: 'Use ghost nodes' }),
        size: 'small',
        whenFalse: [
          { key: 'pendingRender', type: 'slot' },
          { key: 'pendingDotRender', type: 'slot' },
        ],
      },
    },
    useCustomDot: {
      type: 'boolean',
      label: {
        zh: '使用自定义点',
        en: 'Use custom nodes',
      },
      setter: useCustomDotSetter,
      setterProps: {
        title: i18n.translate({ zh: '使用自定义点', en: 'Use custom nodes' }),
        size: 'small',
      },
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
    mode: {
      type: 'string',
      label: {
        zh: '展示模式',
        en: 'Display mode',
      },
      setter: SelectSetter,
      setterProps: {
        title: i18n.translate({ zh: '展示模式', en: 'Display mode' }),
        options: [
          { value: 'left', label: i18n.translate({ zh: '靠左', en: 'Left' }) },
          { value: 'right', label: i18n.translate({ zh: '靠右', en: 'Right' }) },
          { value: 'top', label: i18n.translate({ zh: '靠上', en: 'Top' }) },
          { value: 'bottom', label: i18n.translate({ zh: '靠下', en: 'Bottom' }) },
          { value: 'alternate', label: i18n.translate({ zh: '交替', en: 'Alternate' }) },
        ],
      },
    },
    dotType: {
      type: 'string',
      label: {
        zh: '点的类型',
        en: 'Dot type',
      },
      setter: SelectSetter,
      setterProps: {
        title: i18n.translate({ zh: '点的类型', en: 'Dot type' }),
        displayAs: 'button',
        options: [
          { value: 'solid', label: i18n.translate({ zh: '实心圆', en: 'Solid circle' }) },
          { value: 'hollow', label: i18n.translate({ zh: '空心圆', en: 'Hollow Circle' }) },
        ],
      },
      visible: (props: TimelineProps) => !props.useCustomDot,
    },
    lineType: {
      type: 'string',
      label: {
        zh: '线的类型',
        en: 'Line type',
      },
      setter: SelectSetter,
      setterProps: {
        title: i18n.translate({ zh: '线的类型', en: 'Line type' }),
        options: [
          { value: 'solid', label: i18n.translate({ zh: '实线', en: 'Solid line' }) },
          { value: 'dashed', label: i18n.translate({ zh: '虚线', en: 'Dashed line' }) },
          { value: 'dotted', label: i18n.translate({ zh: '点线', en: 'Dot line' }) },
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
      id: 'custom',
      Render: GroupDecorator,
      props: {
        title: i18n.translate({ zh: '自定义配置', en: 'Custom setting' }),
        canFold: true,
      },
      childrenOfAttr: ['usePending', 'useCustomDot'],
    },
    {
      id: 'line2',
      Render: LineDecorator,
    },
    {
      id: 'style',
      Render: GroupDecorator,
      props: {
        title: i18n.translate({ zh: '外观', en: 'Appearance' }),
        canFold: true,
      },
      childrenOfAttr: ['direction', 'mode', 'dotType', 'lineType'],
    },
  ],
  slot: {
    pendingRender: {
      label: {
        zh: '幽灵节点内容插槽',
        en: 'Ghost node content slot',
      },
      defaultStyle: {
        padding: [],
      },
    },
    pendingDotRender: {
      label: {
        zh: '幽灵节点点插槽',
        en: 'Ghost node dot slot',
      },
      defaultStyle: {
        padding: [],
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
    customDotRender: {
      label: {
        zh: '自定义点插槽',
        en: 'Custom dot slot',
      },
      defaultStyle: {
        padding: [],
      },
      payload: {
        item: getModalOrVariableItemType,
      },
    },
    customRender: {
      label: {
        zh: '自定义插槽',
        en: 'Custom slot',
      },
      isMultiple: true,
      defaultStyle: {
        padding: [],
      },
      payload: customItemDefine,
    },
  },
  Render: Timeline,
}

export default timelineMeta
