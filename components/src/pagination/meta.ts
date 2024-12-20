import { EasyCoderElement } from '@easy-coder/sdk/store'
import { GroupDecorator, SelectSetter } from '@easy-coder/sdk/design'

import Pagination, { PaginationProps } from '.'

const paginationMeta: EasyCoderElement.Desc<PaginationProps> = {
  type: 'system_component_pagination',
  label: '分页器',
  defaultAttr: {
    pageSizeChangeResetCurrent: true,
    bufferSize: 2,
    defaultCurrent: 1,
    defaultPageSize: 10,
    size: 'default',
  },
  style: {
    style: {
      label: '分页器样式',
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
      label: '分页按钮样式',
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
      label: '被选中的分页按钮样式',
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
      label: '当前页默认值',
      type: 'number',
    },
    defaultPageSize: {
      label: '每页大小默认值',
      type: 'number',
    },
    total: {
      label: '总条数默认值',
      type: 'number',
    },
    disabled: {
      label: '是否禁用',
      type: 'boolean',
    },

    hideOnSinglePage: {
      label: '是否在只有一页的情况下隐藏',
      type: 'boolean',
      disabledFx: true,
    },
    pageSizeChangeResetCurrent: {
      label: 'pageSize改变时将页面重置为1',
      type: 'boolean',
      disabledFx: true,
    },
    showJumper: {
      label: '是否显示快速跳',
      type: 'boolean',
      disabledFx: true,
    },
    showMore: {
      label: '是否显示更多页码提示',
      type: 'boolean',
      disabledFx: true,
    },
    simple: {
      label: '是否应用精简分页模式',
      type: 'boolean',
      disabledFx: true,
    },
    sizeCanChange: {
      label: '是否可以改变每页条数',
      type: 'boolean',
      disabledFx: true,
    },
    showTotal: {
      label: '是否显示总条数',
      type: 'boolean',
      disabledFx: true,
    },
    bufferSize: {
      label: '连续显示的页码数',
      type: 'number',
      disabledFx: true,
    },
    size: {
      label: '分页器尺寸',
      type: 'string',
      setter: SelectSetter,
      setterProps: {
        title: '分页器尺寸',
        options: [
          { value: 'mini', label: '极小' },
          { value: 'small', label: '小' },
          { value: 'default', label: '默认' },
          { value: 'large', label: '大' },
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
      childrenOfAttr: ['defaultCurrent', 'defaultPageSize', 'total', 'disabled'],
    },
    {
      id: 'visible-setting',
      Render: GroupDecorator,
      props: {
        title: '显示配置',
        canFold: true,
      },
      childrenOfAttr: ['hideOnSinglePage', 'pageSizeChangeResetCurrent', 'showJumper', 'showMore', 'simple', 'sizeCanChange', 'showTotal', 'bufferSize'],
    },
    {
      id: 'style',
      Render: GroupDecorator,
      props: {
        title: '外观',
      },
      childrenOfAttr: ['size'],
    },
  ],
  event: {
    onChange: {
      label: '页码改变时',
      params: [
        { type: 'number', label: '当前页' },
        { type: 'number', label: '单页条数' },
      ],
    },
    onPageSizeChange: {
      label: '单页条数改变时',
      params: [
        { type: 'number', label: '单页条数' },
        { type: 'number', label: '当前页' },
      ],
    },
  },
  export: {
    attr: {
      total: {
        label: '总条数',
        type: 'number',
      },
      current: {
        label: '当前页',
        type: 'number',
      },
      pageSize: {
        label: '单页条数',
        type: 'number',
      },
    },
    event: {
      setTotal: {
        label: '设置总条数',
        params: [{ type: 'number', label: '总条数' }],
      },
      setCurrent: {
        label: '设置当前页',
        params: [{ type: 'number', label: '当前页' }],
      },
      setPageSize: {
        label: '设置单页条数',
        params: [{ type: 'number', label: '单页条数' }],
      },
    },
  },
  Render: Pagination,
}

export default paginationMeta
