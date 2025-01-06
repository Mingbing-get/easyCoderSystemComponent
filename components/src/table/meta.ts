import { EasyCoderElement } from '@easy-coder/sdk/store'
import { GroupDecorator, LineDecorator, ModalMetaSetter, SelectSetter, onModalDependencies, ResetSelectSetter } from '@easy-coder/sdk/design'

import onColumnDependencies from './setter/onColumnDependencies'

import Table, { TableProps } from '.'

function createType(label: string) {
  const createTypeByProps: EasyCoderElement.DynamicVariable<TableProps> = async (props, getAttrType) => {
    if (props?.dataFrom === 'modal') {
      if (!props.modalConfig?.name) return

      return {
        type: 'lookup',
        label,
        modalName: props.modalConfig.name,
      }
    } else if (props?.dataFrom === 'variable') {
      const variableType = await getAttrType('variableValue')
      if (variableType?.type === 'array') {
        return {
          ...variableType.item,
          label,
        }
      } else if (variableType?.type === 'multipleLookup') {
        return {
          type: 'lookup',
          label,
          modalName: variableType.modalName,
        }
      }
    }
  }

  return createTypeByProps
}

function createMultipleModalType(label: string) {
  const createTypeByProps: EasyCoderElement.DynamicVariable<TableProps> = async (props, getAttrType) => {
    if (props?.dataFrom === 'modal' && props?.showSelection) {
      if (!props.modalConfig?.name) return

      return {
        type: 'multipleLookup',
        label,
        modalName: props.modalConfig.name,
      }
    }
  }

  return createTypeByProps
}

const tableMeta: EasyCoderElement.Desc<TableProps> = {
  type: 'system_component_table',
  label: '表格',
  defaultAttr: {
    dataFrom: 'modal',
    size: 'default',
    pagePosition: 'br',
  },
  style: {
    style: {
      label: '样式',
    },
  },
  className: {
    className: {
      label: '样式名',
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
            { key: 'columns', type: 'attr' },
            { key: 'rows', type: 'attr' },
            { key: 'loopRow', type: 'attr' },
            { key: 'headerRender', type: 'multipleSlot' },
            { key: 'customCellRender', type: 'multipleSlot' },
            { key: 'rowRender', type: 'multipleSlot' },
          ],
          variable: [
            { key: 'modalConfig', type: 'attr' },
            { key: 'columns', type: 'attr' },
            { key: 'rows', type: 'attr' },
            { key: 'loopRow', type: 'attr' },
            { key: 'headerRender', type: 'multipleSlot' },
            { key: 'customCellRender', type: 'multipleSlot' },
            { key: 'rowRender', type: 'multipleSlot' },
          ],
          custom: [
            { key: 'modalConfig', type: 'attr' },
            { key: 'variableValue', type: 'attr' },
            { key: 'columns', type: 'attr' },
            { key: 'rows', type: 'attr' },
            { key: 'loopRow', type: 'attr' },
            { key: 'headerRender', type: 'multipleSlot' },
            { key: 'customCellRender', type: 'multipleSlot' },
            { key: 'rowRender', type: 'multipleSlot' },
          ],
        },
      },
    },
    modalConfig: {
      type: 'object',
      label: '数据模型',
      prototype: {},
      setter: ModalMetaSetter,
      onDependencies: onModalDependencies,
      visible: (props?: TableProps) => props?.dataFrom === 'modal',
      setterProps: {
        showCondition: true,
        showOrder: true,
      },
    },
    variableValue: {
      type: 'ref',
      label: '选择变量',
      canAcceptTypes: ['array', 'multipleLookup'],
      visible: (props?: TableProps) => props?.dataFrom === 'variable',
    },

    columns: {
      label: '表格列',
      type: 'array',
      item: {
        type: 'object',
        prototype: {},
      },
      setter: () => null,
      onDependencies: onColumnDependencies,
    },
    rows: {
      label: '表格行',
      type: 'array',
      item: {
        type: 'object',
        prototype: {},
      },
      setter: () => null,
    },
    loopRow: {
      label: '循环渲染行',
      type: 'object',
      prototype: {},
      setter: () => null,
    },

    size: {
      type: 'string',
      label: '尺寸',
      setter: SelectSetter,
      setterProps: {
        title: '尺寸',
        options: [
          { value: 'default', label: '默认' },
          { value: 'mini', label: '小' },
        ],
      },
    },
    pagePosition: {
      type: 'string',
      label: '分页器位置',
      visible: (props: TableProps) => props?.dataFrom === 'modal',
      setter: SelectSetter,
      setterProps: {
        title: '分页器位置',
        options: [
          { value: 'br', label: '右下' },
          { value: 'bl', label: '左下' },
          { value: 'tr', label: '右上' },
          { value: 'tl', label: '左上' },
          { value: 'topCenter', label: '上方居中' },
          { value: 'bottomCenter', label: '下方居中' },
        ],
      },
    },
    showSelection: {
      type: 'boolean',
      label: '是否可选择行',
      disabledFx: true,
      visible: (props: TableProps) => props?.dataFrom === 'modal',
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
      childrenOfAttr: ['dataFrom', 'modalConfig', 'variableValue'],
    },
    {
      id: 'line1',
      Render: LineDecorator,
    },
    {
      id: 'style',
      Render: GroupDecorator,
      props: {
        title: '外观',
        canFold: true,
      },
      childrenOfAttr: ['size', 'pagePosition', 'showSelection'],
    },
    {
      id: 'hidden',
      Render: () => null,
      childrenOfAttr: ['columns', 'rows', 'loopRow'],
    },
  ],
  slot: {
    headerRender: {
      label: '表头插槽',
      isMultiple: true,
    },
    customCellRender: {
      label: '单元格插槽',
      isMultiple: true,
    },
    rowRender: {
      label: '单元格插槽',
      isMultiple: true,
      payload: {
        record: createType('当前行'),
      },
    },
  },
  event: {
    onSelectionChange: {
      label: '选择行改变时',
      params: [createMultipleModalType('选中行')],
    },
  },
  export: {
    attr: {
      selectedRows: createMultipleModalType('选中行'),
    },
    event: {
      reload: {
        label: '刷新(仅【数据模型】时生效)',
      },
      setLoading: {
        label: '设置加载中(仅【关联变量】时生效)',
        params: [
          {
            type: 'boolean',
            label: '是否加载中',
          },
        ],
      },
    },
  },
  Render: Table,
}

export default tableMeta
