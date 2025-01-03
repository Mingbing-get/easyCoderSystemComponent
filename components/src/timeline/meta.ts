import { EasyCoderElement } from '@easy-coder/sdk/store'
import { GroupDecorator, LineDecorator, ModalMetaSetter, ObjectListSetter, SelectSetter, onModalDependencies } from '@easy-coder/sdk/design'

import ResetSwitchSetter from '../alert/setter/resetSwitchSetter'
import ResetSelectSetter from '../alert/setter/resetSelectSetter'
import useCustomDotSetter from './setter/useCustomDotSetter'
import AddButton from './setter/addButtonRender'
import RemoveButton from './setter/removeButtonRender'
import PanelRender from './setter/panelRender'

import Timeline, { TimelineProps } from '.'

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

const getModalOrVariableItemType: EasyCoderElement.DynamicVariable<TimelineProps> = async (props, getAttrType) => {
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

const timelineMeta: EasyCoderElement.Desc<TimelineProps> = {
  type: 'system_component_timeline',
  label: '时间线',
  defaultAttr: {
    dataFrom: 'modal',
    direction: 'horizontal',
    mode: 'top',
    dotType: 'solid',
    lineType: 'solid',
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
      label: '节点项样式',
      supportModels: ['background', 'borderColor', 'borderRadius', 'borderStyle', 'borderWidth', 'boxShadow', 'margin', 'outline', 'padding'],
    },
  },
  className: {
    className: {
      label: '样式名',
    },
    itemClassName: {
      label: '节点项样式名',
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
            { key: 'customDotRender', type: 'slot' },
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
      visible: (props: TimelineProps) => props?.dataFrom === 'modal',
      onDependencies: onModalDependencies,
    },
    variableValue: {
      type: 'ref',
      canAcceptTypes: ['array', 'multipleEnum', 'multipleLookup'],
      label: '关联变量',
      visible: (props: TimelineProps) => props?.dataFrom === 'variable',
    },
    customData: {
      type: 'array',
      label: '节点项',
      item: {
        type: 'object',
        prototype: {
          id: { type: 'string', label: 'ID' },
          label: { type: 'string', label: '标签' },
          dotType: { type: 'string', label: '点类型' },
          lineType: { type: 'string', label: '线类型' },
        },
      },
      setter: ObjectListSetter,
      setterProps: {
        title: '节点项',
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
      label: '使用幽灵节点',
      setter: ResetSwitchSetter,
      setterProps: {
        title: '使用幽灵节点',
        size: 'small',
        whenFalse: [
          { key: 'pendingRender', type: 'slot' },
          { key: 'pendingDotRender', type: 'slot' },
        ],
      },
    },
    useCustomDot: {
      type: 'boolean',
      label: '使用自定义点',
      setter: useCustomDotSetter,
      setterProps: {
        title: '使用自定义点',
        size: 'small',
      },
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
    mode: {
      type: 'string',
      label: '展示类型',
      setter: SelectSetter,
      setterProps: {
        title: '展示类型',
        options: [
          { value: 'left', label: '靠左' },
          { value: 'right', label: '靠右' },
          { value: 'top', label: '靠上' },
          { value: 'bottom', label: '靠下' },
          { value: 'alternate', label: '交替' },
        ],
      },
    },
    dotType: {
      type: 'string',
      label: '点的类型',
      setter: SelectSetter,
      setterProps: {
        title: '点的类型',
        displayAs: 'button',
        options: [
          { value: 'solid', label: '实心圆' },
          { value: 'hollow', label: '空心圆' },
        ],
      },
      visible: (props: TimelineProps) => !props.useCustomDot,
    },
    lineType: {
      type: 'string',
      label: '线的类型',
      setter: SelectSetter,
      setterProps: {
        title: '线的类型',
        options: [
          { value: 'solid', label: '实线' },
          { value: 'dashed', label: '虚线' },
          { value: 'dotted', label: '点线' },
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
      childrenOfAttr: ['dataFrom', 'variableValue', 'modalConfig', 'customData'],
    },
    {
      id: 'line1',
      Render: LineDecorator,
    },
    {
      id: 'custom',
      Render: GroupDecorator,
      props: {
        title: '自定义配置',
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
        title: '外观',
        canFold: true,
      },
      childrenOfAttr: ['direction', 'mode', 'dotType', 'lineType'],
    },
  ],
  slot: {
    pendingRender: {
      label: '幽灵节点内容插槽',
      defaultStyle: {
        padding: [],
      },
    },
    pendingDotRender: {
      label: '幽灵节点点插槽',
      defaultStyle: {
        padding: [],
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
    customDotRender: {
      label: '自定义点插槽',
      defaultStyle: {
        padding: [],
      },
      payload: {
        item: getModalOrVariableItemType,
      },
    },
    customRender: {
      label: '自定义插槽',
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
