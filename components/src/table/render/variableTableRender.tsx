import { useEffect, useState } from 'react'
import classNames from 'classnames'
import { Table, TableProps, Empty } from '@arco-design/web-react'
import { useElementContext } from '@easy-coder/sdk/store'

import { useEasyCoderTable } from '../context'
import { useModalTableColumns } from '../context/hooks'
import AddColumn from './addColumn'
import { TableExport } from '..'

import './index.scss'

interface Props extends Omit<TableProps, 'columns' | 'borderCell'> {
  variableValue?: Record<string, any>[]
}

export default function VariableTableRender({ className, style, variableValue, ...props }: Props) {
  const { canEdit } = useEasyCoderTable()
  const columns = useModalTableColumns()
  const { exportEvent } = useElementContext<TableExport>()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    exportEvent('setLoading', setLoading)

    return () => exportEvent('setLoading', undefined)
  }, [])

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
      className={classNames('easy-coder-table', className)}
      style={style}
      borderCell
      data={variableValue}
      columns={columns}
      loading={loading}
      scroll={{
        x: '100%',
      }}
      pagination={false}
    />
  )
}
