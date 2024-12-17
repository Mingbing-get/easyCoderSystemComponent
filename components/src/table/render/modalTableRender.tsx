import { useMemo } from 'react'
import classNames from 'classnames'
import { Table, TableProps, Empty } from '@arco-design/web-react'

import { useEasyCoderTable } from '../context'
import { useModalTableColumns, useModalRecordsForTable } from '../context/hooks'
import AddColumn from './addColumn'

import './index.scss'

interface Props extends Omit<TableProps, 'columns' | 'borderCell'> {
  showSelection?: boolean
  onSelectionChange?: (records: Record<string, any>[]) => void
}

export default function ModalTableRender({ className, style, showSelection, onSelectionChange, ...props }: Props) {
  const { canEdit } = useEasyCoderTable()
  const columns = useModalTableColumns()

  const { records, loading, total, fetchByPage } = useModalRecordsForTable()

  const rowSelection = useMemo(() => {
    if (!showSelection) return

    return {
      fixed: true,
      onChange: (_: any, records: Record<string, any>[]) => onSelectionChange?.(records),
    }
  }, [showSelection, onSelectionChange])

  if (!columns.length) {
    if (!canEdit) return null

    const startDataProps: Record<string, string> = {}
    for (const key in props) {
      if (key.startsWith('data-')) {
        startDataProps[key] = props[key]
      }
    }

    return (
      <div
        {...startDataProps}
        className={classNames('easy-coder-table-empty', className)}
        style={style}>
        <Empty
          icon={<AddColumn />}
          description="当前表格未配置列，点击插入列"
        />
      </div>
    )
  }

  return (
    <Table
      {...props}
      rowSelection={rowSelection}
      rowKey="_id"
      className={classNames('easy-coder-table', className)}
      style={style}
      borderCell
      columns={columns}
      loading={loading}
      data={records}
      scroll={{
        x: '100%',
      }}
      pagination={{
        total,
        pageSize: 10,
        hideOnSinglePage: true,
        onChange: fetchByPage,
      }}
    />
  )
}
