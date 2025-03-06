import { useMemo } from 'react'
import { Popover, InputNumber, Select } from '@arco-design/web-react'
import { IconSettings } from '@arco-design/web-react/icon'

import { useElementContext } from '@easy-coder/sdk/store'
import { useEffectCallback } from '@easy-coder/sdk/helper'
import { i18n } from '@easy-coder/sdk/i18n'

import { useEasyCoderTable } from '../../context'
import { TableProps, TableColumn } from '../..'
import { findColumnById } from '../addColumn'

import './index.scss'

interface Props {
  refColumnId: string
}

const fixedOptions = [
  { value: 'left', label: i18n.translate({ zh: '左', en: 'Left' }) },
  { value: 'right', label: i18n.translate({ zh: '右', en: 'Right' }) },
]

const columnWidth = i18n.translate({ zh: '列宽', en: 'width' })
const columnFixed = i18n.translate({ zh: '固定', en: 'fixed' })

export default function ColumnSetting({ refColumnId }: Props) {
  const { updateProps } = useElementContext<any, TableProps>()
  const { columns } = useEasyCoderTable()

  const refColumn = useMemo(() => (columns ? findColumnById(columns, refColumnId) : undefined), [columns, refColumnId])

  const handleUpdateColumn = useEffectCallback(
    <K extends keyof Pick<TableColumn, 'width' | 'fixed'>>(key: K, v: TableColumn[K]) => {
      const refColumn = findColumnById(columns, refColumnId)
      if (!refColumn) return

      const newColumn = replaceColumn(columns, refColumnId, { ...refColumn, [key]: v })
      updateProps('columns', newColumn)
    },
    [refColumnId, columns]
  )

  if (!refColumn) return null

  return (
    <Popover
      trigger="hover"
      position="bl"
      triggerProps={{
        showArrow: false,
      }}
      content={
        <div className="easy-coder-table-column-setting-wrapper">
          <div className="easy-coder-table-column-setting-row">
            <label className="easy-coder-table-column-setting-label">{columnWidth}</label>
            <InputNumber
              size="mini"
              value={refColumn.width}
              onChange={(v) => handleUpdateColumn('width', v)}
            />
          </div>
          <div className="easy-coder-table-column-setting-row">
            <label className="easy-coder-table-column-setting-label">{columnFixed}</label>
            <Select
              size="mini"
              value={refColumn.fixed}
              options={fixedOptions}
              allowClear
              onChange={(v) => handleUpdateColumn('fixed', v)}
            />
          </div>
        </div>
      }>
      <IconSettings className="easy-coder-table-column-setting-icon" />
    </Popover>
  )
}

function replaceColumn(columns: TableColumn[], refId: string, newColumn: TableColumn): TableColumn[] {
  const refColumnIndex = columns.findIndex((column) => column.id === refId)

  if (refColumnIndex !== -1) {
    const newColumns = [...columns]

    newColumns.splice(refColumnIndex, 1, newColumn)

    return newColumns
  }

  return columns.map((column) => {
    if (!column.children) return column

    return { ...column, children: replaceColumn(column.children, refId, newColumn) }
  })
}
