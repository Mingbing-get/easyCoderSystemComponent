import { Popover, Select } from '@arco-design/web-react'
import { IconPlus, IconLeft, IconRight, IconUp, IconDown } from '@arco-design/web-react/icon'
import { useElementContext, useStateById, useVariableDefine, useInsertElement, SLOT_VARIABLE } from '@easy-coder/sdk/store'
import { useEffectCallback, generateId } from '@easy-coder/sdk/helper'
import { useDataCenter } from '@easy-coder/sdk/data'
import { VariableDefine, getVariableByPath } from '@easy-coder/sdk/variable'

import { useEasyCoderTable } from '../../context'
import { TableColumn, TableProps } from '../..'

import './index.scss'
import { useCallback, useEffect, useMemo, useState } from 'react'

interface Props {
  refColumnId?: string
}

type InsertPosition = 'left' | 'top' | 'right' | 'bottom'

export default function AddColumn({ refColumnId }: Props) {
  const { updateProps, insertSlot } = useElementContext<unknown, TableProps>()
  const { columns, rows, loopRow, dataFrom } = useEasyCoderTable()
  const insertElement = useInsertElement()

  const handleAddColumn = useEffectCallback(
    async (position?: InsertPosition, option?: WithFieldOption) => {
      if (refColumnId && (!position || !columns?.length)) return

      const slotIds = await insertSlot('headerRender', ['表头插槽'])
      if (slotIds.length === 0) return

      const slotId = slotIds[0].slotId
      const columnId = generateId('table-column')

      if (dataFrom === 'custom') {
        if (!refColumnId) {
          let newRows = rows
          if (rows?.length > 0) {
            const cellSlotIds = await insertSlot(
              'customCellRender',
              new Array(rows.length).fill(1).map(() => '单元格插槽')
            )
            newRows = rows.map((_, index) => ({ [columnId]: cellSlotIds[index].slotId }))
          }
          await updateProps(
            {
              columns: [{ id: columnId, slotId, width: 160 }],
              rows: newRows,
            },
            true
          )
        } else {
          const refColumn = findColumnById(columns, refColumnId)
          if (!refColumn) return

          const newColumns = insertColumn(columns, refColumnId, position, { id: columnId, slotId, width: 160 })

          let newRows = rows
          const needInsertCell = position === 'left' || position === 'right' || (position === 'bottom' && refColumn.children?.length)
          if (needInsertCell && rows?.length > 0) {
            const cellSlotIds = await insertSlot(
              'customCellRender',
              new Array(rows.length).fill(1).map(() => '单元格插槽')
            )
            newRows = rows.map((row, index) => ({ ...row, [columnId]: cellSlotIds[index].slotId }))
          } else if (position === 'bottom') {
            newRows = rows?.map((row) => {
              const newRow = { ...row }

              newRow[columnId] = row[refColumnId]
              delete newRow[refColumnId]

              return newRow
            })
          }

          await updateProps(
            {
              columns: newColumns,
              rows: newRows,
            },
            true
          )
        }
      } else {
        if (option) {
          await insertElement('system_component_text', slotId, undefined, { text: option.label })
        }

        if (!refColumnId) {
          const rowSlotIds = await insertSlot('rowRender', ['单元格插槽'])
          if (rowSlotIds.length === 0) return

          const rowSlotId = rowSlotIds[0].slotId

          if (option) {
            await insertElement('system_component_display', rowSlotId, undefined, {
              type: option.type,
              modalName: {
                name: option.modalName,
              },
              enumGroupName: option.enumGroupName,
              value: {
                _type: 'fx',
                code: `$${SLOT_VARIABLE}.${rowSlotId}.record.${option.value}`,
              },
            })
          }

          await updateProps(
            {
              columns: [{ id: columnId, slotId, fieldKeys: option?.value, width: 160 }],
              loopRow: { [columnId]: rowSlotId },
            },
            true
          )
        } else {
          const refColumn = findColumnById(columns, refColumnId)
          if (!refColumn) return

          const newLoopRow = { ...loopRow }
          const newColumns = insertColumn(columns, refColumnId, position, { id: columnId, slotId, fieldKeys: option?.value, width: 160 })
          const needInsertCell = position === 'left' || position === 'right' || (position === 'bottom' && refColumn.children?.length)
          if (needInsertCell) {
            const rowSlotIds = await insertSlot('rowRender', ['单元格插槽'])
            const rowSlotId = rowSlotIds[0].slotId

            if (option) {
              await insertElement('system_component_display', rowSlotId, undefined, {
                type: option.type,
                modalName: {
                  name: option.modalName,
                },
                enumGroupName: option.enumGroupName,
                value: {
                  _type: 'fx',
                  code: `$${SLOT_VARIABLE}.${rowSlotId}.record.${option.value}`,
                },
              })
            }
            newLoopRow[columnId] = rowSlotId
          } else if (position === 'bottom') {
            newLoopRow[columnId] = newLoopRow[refColumnId]
            delete newLoopRow[refColumnId]
          }

          await updateProps(
            {
              columns: newColumns,
              loopRow: newLoopRow,
            },
            true
          )
        }
      }
    },
    [refColumnId, columns, rows, loopRow, dataFrom]
  )

  const refColumn = useMemo(() => (refColumnId ? findColumnById(columns, refColumnId) : undefined), [columns, refColumnId])

  if (!refColumn) {
    return (
      <RenderAddColumnButton
        IconRender={IconPlus}
        onAdd={(option) => handleAddColumn(undefined, option)}
      />
    )
  }

  return (
    <Popover
      trigger="hover"
      position="right"
      triggerProps={{ showArrow: false }}
      content={
        <div className="easy-coder-table-add-group">
          <RenderAddColumnButton
            tipContent="在左侧插入列"
            IconRender={IconLeft}
            onAdd={(option) => handleAddColumn('left', option)}
          />
          <RenderAddColumnButton
            tipContent="插入父列"
            IconRender={IconUp}
            onAdd={(option) => handleAddColumn('top', option)}
          />
          <RenderAddColumnButton
            tipContent="在右侧插入列"
            IconRender={IconRight}
            onAdd={(option) => handleAddColumn('right', option)}
          />
          {!refColumn.fieldKeys && (
            <RenderAddColumnButton
              tipContent="插入子列"
              IconRender={IconDown}
              onAdd={(option) => handleAddColumn('bottom', option)}
            />
          )}
        </div>
      }>
      <IconPlus className="easy-coder-table-add-column-icon" />
    </Popover>
  )
}

