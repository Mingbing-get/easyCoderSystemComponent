import { useMemo } from 'react'
import { EasyCoderElement, useEnv, useElementContext } from '@easy-coder/sdk/store'
import { ModalConfig } from '@easy-coder/sdk/design'
import { useEffectCallback } from '@easy-coder/sdk/helper'

import { EasyCoderTableProvider } from './context'
import CustomTableRender from './render/customTableRender'
import ModalTableRender from './render/modalTableRender'
import VariableTableRender from './render/variableTableRender'

export interface CustomTableCell {
  id: string
  slotId: string
}

export interface TableColumn {
  id: string
  slotId: string
  fieldKeys?: string
  width?: number
  fixed?: 'left' | 'right'
  children?: TableColumn[]
}

type ColumnId = string
type SlotId = string

export interface TableProps extends EasyCoderElement.DataProps {
  className?: string
  style?: React.CSSProperties
  size?: 'default' | 'middle' | 'small' | 'mini'
  pagePosition?: 'br' | 'bl' | 'tr' | 'tl' | 'topCenter' | 'bottomCenter'
  showSelection?: boolean

  dataFrom?: 'modal' | 'variable' | 'custom'

  modalConfig?: ModalConfig
  variableValue?: Record<string, any>[]

  columns?: TableColumn[]
  rows?: Record<ColumnId, SlotId>[]
  headerRender?: Record<string, () => React.ReactNode>
  customCellRender?: Record<string, () => React.ReactNode> // 只有在自定义时生效

  loopRow?: Record<ColumnId, SlotId> // 只有在数据模型和变量时生效
  rowRender?: Record<string, (payload: { record: Record<string, any> }) => React.ReactNode> // 只有在数据模型和变量时生效

  onSelectionChange?: (records: Record<string, any>[]) => void
}

export interface TableExport {
  reload: () => Promise<void>
  selectedRows?: Record<string, any>[]

  setLoading: (loading: boolean) => void
}

export default function Table({
  dataFrom,
  modalConfig,
  variableValue,
  columns,
  headerRender,
  rows,
  customCellRender,
  loopRow,
  rowRender,
  showSelection,
  onSelectionChange,
  ...extra
}: TableProps) {
  const { exportAttr } = useElementContext<TableExport>()
  const { isPreviewing } = useEnv()

  const providerValue = useMemo(
    () => ({
      columns,
      headerRender,
      rows,
      customCellRender,
      modalConfig,
      dataFrom,
      loopRow,
      rowRender,
      canEdit: isPreviewing,
    }),
    [columns, headerRender, rows, customCellRender, modalConfig, dataFrom, loopRow, rowRender, isPreviewing]
  )

  const handleChangeSelection = useEffectCallback(
    (rows?: Record<string, any>[]) => {
      exportAttr('selectedRows', rows)
      onSelectionChange?.(rows)
    },
    [onSelectionChange]
  )

  return (
    <EasyCoderTableProvider value={providerValue}>
      {dataFrom === 'modal' && (
        <ModalTableRender
          showSelection={showSelection}
          onSelectionChange={handleChangeSelection}
          {...extra}
        />
      )}
      {dataFrom === 'variable' && (
        <VariableTableRender
          {...extra}
          variableValue={variableValue}
        />
      )}
      {dataFrom === 'custom' && <CustomTableRender {...extra} />}
    </EasyCoderTableProvider>
  )
}
