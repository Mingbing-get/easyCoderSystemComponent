import { EasyCoderElement } from '@easy-coder/sdk/store'
import { GroupDecorator, LineDecorator, ModalMetaSetter, ObjectListSetter, SelectSetter, onModalDependencies } from '@easy-coder/sdk/design'

import ResetSelectSetter from '../alert/setter/resetSelectSetter'
import AddButton from './setter/addButtonRender'
import RemoveButton from './setter/removeButtonRender'
import Carousel, { CarouselProps } from '.'

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

const getModalOrVariableItemType: EasyCoderElement.DynamicVariable<CarouselProps> = async (props, getAttrType) => {
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
  const getItemType: EasyCoderElement.DynamicVariable<CarouselProps> = async (props, getAttrType) => {
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

const carouselMeta: EasyCoderElement.Desc<CarouselProps> = {
  type: 'system_component_carousel',
  label: '轮播',
  defaultAttr: {
    dataFrom: 'modal',
    moveSpeed: 500,
    animation: 'slide',
    direction: 'horizontal',
    indicatorPosition: 'bottom',
    indicatorType: 'dot',
    showArrow: 'hover',
    autoPlayInterval: 5000,
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
      defaultValue: {
        minHeight: { unit: 'px', value: 120 },
      },
    },
  },
  className: {
    className: {
      label: '容器样式名',
    },
    arrowClassName: {
      label: '剪头样式名',
    },
    indicatorClassName: {
      label: '指示器样式名',
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
            { key: 'itemRender', type: 'slot' },
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
      visible: (props: CarouselProps) => props?.dataFrom === 'modal',
      onDependencies: onModalDependencies,
    },
    variableValue: {
      type: 'ref',
      canAcceptTypes: ['array', 'multipleEnum', 'multipleLookup'],
      label: '关联变量',
      visible: (props: CarouselProps) => props?.dataFrom === 'variable',
    },
    customData: {
      type: 'array',
      label: '轮播项',
      item: {
        type: 'object',
        prototype: {
          id: { type: 'string', label: 'ID' },
          label: { type: 'string', label: '标签' },
          slotId: { type: 'string', label: '插槽ID' },
        },
      },
      setter: ObjectListSetter,
      setterProps: {
        title: '轮播项',
        labelRender: {
          fieldName: 'label',
          canEdit: true,
        },
        AddButtonRender: AddButton,
        RemoveButtonRender: RemoveButton,
      },
      visible: (props: CarouselProps) => props?.dataFrom === 'custom',
    },

    animation: {
      type: 'string',
      label: '切换方式',
      setter: SelectSetter,
      setterProps: {
        title: '切换方式',
        options: [
          { value: 'slide', label: '滑动' },
          { value: 'card', label: '卡片' },
          { value: 'fade', label: '渐隐' },
        ],
      },
    },
    moveSpeed: {
      type: 'number',
      label: '切换速度(ms)',
      disabledFx: true,
    },
    autoPlay: {
      type: 'boolean',
      label: '自动播放',
      disabledFx: true,
    },
    autoPlayInterval: {
      type: 'number',
      label: '自动播放间隔时长(ms)',
      disabledFx: true,
      visible: (props: CarouselProps) => !!props.autoPlay,
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
    showArrow: {
      type: 'string',
      label: '显示箭头的时机',
      setter: SelectSetter,
      setterProps: {
        title: '显示箭头的时机',
        options: [
          { value: 'hover', label: '鼠标进入' },
          { value: 'always', label: '一直显示' },
          { value: 'never', label: '不显示' },
        ],
      },
    },
    indicatorType: {
      type: 'string',
      label: '指示器类型',
      setter: SelectSetter,
      setterProps: {
        title: '指示器类型',
        options: [
          { value: 'dot', label: '点' },
          { value: 'line', label: '线' },
          { value: 'slider', label: '滑块' },
          { value: 'never', label: '不显示' },
        ],
      },
    },
    indicatorPosition: {
      type: 'string',
      label: '指示器位置',
      setter: SelectSetter,
      setterProps: {
        title: '指示器位置',
        options: [
          { value: 'bottom', label: '下方' },
          { value: 'top', label: '上方' },
          { value: 'left', label: '左侧' },
          { value: 'right', label: '右侧' },
          { value: 'outer', label: '外部' },
        ],
      },
      visible: (props: CarouselProps) => props.indicatorType !== 'never',
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
      id: 'line1',
      Render: LineDecorator,
    },
    {
      id: 'transition',
      Render: GroupDecorator,
      props: {
        title: '过度配置',
        canFold: true,
      },
      childrenOfAttr: ['animation', 'moveSpeed', 'autoPlay', 'autoPlayInterval'],
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
      childrenOfAttr: ['direction', 'showArrow', 'indicatorPosition', 'indicatorType'],
    },
  ],
  event: {
    onChange: {
      label: '切换时',
      params: [createGetItemTypeFn()],
    },
  },
  slot: {
    itemRender: {
      label: '循环插槽',
      payload: { item: getModalOrVariableItemType },
    },
    customRender: {
      label: '自定义插槽',
      isMultiple: true,
      payload: customItemDefine,
    },
  },
  Render: Carousel,
}

export default carouselMeta
