import { Popover, Button } from '@arco-design/web-react'
import { IconDelete } from '@arco-design/web-react/icon'
import { useElementContext } from '@easy-coder/sdk/store'
import { useEffectCallback } from '@easy-coder/sdk/helper'

import { useEasyCoderTable } from '../../context'
import { TableColumn, TableProps } from '../..'

import './index.scss'

interface Props {
  refColumnId: string
}

export default function RemoveColumn({ refColumnId }: Props) {
  const { updateProps, removeSlot } = useElementContext<unknown, TableProps>()
  const { columns, rows, loopRow, dataFrom } = useEasyCoderTable()

  const handleDeleteColumn = useEffectCallback(async () => {
    const deleteColumnParent = findParentById(columns, refColumnId)
    const { newColumns, deleteColumns } = removeColumn(columns, refColumnId)

    const needPastToPatentColumn = deleteColumnParent?.children?.length === 1

    if (dataFrom === 'custom') {
      const willDeleteCellSlotIds: string[] = []
      const newRows = rows?.map((row) => {
        const newRow = { ...row }
        deleteColumns.forEach((column) => {
          if (!newRow[column.id]) return

          if (needPastToPatentColumn && column.id === refColumnId) {
            newRow[deleteColumnParent.id] = newRow[column.id]
          } else {
            willDeleteCellSlotIds.push(newRow[column.id])
          }
          delete newRow[column.id]
        })
        return newRow
      })

      await updateProps(
        {
          columns: newColumns,
          rows: newRows,
        },
        true
      )
      await removeSlot(
        'headerRender',
        deleteColumns.map((item) => item.slotId)
      )
      await removeSlot('customCellRender', willDeleteCellSlotIds)
    } else {
      const willDeleteRowSlotIds: string[] = []
      const newLoopRow = { ...loopRow }
      deleteColumns.forEach((column) => {
        if (!newLoopRow[column.id]) return

        if (needPastToPatentColumn && column.id === refColumnId) {
          newLoopRow[deleteColumnParent.id] = newLoopRow[column.id]
        } else {
          willDeleteRowSlotIds.push(newLoopRow[column.id])
        }
        delete newLoopRow[column.id]
      })

      await updateProps(
        {
          columns: newColumns,
          loopRow: newLoopRow,
        },
        true
      )
      await removeSlot(
        'headerRender',
        deleteColumns.map((item) => item.slotId)
      )
      await removeSlot('rowRender', willDeleteRowSlotIds)
    }
  }, [refColumnId, columns, rows, loopRow, dataFrom])

  return (
    <Popover
      trigger="hover"
      position="top"
      content={
        <div className="easy-coder-table-delete-column-popover">
          <p>删除当前列及其子列</p>
          <Button
            type="primary"
            status="danger"
            size="mini"
            onClick={handleDeleteColumn}>
            删除
          </Button>
        </div>
      }>
      <IconDelete className="easy-coder-table-delete-column-icon" />
    </Popover>
  )
}

function removeColumn(columns: TableColumn[], refId: string): { newColumns: TableColumn[]; deleteColumns: TableColumn[] } {
  const refColumnIndex = columns.findIndex((column) => column.id === refId)

  if (refColumnIndex !== -1) {
    const newColumns = [...columns]

    newColumns.splice(refColumnIndex, 1)

    return { newColumns, deleteColumns: deepFlatColumn(columns[refColumnIndex]) }
  }

  const newColumns: TableColumn[] = []
  const deleteColumns: TableColumn[] = []
  columns.forEach((column) => {
    if (!column.children) {
      newColumns.push(column)
      return
    }

    const childInfo = removeColumn(column.children, refId)
    newColumns.push({ ...column, children: childInfo.newColumns })
    deleteColumns.push(...childInfo.deleteColumns)
  })

  return { newColumns, deleteColumns }
}

function deepFlatColumn(column: TableColumn): TableColumn[] {
  const columns: TableColumn[] = [column]

  column.children?.forEach((child) => {
    columns.push(...deepFlatColumn(child))
  })

  return columns
}

function findParentById(columns: TableColumn[], id: string): TableColumn | undefined {
  for (const column of columns) {
    if (column.id === id) return

    if (column.children?.length) {
      if (column.children.some((item) => item.id === id)) {
        return column
      }

      const findInChild = findParentById(column.children, id)
      if (findInChild) return findInChild
    }
  }
}
