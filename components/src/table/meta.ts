import { EasyCoderElement } from '@easy-coder/sdk/store'
import { GroupDecorator, LineDecorator, ModalMetaSetter, SelectSetter, onModalDependencies, ResetSelectSetter } from '@easy-coder/sdk/design'
import { i18n, Multilingual } from '@easy-coder/sdk/i18n'

import onColumnDependencies from './setter/onColumnDependencies'

import Table, { TableProps } from '.'

function createType(label: Multilingual) {
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

function createMultipleModalType(label: Multilingual) {
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
  label: {
    zh: '表格',
    en: 'Table',
  },
  defaultAttr: {
    dataFrom: 'modal',
    size: 'default',
    pagePosition: 'br',
  },
  style: {
    style: {
      label: {
        zh: '样式',
        en: 'Style',
      },
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
      label: {
        zh: '数据模型',
        en: 'Data modal',
      },
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
      label: {
        zh: '选择变量',
        en: 'Variable',
      },
      canAcceptTypes: ['array', 'multipleLookup'],
      visible: (props?: TableProps) => props?.dataFrom === 'variable',
    },

    columns: {
      label: {
        zh: '表格列',
        en: 'Table column',
      },
      type: 'array',
      item: {
        type: 'object',
        prototype: {},
      },
      setter: () => null,
      onDependencies: onColumnDependencies,
    },
    rows: {
      label: {
        zh: '表格行',
        en: 'Table row',
      },
      type: 'array',
      item: {
        type: 'object',
        prototype: {},
      },
      setter: () => null,
    },
    loopRow: {
      label: {
        zh: '循环渲染行',
        en: 'Loop render row',
      },
      type: 'object',
      prototype: {},
      setter: () => null,
    },

    size: {
      type: 'string',
      label: {
        zh: '尺寸',
        en: 'Size',
      },
      setter: SelectSetter,
      setterProps: {
        title: i18n.translate({ zh: '尺寸', en: 'Size' }),
        options: [
          { value: 'default', label: i18n.translate({ zh: '默认', en: 'Default' }) },
          { value: 'mini', label: i18n.translate({ zh: '小', en: 'Small' }) },
        ],
      },
    },
    pagePosition: {
      type: 'string',
      label: {
        zh: '分页器位置',
        en: 'Pager position',
      },
      visible: (props: TableProps) => props?.dataFrom === 'modal',
      setter: SelectSetter,
      setterProps: {
        title: i18n.translate({ zh: '分页器位置', en: 'Pager position' }),
        options: [
          { value: 'br', label: i18n.translate({ zh: '右下', en: 'Right bottom' }) },
          { value: 'bl', label: i18n.translate({ zh: '左下', en: 'Left bottom' }) },
          { value: 'tr', label: i18n.translate({ zh: '右上', en: 'Right top' }) },
          { value: 'tl', label: i18n.translate({ zh: '左上', en: 'Left top' }) },
          { value: 'topCenter', label: i18n.translate({ zh: '上方居中', en: 'Top center' }) },
          { value: 'bottomCenter', label: i18n.translate({ zh: '下方居中', en: 'Bottom center' }) },
        ],
      },
    },
    showSelection: {
      type: 'boolean',
      label: {
        zh: '是否可选择行',
        en: 'Can rows be selected',
      },
      disabledFx: true,
      visible: (props: TableProps) => props?.dataFrom === 'modal',
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
        title: i18n.translate({ zh: '外观', en: 'Appearance' }),
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
      label: {
        zh: '表头插槽',
        en: 'Table header slot',
      },
      isMultiple: true,
    },
    customCellRender: {
      label: {
        zh: '单元格插槽',
        en: 'Table cell slot',
      },
      isMultiple: true,
    },
    rowRender: {
      label: {
        zh: '单元格插槽',
        en: 'Table cell slot',
      },
      isMultiple: true,
      payload: {
        record: createType({ zh: '当前行', en: 'Current row' }),
      },
    },
  },
  event: {
    onSelectionChange: {
      label: {
        zh: '选择行改变时',
        en: 'When selecting a row change',
      },
      params: [createMultipleModalType({ zh: '选中行', en: 'Selected rows' })],
    },
  },
  export: {
    attr: {
      selectedRows: createMultipleModalType({ zh: '选中行', en: 'Selected rows' }),
    },
    event: {
      reload: {
        label: {
          zh: '刷新(仅【数据模型】时生效)',
          en: 'Refresh (only effective when [Data Model])',
        },
      },
      setLoading: {
        label: {
          zh: '设置加载中(仅【关联变量】时生效)',
          en: 'Setting loading (only effective when associated with variables)',
        },
        params: [
          {
            type: 'boolean',
            label: {
              zh: '是否加载中',
              en: 'Is loading',
            },
          },
        ],
      },
    },
  },
  Render: Table,
}

export default tableMeta