interface RenderAddColumnButtonProps {
  IconRender: (props: { className?: string; onClick?: () => void }) => React.ReactNode
  tipContent?: React.ReactNode
  onAdd?: (option?: WithFieldOption) => void
}
interface WithFieldOption {
  value: string
  label: string
  type?: VariableDefine.Desc['type']
  modalName?: string
  enumGroupName?: string
}
const customField: WithFieldOption = { value: '_custom', label: '自定义' }
function RenderAddColumnButton({ IconRender, tipContent, onAdd }: RenderAddColumnButtonProps) {
  const { dataFrom, modalConfig } = useEasyCoderTable()
  const { id } = useElementContext()
  const element = useStateById('element', id)
  const [options, setOptions] = useState<WithFieldOption[]>([customField])
  const dataCenter = useDataCenter()
  const { initComplete, variableDefine } = useVariableDefine()

  const handleSelect = useEffectCallback(
    (v: string) => {
      const item = options.find((item) => item.value === v)
      onAdd?.(item?.value === customField.value ? undefined : item)
    },
    [options, onAdd]
  )

  const updateModalOption = useCallback(async (modalName?: string) => {
    if (!modalName) {
      setOptions([customField])
      return
    }

    const modals = await dataCenter.modalList()
    const modal = modals.find((modal) => modal.name === modalName)
    if (!modal) {
      setOptions([customField])
      return
    }

    const options: WithFieldOption[] = modal.fields.map((field) => {
      let type: VariableDefine.Desc['type'] = field.type
      if (field.type === 'lookup' && field.multiple) {
        type = 'multipleLookup'
      }
      if (field.type === 'enum' && field.multiple) {
        type = 'multipleEnum'
      }

      return {
        value: field.name,
        label: field.label,
        type,
        modalName: field.type === 'lookup' ? field.modalName : undefined,
        enumGroupName: field.type === 'enum' ? field.enumGroupName : undefined,
      }
    })

    setOptions([...options, customField])
  }, [])

  const updateVariableOption = useCallback(async (variableDefine: Record<string, VariableDefine.Desc>, variablePath?: string[]) => {
    if (!variablePath?.length) {
      setOptions([customField])
      return
    }

    const variable = await getVariableByPath(dataCenter, variablePath, variableDefine)
    if (variable.type === 'multipleLookup') {
      await updateModalOption(variable.modalName)
    } else if (variable.type === 'array') {
      const item = variable.item
      if (item.type === 'lookup') {
        await updateModalOption((item as VariableDefine.Lookup).modalName)
      } else if (item.type === 'object') {
        const _item = item as VariableDefine.Object
        const options: WithFieldOption[] = []

        for (const key in _item.prototype) {
          options.push({
            value: key,
            label: _item.prototype[key].label,
            type: _item.prototype[key].type,
            modalName: (_item.prototype[key] as any).modalName,
            enumGroupName: (_item.prototype[key] as any).enumGroupName,
          })
        }

        setOptions([...options, customField])
      }
    }
  }, [])

  useEffect(() => {
    if (dataFrom === 'custom') {
      setOptions([customField])
    } else if (dataFrom === 'modal') {
      updateModalOption(modalConfig?.name)
    } else if (dataFrom === 'variable') {
      if (!initComplete) {
        setOptions([customField])
      } else {
        updateVariableOption(variableDefine, element?.props?.variableValue)
      }
    }
  }, [dataFrom, modalConfig?.name, element?.props?.variableValue, initComplete, variableDefine])

  if (dataFrom === 'custom') {
    return (
      <Popover
        trigger="hover"
        position="top"
        disabled={!tipContent}
        content={tipContent}>
        <IconRender
          className="easy-coder-table-add-column-icon"
          onClick={() => onAdd?.()}
        />
      </Popover>
    )
  }

  return (
    <Popover
      trigger="hover"
      position="top"
      disabled={!tipContent}
      content={tipContent}>
      <Select
        value={undefined}
        triggerProps={{
          trigger: 'hover',
          popupStyle: {
            width: 'fit-content',
          },
        }}
        options={options}
        triggerElement={<IconRender className="easy-coder-table-add-column-icon" />}
        onChange={handleSelect}
      />
    </Popover>
  )
}

