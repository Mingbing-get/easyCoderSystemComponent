import { useMemo } from 'react'
import { TableColumnProps } from '@arco-design/web-react'

import { TableColumn } from '../..'
import { useEasyCoderTable } from '..'
import HeaderCellRender from '../../render/headerCellRender'

export default function useCustomTableColumns() {
  const { columns, customCellRender } = useEasyCoderTable()

  const tableColumns = useMemo(() => columnsToTable(columns, customCellRender), [columns, customCellRender])

  return tableColumns
}

function columnsToTable(columns?: TableColumn[], customCellRender?: Record<string, () => React.ReactNode>) {
  const tableColumns: TableColumnProps[] = []

  columns?.forEach((column) => {
    tableColumns.push({
      width: column.width,
      fixed: column.fixed,
      title: <HeaderCellRender {...column} />,
      children: column.children?.length ? columnsToTable(column.children, customCellRender) : undefined,
      render: !column.children?.length
        ? (_, row: Record<string, string>) => {
            return customCellRender?.[row[column.id]]?.()
          }
        : undefined,
    })
  })

  return tableColumns
}
