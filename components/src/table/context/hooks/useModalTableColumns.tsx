import { useMemo } from 'react'
import { TableColumnProps } from '@arco-design/web-react'

import { TableColumn } from '../..'
import { useEasyCoderTable } from '..'
import HeaderCellRender from '../../render/headerCellRender'

export default function useModalTableColumns() {
  const { columns, loopRow, rowRender } = useEasyCoderTable()

  const tableColumns = useMemo(() => columnsToTable(columns, loopRow, rowRender), [columns, loopRow, rowRender])

  return tableColumns
}

function columnsToTable(
  columns?: TableColumn[],
  loopRow?: Record<string, string>,
  rowRender?: Record<string, (payload: { record: Record<string, any> }) => React.ReactNode>
) {
  const tableColumns: TableColumnProps[] = []

  columns?.forEach((column) => {
    tableColumns.push({
      width: column.width,
      fixed: column.fixed,
      title: <HeaderCellRender {...column} />,
      children: column.children?.length ? columnsToTable(column.children, loopRow, rowRender) : undefined,
      render: !column.children?.length
        ? (_, row: Record<string, string>) => {
            return rowRender?.[loopRow?.[column.id]]?.({ record: row })
          }
        : undefined,
    })
  })

  return tableColumns
}