function insertColumn(columns: TableColumn[], refId: string, position: InsertPosition, newColumn: TableColumn): TableColumn[] {
  const refColumnIndex = columns.findIndex((column) => column.id === refId)

  if (refColumnIndex !== -1) {
    const newColumns = [...columns]

    if (position === 'left') {
      newColumns.splice(refColumnIndex, 0, newColumn)
    } else if (position === 'top') {
      newColumns.splice(refColumnIndex, 1, { ...newColumn, children: [columns[refColumnIndex]] })
    } else if (position === 'right') {
      newColumns.splice(refColumnIndex + 1, 0, newColumn)
    } else {
      const oldColumn = { ...columns[refColumnIndex] }
      oldColumn.children = [...(oldColumn.children || []), newColumn]
      newColumns.splice(refColumnIndex, 1, oldColumn)
    }

    return newColumns
  }

  return columns.map((column) => {
    if (!column.children) return column

    return { ...column, children: insertColumn(column.children, refId, position, newColumn) }
  })
}

export function findColumnById(columns: TableColumn[], id: string): TableColumn | undefined {
  for (const column of columns) {
    if (column.id === id) return column

    if (column.children?.length) {
      const findInChild = findColumnById(column.children, id)
      if (findInChild) {
        return findInChild
      }
    }
  }
}
