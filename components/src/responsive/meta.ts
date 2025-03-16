import { EasyCoderElement } from '@easy-coder/sdk/store'
import { SelectSetter, InProStyleSetter, onStyleDependencies, GroupDecorator, ObjectListSetter } from '@easy-coder/sdk/design'
import { i18n } from '@easy-coder/sdk/i18n'

import Responsive, { ResponsiveProps } from '.'
import { editorStyleModels } from './config'
import BreakPointPanelRender from './setter/breakPointPanelRender'
import onBreakPointDependencies from './setter/onBreakPointDependencies'

const responsiveMeta: EasyCoderElement.Desc<ResponsiveProps> = {
  type: 'system_component_responsive',
  label: {
    zh: '响应式容器',
    en: 'Responsive container',
  },
  defaultAttr: {
    observeType: 'screen',
  },
  style: {
    style: {
      label: {
        zh: '样式',
        en: 'Style',
      },
      supportModels: [
        'alignItems',
        'background',
        'backgroundClip',
        'borderColor',
        'borderRadius',
        'borderStyle',
        'borderWidth',
        'boxShadow',
        'boxSizing',
        'cursor',
        'display',
        'filter',
        'flexDirection',
        'gap',
        'gridAutoFlow',
        'gridGap',
        'gridTemplate',
        'height',
        'justifyContent',
        'margin',
        'maxHeight',
        'maxWidth',
        'minWidth',
        'minHeight',
        'opacity',
        'outline',
        'overflow',
        'padding',
        'position',
        'transform',
        'transition',
        'width',
        'zIndex',
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
    observeType: {
      type: 'string',
      label: {
        zh: '监听目标',
        en: 'Observer target',
      },
      setter: SelectSetter,
      setterProps: {
        title: i18n.translate({ zh: '监听目标', en: 'Observer target' }),
        size: 'mini',
        displayAs: 'button',
        options: [
          { value: 'screen', label: i18n.translate({ zh: '屏幕', en: 'Screen' }) },
          { value: 'box', label: i18n.translate({ zh: '当前容器', en: 'Current container' }) },
        ],
      },
    },
    defaultStyle: {
      type: 'object',
      prototype: {},
      label: {
        zh: '未匹配到断点时样式',
        en: 'Style when breakpoint not matched',
      },
      setter: InProStyleSetter,
      setterProps: {
        title: i18n.translate({ zh: '未匹配到断点时样式', en: 'Style when breakpoint not matched' }),
        supportModels: editorStyleModels,
      },
      onDependencies: onStyleDependencies,
    },
    screenBreakPoints: {
      type: 'array',
      item: {
        type: 'object',
        prototype: {},
      },
      label: {
        zh: '屏幕断点',
        en: 'Screen break point',
      },
      setter: ObjectListSetter,
      setterProps: {
        title: i18n.translate({ zh: '屏幕断点', en: 'Screen break point' }),
        labelRender: {
          fieldName: 'label',
          canEdit: true,
        },
        PanelRender: BreakPointPanelRender,
      },
      onDependencies: onBreakPointDependencies,
      visible: (props) => props?.observeType === 'screen',
    },
    boxBreakPoints: {
      type: 'array',
      item: {
        type: 'object',
        prototype: {},
      },
      label: {
        zh: '容器断点',
        en: 'Container break point',
      },
      setter: ObjectListSetter,
      setterProps: {
        title: i18n.translate({ zh: '容器断点', en: 'Container break point' }),
        labelRender: {
          fieldName: 'label',
          canEdit: true,
        },
        PanelRender: BreakPointPanelRender,
      },
      onDependencies: onBreakPointDependencies,
      visible: (props) => props?.observeType === 'box',
    },
  },
  attrDecorators: [
    {
      id: 'base',
      Render: GroupDecorator,
      props: {
        title: i18n.translate({ zh: '设置', en: 'Settings' }),
      },
      childrenOfAttr: ['observeType', 'defaultStyle', 'screenBreakPoints', 'boxBreakPoints'],
    },
  ],
  slot: {
    children: {
      label: {
        zh: '插槽',
        en: 'Slot',
      },
      payload: {
        pointIndex: {
          type: 'number',
          label: {
            zh: '当前断点下标',
            en: 'Current break point index',
          },
        },
      },
    },
  },
  Render: Responsive,
}

export default responsiveMeta
