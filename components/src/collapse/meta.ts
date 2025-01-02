import { EasyCoderElement } from '@easy-coder/sdk/store'
import { GroupDecorator, LineDecorator, ModalMetaSetter, ObjectListSetter, SelectSetter, onModalDependencies } from '@easy-coder/sdk/design'

import ResetSelectSetter from '../alert/setter/resetSelectSetter'
import AddButton from './setter/addButtonRender'
import RemoveButton from './setter/removeButtonRender'
import Collapse, { CollapseProps } from '.'

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

const getModalOrVariableItemType: EasyCoderElement.DynamicVariable<CollapseProps> = async (props, getAttrType) => {
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

const collapseMeta: EasyCoderElement.Desc<CollapseProps> = {
  type: 'system_component_collapse',
  label: '折叠面板',
  defaultAttr: {
    dataFrom: 'modal',
    bordered: true,
    triggerRegion: 'header',
  },
  style: {
    style: {
      label: '样式',
      supportModels: ['background', 'borderRadius', 'boxShadow', 'margin', 'maxWidth', 'minWidth', 'outline', 'padding', 'transform', 'transition', 'width'],
    },
    itemStyle: {
      label: '折叠项样式',
      supportModels: ['background', 'borderRadius', 'margin', 'padding'],
    },
    contentStyle: {
      label: '内容样式',
      supportModels: ['background', 'borderRadius', 'height', 'margin', 'maxHeight', 'minHeight', 'overflow', 'padding'],
    },
  },
  className: {
    className: {
      label: '样式名',
    },
    itemClassName: {
      label: '折叠项样式名',
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
            { key: 'headerRender', type: 'slot' },
            { key: 'extraRender', type: 'slot' },
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
      visible: (props: CollapseProps) => props?.dataFrom === 'modal',
      onDependencies: onModalDependencies,
    },
    variableValue: {
      type: 'ref',
      canAcceptTypes: ['array', 'multipleEnum', 'multipleLookup'],
      label: '关联变量',
      visible: (props: CollapseProps) => props?.dataFrom === 'variable',
    },
    customData: {
      type: 'array',
      label: '折叠项',
      item: {
        type: 'object',
        prototype: {
          id: { type: 'string', label: 'ID' },
          label: { type: 'string', label: '标签' },
        },
      },
      setter: ObjectListSetter,
      setterProps: {
        title: '折叠项',
        labelRender: {
          fieldName: 'label',
          canEdit: true,
        },
        AddButtonRender: AddButton,
        RemoveButtonRender: RemoveButton,
      },
      visible: (props: CollapseProps) => props?.dataFrom === 'custom',
    },

    bordered: {
      type: 'boolean',
      label: '是否有边框',
      disabledFx: true,
    },
    triggerRegion: {
      type: 'string',
      label: '触发折叠区域',
      setter: SelectSetter,
      setterProps: {
        title: '触发折叠区域',
        displayAs: 'button',
        options: [
          { value: 'header', label: '折叠头' },
          { value: 'icon', label: '图标' },
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
      childrenOfAttr: ['dataFrom', 'modalConfig', 'variableValue', 'customData'],
    },
    {
      id: 'line',
      Render: LineDecorator,
    },
    {
      id: 'style',
      Render: GroupDecorator,
      props: {
        title: '外观',
        canFold: true,
      },
      childrenOfAttr: ['bordered', 'triggerRegion'],
    },
  ],
  slot: {
    headerRender: {
      label: '标题插槽',
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
    customRender: {
      label: '自定义插槽',
      isMultiple: true,
      defaultStyle: {
        padding: [],
      },
      payload: customItemDefine,
    },
  },
  Render: Collapse,
}

export default collapseMeta
