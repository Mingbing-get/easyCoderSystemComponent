import { IconDown, IconPlus, IconUp } from '@arco-design/web-react/icon'

import { useEffectCallback } from '@easy-coder/sdk/helper'
import { useElementContext } from '@easy-coder/sdk/store'
import { i18n } from '@easy-coder/sdk/i18n'

import { TableProps } from '../..'
import { useEasyCoderTable } from '../../context'
import { Popover } from '@arco-design/web-react'

interface Props {
  index?: number
  location?: 'pre' | 'next'
}

const tableCellSlotAlias = i18n.translate({ zh: '单元格插槽', en: 'Table cell slot' })
const insertToTop = i18n.translate({ zh: '在上方插入行', en: 'insert rows above' })
const insertToBottom = i18n.translate({ zh: '在下方插入行', en: 'Insert row below' })

export default function AddRow({ index, location }: Props) {
  const { updateProps, insertSlot } = useElementContext<unknown, TableProps>()
  const { columns, rows } = useEasyCoderTable()

  const handleAddRow = useEffectCallback(async () => {
    if (!columns?.length) return

    const slotIds = await insertSlot(
      'customCellRender',
      columns.map(() => tableCellSlotAlias)
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
        content={insertToTop}>
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
        content={insertToBottom}>
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
