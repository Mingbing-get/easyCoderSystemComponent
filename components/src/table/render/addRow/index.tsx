import { IconDown, IconPlus, IconUp } from '@arco-design/web-react/icon'
import { useEffectCallback } from '@easy-coder/sdk/helper'
import { useElementContext } from '@easy-coder/sdk/store'

import { TableProps } from '../..'
import { useEasyCoderTable } from '../../context'
import { Popover } from '@arco-design/web-react'

interface Props {
  index?: number
  location?: 'pre' | 'next'
}

export default function AddRow({ index, location }: Props) {
  const { updateProps, insertSlot } = useElementContext<unknown, TableProps>()
  const { columns, rows } = useEasyCoderTable()

  const handleAddRow = useEffectCallback(async () => {
    if (!columns?.length) return

    const slotIds = await insertSlot(
      'customCellRender',
      columns.map(() => '单元格插槽')
    )
    const newRow: Record<string, string> = {}
    columns.forEach((column, index) => {
      newRow[column.id] = slotIds[index].slotId
    })

    if (index === undefined && !location) {
      await updateProps('rows', [...(rows || []), newRow])
    } else if (location === 'pre') {
      const newRows = [...(rows || [])]
      newRows.splice(index, 0, newRow)
      await updateProps('rows', newRows)
    } else if (location === 'next') {
      const newRows = [...(rows || [])]
      newRows.splice(index + 1, 0, newRow)
      await updateProps('rows', newRows)
    }
  }, [index, location, rows, columns])

  if (index !== undefined && location === 'pre') {
    return (
      <Popover
        trigger="hover"
        position="top"
        content="在上方插入行">
        <IconUp
          className="easy-coder-table-add-column-icon"
          onClick={handleAddRow}
        />
      </Popover>
    )
  }

  if (index !== undefined && location === 'next') {
    return (
      <Popover
        trigger="hover"
        position="top"
        content="在下方插入行">
        <IconDown
          className="easy-coder-table-add-column-icon"
          onClick={handleAddRow}
        />
      </Popover>
    )
  }

  return (
    <IconPlus
      className="easy-coder-table-add-column-icon"
      onClick={handleAddRow}
    />
  )
}
