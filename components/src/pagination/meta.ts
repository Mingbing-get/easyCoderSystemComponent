import { EasyCoderElement } from '@easy-coder/sdk/store'
import { GroupDecorator, SelectSetter } from '@easy-coder/sdk/design'
import { i18n } from '@easy-coder/sdk/i18n'

import Pagination, { PaginationProps } from '.'

const paginationMeta: EasyCoderElement.Desc<PaginationProps> = {
  type: 'system_component_pagination',
  label: {
    zh: '分页器',
    en: 'Pagination',
  },
  defaultAttr: {
    pageSizeChangeResetCurrent: true,
    bufferSize: 2,
    defaultCurrent: 1,
    defaultPageSize: 10,
    size: 'default',
  },
  style: {
    style: {
      label: {
        zh: '分页器样式',
        en: 'Pagination style',
      },
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
    pageItemStyle: {
      label: {
        zh: '分页按钮样式',
        en: 'Pagination button style',
      },
      supportModels: [
        'background',
        'borderRadius',
        'borderStyle',
        'borderWidth',
        'boxShadow',
        'color',
        'cursor',
        'fontSize',
        'fontStyle',
        'fontWeight',
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
    activePageItemStyle: {
      label: {
        zh: '被选中的分页按钮样式',
        en: 'Active pagination button style',
      },
      supportModels: [
        'background',
        'borderRadius',
        'borderStyle',
        'borderWidth',
        'boxShadow',
        'color',
        'cursor',
        'fontSize',
        'fontStyle',
        'fontWeight',
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
  attr: {
    defaultCurrent: {
      label: {
        zh: '当前页默认值',
        en: 'Current page default value',
      },
      type: 'number',
    },
    defaultPageSize: {
      label: {
        zh: '每页大小默认值',
        en: 'Page size default value',
      },
      type: 'number',
    },
    total: {
      label: {
        zh: '总条数默认值',
        en: 'Total number of default value',
      },
      type: 'number',
    },
    disabled: {
      label: {
        zh: '是否禁用',
        en: 'Is disable',
      },
      type: 'boolean',
    },

    hideOnSinglePage: {
      label: {
        zh: '是否在只有一页的情况下隐藏',
        en: 'Hide when only one page',
      },
      type: 'boolean',
      disabledFx: true,
    },
    pageSizeChangeResetCurrent: {
      label: {
        zh: 'pageSize改变时将页面重置为1',
        en: 'pageSize change reset current page to 1',
      },
      type: 'boolean',
      disabledFx: true,
    },
    showJumper: {
      label: {
        zh: '是否显示快速跳',
        en: 'Show quick jump',
      },
      type: 'boolean',
      disabledFx: true,
    },
    showMore: {
      label: {
        zh: '是否显示更多页码提示',
        en: 'Show more page number prompt',
      },
      type: 'boolean',
      disabledFx: true,
    },
    simple: {
      label: {
        zh: '是否应用精简分页模式',
        en: 'Apply simple pagination mode',
      },
      type: 'boolean',
      disabledFx: true,
    },
    sizeCanChange: {
      label: {
        zh: '是否可以改变每页条数',
        en: 'Whether the page size can be changed',
      },
      type: 'boolean',
      disabledFx: true,
    },
    showTotal: {
      label: {
        zh: '是否显示总条数',
        en: 'Whether to display the total number of pages',
      },
      type: 'boolean',
      disabledFx: true,
    },
    bufferSize: {
      label: {
        zh: '连续显示的页码数',
        en: 'Number of continuous displayed pages',
      },
      type: 'number',
      disabledFx: true,
    },
    size: {
      label: {
        zh: '分页器尺寸',
        en: 'Pagination size',
      },
      type: 'string',
      setter: SelectSetter,
      setterProps: {
        title: i18n.translate({ zh: '分页器尺寸', en: 'Pagination size' }),
        options: [
          { value: 'mini', label: i18n.translate({ zh: '极小', en: 'Mini' }) },
          { value: 'small', label: i18n.translate({ zh: '小', en: 'Small' }) },
          { value: 'default', label: i18n.translate({ zh: '默认', en: 'Default' }) },
          { value: 'large', label: i18n.translate({ zh: '大', en: 'Large' }) },
        ],
      },
    },
  },
  attrDecorators: [
    {
      id: 'data',
      Render: GroupDecorator,
      props: {
        title: i18n.translate({ zh: '数据配置', en: 'Data configuration' }),
        canFold: true,
      },
      childrenOfAttr: ['defaultCurrent', 'defaultPageSize', 'total', 'disabled'],
    },
    {
      id: 'visible-setting',
      Render: GroupDecorator,
      props: {
        title: i18n.translate({ zh: '显示配置', en: 'Visible configuration' }),
        canFold: true,
      },
      childrenOfAttr: ['hideOnSinglePage', 'pageSizeChangeResetCurrent', 'showJumper', 'showMore', 'simple', 'sizeCanChange', 'showTotal', 'bufferSize'],
    },
    {
      id: 'style',
      Render: GroupDecorator,
      props: {
        title: i18n.translate({ zh: '外观', en: 'Appearance' }),
      },
      childrenOfAttr: ['size'],
    },
  ],
  event: {
    onChange: {
      label: {
        zh: '页码改变时',
        en: 'Page number change',
      },
      params: [
        { type: 'number', label: { zh: '当前页', en: 'Current page' } },
        { type: 'number', label: { zh: '单页条数', en: 'Page size' } },
      ],
    },
    onPageSizeChange: {
      label: {
        zh: '单页条数改变时',
        en: 'Page size change',
      },
      params: [
        { type: 'number', label: { zh: '单页条数', en: 'Page size' } },
        { type: 'number', label: { zh: '当前页', en: 'Current page' } },
      ],
    },
  },
  export: {
    attr: {
      total: {
        label: {
          zh: '总条数',
          en: 'Total number',
        },
        type: 'number',
      },
      current: {
        label: {
          zh: '当前页',
          en: 'Current page',
        },
        type: 'number',
      },
      pageSize: {
        label: {
          zh: '单页条数',
          en: 'Page size',
        },
        type: 'number',
      },
    },
    event: {
      setTotal: {
        label: {
          zh: '设置总条数',
          en: 'Set total number',
        },
        params: [{ type: 'number', label: { zh: '总条数', en: 'Total number' } }],
      },
      setCurrent: {
        label: {
          zh: '设置当前页',
          en: 'Set current page',
        },
        params: [{ type: 'number', label: { zh: '当前页', en: 'Current page' } }],
      },
      setPageSize: {
        label: {
          zh: '设置单页条数',
          en: 'Set page size',
        },
        params: [{ type: 'number', label: { zh: '单页条数', en: 'Page size' } }],
      },
    },
  },
  Render: Pagination,
}

export default paginationMeta
