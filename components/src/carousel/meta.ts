import { EasyCoderElement } from '@easy-coder/sdk/store'
import { GroupDecorator, LineDecorator, ModalMetaSetter, ObjectListSetter, SelectSetter, onModalDependencies, ResetSelectSetter } from '@easy-coder/sdk/design'
import { i18n, Multilingual } from '@easy-coder/sdk/i18n'

import AddButton from './setter/addButtonRender'
import RemoveButton from './setter/removeButtonRender'
import Carousel, { CarouselProps } from '.'

const customItemDefine: Record<string, EasyCoderElement.OmitApiNameVariable> = {
  id: {
    type: 'string',
    label: {
      zh: 'ID',
      en: 'Id',
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

const getModalOrVariableItemType: EasyCoderElement.DynamicVariable<CarouselProps> = async (props, getAttrType) => {
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
  label: {
    zh: '轮播',
    en: 'Carousel',
  },
  defaultAttr: {
    dataFrom: 'modal',
    fetchCount: 10,
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
      defaultValue: {
        minHeight: { unit: 'px', value: 120 },
      },
    },
  },
  className: {
    className: {
      label: {
        zh: '容器样式名',
        en: 'Container class name',
      },
    },
    arrowClassName: {
      label: {
        zh: '箭头样式名',
        en: 'Arrow class name',
      },
    },
    indicatorClassName: {
      label: {
        zh: '指示器样式名',
        en: 'Indicator class name',
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
            { key: 'itemRender', type: 'slot' },
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
      visible: (props: CarouselProps) => props?.dataFrom === 'modal',
      onDependencies: onModalDependencies,
    },
    fetchCount: {
      type: 'number',
      label: {
        zh: '获取条数',
        en: 'Get the number of items',
      },
      disabledFx: true,
      visible: (props: CarouselProps) => props?.dataFrom === 'modal',
    },
    variableValue: {
      type: 'ref',
      canAcceptTypes: ['array', 'multipleEnum', 'multipleLookup'],
      label: {
        zh: '关联变量',
        en: 'Variable',
      },
      visible: (props: CarouselProps) => props?.dataFrom === 'variable',
    },
    customData: {
      type: 'array',
      label: {
        zh: '轮播项',
        en: 'Carousel item',
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
        title: i18n.translate({ zh: '轮播项', en: 'Carousel item' }),
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
      label: {
        zh: '切换方式',
        en: 'Switching method',
      },
      setter: SelectSetter,
      setterProps: {
        title: i18n.translate({ zh: '切换方式', en: 'Switching method' }),
        options: [
          { value: 'slide', label: i18n.translate({ zh: '滑动', en: 'Slide' }) },
          { value: 'card', label: i18n.translate({ zh: '卡片', en: 'Card' }) },
          { value: 'fade', label: i18n.translate({ zh: '渐隐', en: 'Fade' }) },
        ],
      },
    },
    moveSpeed: {
      type: 'number',
      label: {
        zh: '切换速度(ms)',
        en: 'Switching speed (ms)',
      },
      disabledFx: true,
    },
    autoPlay: {
      type: 'boolean',
      label: {
        zh: '自动播放',
        en: 'Auto play',
      },
      disabledFx: true,
    },
    autoPlayInterval: {
      type: 'number',
      label: {
        zh: '自动播放间隔时长(ms)',
        en: 'Automatic playback interval duration (ms)',
      },
      disabledFx: true,
      visible: (props: CarouselProps) => !!props.autoPlay,
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
    showArrow: {
      type: 'string',
      label: {
        zh: '显示箭头的时机',
        en: 'Timing of displaying arrows',
      },
      setter: SelectSetter,
      setterProps: {
        title: i18n.translate({ zh: '显示箭头的时机', en: 'Timing of displaying arrows' }),
        options: [
          { value: 'hover', label: i18n.translate({ zh: '鼠标进入', en: 'Mouse enter' }) },
          { value: 'always', label: i18n.translate({ zh: '一直显示', en: 'Always' }) },
          { value: 'never', label: i18n.translate({ zh: '不显示', en: 'Never' }) },
        ],
      },
    },
    indicatorType: {
      type: 'string',
      label: {
        zh: '指示器类型',
        en: 'Indicator type',
      },
      setter: SelectSetter,
      setterProps: {
        title: i18n.translate({ zh: '指示器类型', en: 'Indicator type' }),
        options: [
          { value: 'dot', label: i18n.translate({ zh: '点', en: 'Dot' }) },
          { value: 'line', label: i18n.translate({ zh: '线', en: 'Line' }) },
          { value: 'slider', label: i18n.translate({ zh: '滑块', en: 'Slider' }) },
          { value: 'never', label: i18n.translate({ zh: '不显示', en: 'Never' }) },
        ],
      },
    },
    indicatorPosition: {
      type: 'string',
      label: {
        zh: '指示器位置',
        en: 'Indicator position',
      },
      setter: SelectSetter,
      setterProps: {
        title: i18n.translate({ zh: '指示器位置', en: 'Indicator position' }),
        options: [
          { value: 'bottom', label: i18n.translate({ zh: '下方', en: 'Bottom' }) },
          { value: 'top', label: i18n.translate({ zh: '上方', en: 'Top' }) },
          { value: 'left', label: i18n.translate({ zh: '左侧', en: 'Left' }) },
          { value: 'right', label: i18n.translate({ zh: '右侧', en: 'Right' }) },
          { value: 'outer', label: i18n.translate({ zh: '外部', en: 'Outer' }) },
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
        title: i18n.translate({ zh: '数据配置', en: 'Data setting' }),
        canFold: true,
      },
      childrenOfAttr: ['dataFrom', 'modalConfig', 'fetchCount', 'variableValue', 'customData'],
    },
    {
      id: 'line1',
      Render: LineDecorator,
    },
    {
      id: 'transition',
      Render: GroupDecorator,
      props: {
        title: i18n.translate({ zh: '过度配置', en: 'Transition setting' }),
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
        title: i18n.translate({ zh: '外观', en: 'Appearance' }),
        canFold: true,
      },
      childrenOfAttr: ['direction', 'showArrow', 'indicatorPosition', 'indicatorType'],
    },
  ],
  event: {
    onChange: {
      label: {
        zh: '切换时',
        en: 'When switching',
      },
      params: [createGetItemTypeFn()],
    },
  },
  slot: {
    itemRender: {
      label: {
        zh: '循环插槽',
        en: 'Circular slot',
      },
      payload: { item: getModalOrVariableItemType },
    },
    customRender: {
      label: {
        zh: '自定义插槽',
        en: 'Custom slot',
      },
      isMultiple: true,
      payload: customItemDefine,
    },
  },
  Render: Carousel,
}

export default carouselMeta
