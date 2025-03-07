import { EasyCoderElement } from '@easy-coder/sdk/store'
import { GroupDecorator, LineDecorator, SelectSetter } from '@easy-coder/sdk/design'
import { i18n } from '@easy-coder/sdk/i18n'

import Slider, { SliderProps } from '.'

const sliderMeta: EasyCoderElement.Desc<SliderProps> = {
  type: 'system_component_slider',
  label: {
    zh: '滑动输入条',
    en: 'slider',
  },
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
      label: {
        zh: '样式名',
        en: 'Classname',
      },
    },
  },
  attr: {
    defaultValue: {
      type: 'number',
      label: {
        zh: '默认值',
        en: 'Default value',
      },
    },
    min: {
      type: 'number',
      label: {
        zh: '最小值',
        en: 'Min value',
      },
    },
    max: {
      type: 'number',
      label: {
        zh: '最大值',
        en: 'Max value',
      },
    },
    step: {
      type: 'number',
      label: {
        zh: '步长',
        en: 'Step',
      },
    },
    disabled: {
      type: 'boolean',
      label: {
        zh: '是否禁用',
        en: 'Disabled',
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
    tooltipPosition: {
      type: 'string',
      label: {
        zh: '提示显示位置',
        en: 'Tooltip position',
      },
      setter: SelectSetter,
      setterProps: {
        title: i18n.translate({ zh: '提示显示位置', en: 'Tooltip position' }),
        options: [
          { value: 'top', label: i18n.translate({ zh: '上方', en: 'Top' }) },
          { value: 'tl', label: i18n.translate({ zh: '上方靠左', en: 'Top left' }) },
          { value: 'tr', label: i18n.translate({ zh: '上方靠右', en: 'Top right' }) },
          { value: 'bottom', label: i18n.translate({ zh: '下方', en: 'Bottom' }) },
          { value: 'bl', label: i18n.translate({ zh: '下方靠左', en: 'Bottom left' }) },
          { value: 'br', label: i18n.translate({ zh: '下方靠右', en: 'Bottom right' }) },
          { value: 'left', label: i18n.translate({ zh: '左侧', en: 'Left' }) },
          { value: 'lt', label: i18n.translate({ zh: '左侧靠上', en: 'Left top' }) },
          { value: 'lb', label: i18n.translate({ zh: '左侧靠下', en: 'Left bottom' }) },
          { value: 'right', label: i18n.translate({ zh: '右侧', en: 'Right' }) },
          { value: 'rt', label: i18n.translate({ zh: '右侧靠上', en: 'Right top' }) },
          { value: 'rb', label: i18n.translate({ zh: '右侧靠下', en: 'Right bottom' }) },
        ],
      },
    },
    tooltipVisible: {
      type: 'string',
      label: {
        zh: '提示显示时机',
        en: 'Prompt display timing',
      },
      setter: SelectSetter,
      setterProps: {
        title: i18n.translate({ zh: '提示显示时机', en: 'Prompt display timing' }),
        options: [
          { value: 'whenHover', label: i18n.translate({ zh: '鼠标悬停时', en: 'Mouse hover' }) },
          { value: 'until', label: i18n.translate({ zh: '一直显示', en: 'Always display' }) },
          { value: 'none', label: i18n.translate({ zh: '不显示', en: 'Do not display' }) },
        ],
      },
    },
    showTicks: {
      type: 'boolean',
      label: {
        zh: '显示刻度线',
        en: 'Show ticks',
      },
      disabledFx: true,
    },
    showInput: {
      type: 'boolean',
      label: {
        zh: '显示输入框',
        en: 'Show input',
      },
      disabledFx: true,
    },
  },
  attrDecorators: [
    {
      id: 'data',
      Render: GroupDecorator,
      props: {
        title: i18n.translate({ zh: '数据设置', en: 'Data setting' }),
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
        title: i18n.translate({ zh: '显示配置', en: 'Visible setting' }),
      },
      childrenOfAttr: ['direction', 'tooltipPosition', 'tooltipVisible', 'showTicks', 'showInput'],
    },
  ],
  event: {
    onChange: {
      label: {
        zh: '值改变时',
        en: 'Value changed',
      },
      params: [{ type: 'number', label: { zh: '新值', en: 'New value' } }],
    },
  },
  export: {
    attr: {
      value: {
        type: 'number',
        label: {
          zh: '值',
          en: 'Value',
        },
      },
      isDisabled: {
        type: 'boolean',
        label: {
          zh: '是否禁用',
          en: 'Is disabled',
        },
      },
    },
    event: {
      setValue: {
        label: {
          zh: '设置值',
          en: 'Set value',
        },
        params: [{ type: 'number', label: { zh: '新值', en: 'New value' } }],
      },
      setDisabled: {
        label: {
          zh: '设置是否禁用',
          en: 'Set is disabled',
        },
        params: [{ type: 'boolean', label: { zh: '是否禁用', en: 'Is disabled' } }],
      },
    },
  },
  Render: Slider,
}

export default sliderMeta
