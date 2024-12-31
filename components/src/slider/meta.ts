import { EasyCoderElement } from '@easy-coder/sdk/store'
import { GroupDecorator, LineDecorator, SelectSetter } from '@easy-coder/sdk/design'

import Slider, { SliderProps } from '.'

const sliderMeta: EasyCoderElement.Desc<SliderProps> = {
  type: 'system_component_slider',
  label: '滑动输入条',
  defaultAttr: {
    min: 0,
    max: 100,
    step: 1,
    direction: 'horizontal',
    tooltipPosition: 'top',
    tooltipVisible: 'whenHover',
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
  },
  className: {
    className: {
      label: '样式名',
    },
  },
  attr: {
    defaultValue: {
      type: 'number',
      label: '默认值',
    },
    min: {
      type: 'number',
      label: '最小值',
    },
    max: {
      type: 'number',
      label: '最大值',
    },
    step: {
      type: 'number',
      label: '步长',
    },
    disabled: {
      type: 'boolean',
      label: '是否禁用',
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
    tooltipPosition: {
      type: 'string',
      label: '提示显示位置',
      setter: SelectSetter,
      setterProps: {
        title: '提示显示位置',
        options: [
          { value: 'top', label: '上方' },
          { value: 'tl', label: '上方靠左' },
          { value: 'tr', label: '上方靠右' },
          { value: 'bottom', label: '下方' },
          { value: 'bl', label: '下方靠左' },
          { value: 'br', label: '下方靠右' },
          { value: 'left', label: '左侧' },
          { value: 'lt', label: '左侧靠上' },
          { value: 'lb', label: '左侧靠下' },
          { value: 'right', label: '右侧' },
          { value: 'rt', label: '右侧靠上' },
          { value: 'rb', label: '右侧靠下' },
        ],
      },
    },
    tooltipVisible: {
      type: 'string',
      label: '提示显示时机',
      setter: SelectSetter,
      setterProps: {
        title: '提示显示时机',
        options: [
          { value: 'whenHover', label: '鼠标悬浮时' },
          { value: 'until', label: '一直显示' },
          { value: 'none', label: '不显示' },
        ],
      },
    },
    showTicks: {
      type: 'boolean',
      label: '显示刻度线',
      disabledFx: true,
    },
    showInput: {
      type: 'boolean',
      label: '显示输入框',
      disabledFx: true,
    },
  },
  attrDecorators: [
    {
      id: 'data',
      Render: GroupDecorator,
      props: {
        title: '数据设置',
      },
      childrenOfAttr: ['defaultValue', 'min', 'max', 'step', 'disabled'],
    },
    {
      id: 'line',
      Render: LineDecorator,
    },
    {
      id: 'visibleSetting',
      Render: GroupDecorator,
      props: {
        title: '显示配置',
      },
      childrenOfAttr: ['direction', 'tooltipPosition', 'tooltipVisible', 'showTicks', 'showInput'],
    },
  ],
  event: {
    onChange: {
      label: '值改变时',
      params: [{ type: 'number', label: '新值' }],
    },
  },
  export: {
    attr: {
      value: {
        type: 'number',
        label: '值',
      },
      isDisabled: {
        type: 'boolean',
        label: '是否禁用',
      },
    },
    event: {
      setValue: {
        label: '设置值',
        params: [{ type: 'number', label: '新值' }],
      },
      setDisabled: {
        label: '设置是否禁用',
        params: [{ type: 'boolean', label: '是否禁用' }],
      },
    },
  },
  Render: Slider,
}

export default sliderMeta
