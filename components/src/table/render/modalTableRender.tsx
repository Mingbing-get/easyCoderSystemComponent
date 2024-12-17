import { useCallback, useEffect, useMemo, useState } from 'react'
import classNames from 'classnames'
import { Table, TableProps, Empty } from '@arco-design/web-react'
import { useElementContext } from '@easy-coder/sdk/store'
import { useEffectCallback } from '@easy-coder/sdk/helper'

import { useEasyCoderTable } from '../context'
import { useModalTableColumns, useModalRecordsForTable } from '../context/hooks'
import AddColumn from './addColumn'
import { TableExport } from '..'

import './index.scss'

interface Props extends Omit<TableProps, 'columns' | 'borderCell'> {
  showSelection?: boolean
  onSelectionChange?: (records: Record<string, any>[]) => void
}

export default function ModalTableRender({ className, style, showSelection, onSelectionChange, ...props }: Props) {
  const { exportEvent } = useElementContext<TableExport>()

  const [currentPage, setCurrentPage] = useState(1)
  const { canEdit } = useEasyCoderTable()
  const columns = useModalTableColumns()

  const { records, loading, total, fetchByPage } = useModalRecordsForTable()

  const handleChangePage = useCallback(async (page: number) => {
    setCurrentPage(page)
    await fetchByPage(page)
  }, [])

  const handleReload = useEffectCallback(async () => {
    await fetchByPage(currentPage)
    onSelectionChange?.(undefined)
  }, [currentPage])

  useEffect(() => {
    exportEvent('reload', handleReload)

    return () => {
      exportEvent('reload', async () => {})
    }
  }, [])

  const handleChangeSelected = useEffectCallback(
    (ids: number[], records: Record<string, any>[]) => {
      onSelectionChange?.(records)
    },
    [onSelectionChange]
  )

  const rowSelection = useMemo(() => {
    if (!showSelection) return

    return {
      fixed: true,
      onChange: handleChangeSelected,
    }
  }, [showSelection])

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
        current: currentPage,
        pageSize: 10,
        hideOnSinglePage: true,
        onChange: handleChangePage,
      }}
    />
  )
}
