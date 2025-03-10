import { EasyCoderElement } from '@easy-coder/sdk/store'
import { GroupDecorator, LineDecorator, ModalMetaSetter, ObjectListSetter, SelectSetter, onModalDependencies, ResetSelectSetter } from '@easy-coder/sdk/design'
import { i18n } from '@easy-coder/sdk/i18n'

import AddButton from './setter/addButtonRender'
import RemoveButton from './setter/removeButtonRender'
import Collapse, { CollapseProps } from '.'

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

const getModalOrVariableItemType: EasyCoderElement.DynamicVariable<CollapseProps> = async (props, getAttrType) => {
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

const collapseMeta: EasyCoderElement.Desc<CollapseProps> = {
  type: 'system_component_collapse',
  label: {
    zh: '折叠面板',
    en: 'Collapse',
  },
  defaultAttr: {
    dataFrom: 'modal',
    fetchCount: 10,
    bordered: true,
    triggerRegion: 'header',
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
        'borderRadius',
        'boxShadow',
        'margin',
        'maxWidth',
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
        zh: '折叠项样式',
        en: 'Item style',
      },
      supportModels: ['background', 'filter', 'opacity', 'zIndex', 'borderRadius', 'margin', 'padding'],
    },
    contentStyle: {
      label: {
        zh: '内容样式',
        en: 'Content style',
      },
      supportModels: ['background', 'filter', 'opacity', 'zIndex', 'borderRadius', 'height', 'margin', 'maxHeight', 'minHeight', 'overflow', 'padding'],
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
        zh: '折叠项样式名',
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
          { value: 'modal', label: i18n.translate({ zh: '数据模型', en: 'Data model' }) },
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
      visible: (props: CollapseProps) => props?.dataFrom === 'modal',
      onDependencies: onModalDependencies,
    },
    fetchCount: {
      type: 'number',
      label: {
        zh: '获取条数',
        en: 'Fetch count',
      },
      disabledFx: true,
      visible: (props: CollapseProps) => props?.dataFrom === 'modal',
    },
    variableValue: {
      type: 'ref',
      canAcceptTypes: ['array', 'multipleEnum', 'multipleLookup'],
      label: {
        zh: '关联变量',
        en: 'Variable',
      },
      visible: (props: CollapseProps) => props?.dataFrom === 'variable',
    },
    customData: {
      type: 'array',
      label: {
        zh: '自定义数据',
        en: 'Custom data',
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
        title: i18n.translate({ zh: '自定义数据', en: 'Custom data' }),
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
      label: {
        zh: '是否有边框',
        en: 'Bordered',
      },
      disabledFx: true,
    },
    triggerRegion: {
      type: 'string',
      label: {
        zh: '触发折叠区域',
        en: 'Trigger region',
      },
      setter: SelectSetter,
      setterProps: {
        title: i18n.translate({ zh: '触发折叠区域', en: 'Trigger region' }),
        displayAs: 'button',
        options: [
          { value: 'header', label: i18n.translate({ zh: '折叠头', en: 'Header' }) },
          { value: 'icon', label: i18n.translate({ zh: '图标', en: 'Icon' }) },
        ],
      },
    },
  },
  attrDecorators: [
    {
      id: 'data',
      Render: GroupDecorator,
      props: {
        title: i18n.translate({ zh: '数据配置', en: 'Data config' }),
        canFold: true,
      },
      childrenOfAttr: ['dataFrom', 'modalConfig', 'fetchCount', 'variableValue', 'customData'],
    },
    {
      id: 'line',
      Render: LineDecorator,
    },
    {
      id: 'style',
      Render: GroupDecorator,
      props: {
        title: i18n.translate({ zh: '外观', en: 'Appearance' }),
        canFold: true,
      },
      childrenOfAttr: ['bordered', 'triggerRegion'],
    },
  ],
  slot: {
    headerRender: {
      label: {
        zh: '标题插槽',
        en: 'Header slot',
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
  Render: Collapse,
}

export default collapseMeta
