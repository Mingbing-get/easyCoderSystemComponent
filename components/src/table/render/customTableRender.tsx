import classNames from 'classnames'
import { Table, TableProps, Empty } from '@arco-design/web-react'

import { i18n } from '@easy-coder/sdk/i18n'

import { useEasyCoderTable } from '../context'
import { useCustomTableColumns } from '../context/hooks'
import AddColumn from './addColumn'
import EmptyRender from './emptyRender'
import EasyCoderTableRow from './row'

import './index.scss'

interface Props extends Omit<TableProps, 'columns' | 'borderCell'> {}

export default function CustomTableRender({ className, style, ...props }: Props) {
  const { canEdit, rows } = useEasyCoderTable()
  const columns = useCustomTableColumns()

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
          description={i18n.translate({ zh: '当前表格未配置列，点击插入列', en: 'The current table has no columns configured. Click to insert a column' })}
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
      noDataElement={<EmptyRender />}
      data={rows}
      columns={columns}
      components={{
        body: {
          row: EasyCoderTableRow,
        },
      }}
      scroll={{
        x: '100%',
      }}
      pagination={false}
    />
  )
}
