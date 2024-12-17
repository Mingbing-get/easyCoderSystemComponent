import { Popover } from '@arco-design/web-react'
import { IconDelete } from '@arco-design/web-react/icon'
import { useEffectCallback } from '@easy-coder/sdk/helper'
import { useElementContext } from '@easy-coder/sdk/store'

import { TableProps } from '../..'
import { useEasyCoderTable } from '../../context'

interface Props {
  index: number
}

export default function RemoveRow({ index }: Props) {
  const { updateProps, removeSlot } = useElementContext<unknown, TableProps>()
  const { rows } = useEasyCoderTable()

  const handleDeleteRow = useEffectCallback(async () => {
    if (!rows || rows.length <= index) return

    const row = rows[index]
    await removeSlot('customCellRender', Object.values(row))

    const newRows = [...rows]
    newRows.splice(index, 1)
    await updateProps('rows', newRows)
  }, [index, rows])

  return (
    <Popover
      trigger="hover"
      position="top"
      content="删除行">
      <IconDelete
        className="easy-coder-table-delete-column-icon"
        onClick={handleDeleteRow}
      />
    </Popover>
  )
}
