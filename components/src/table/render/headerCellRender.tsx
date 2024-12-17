import { useEasyCoderTable } from '../context'
import { TableColumn } from '..'

import AddColumn from './addColumn'
import RemoveColumn from './removeColumn'
import ColumnSetting from './columnSetting'

export default function HeaderCellRender(props: TableColumn) {
  const { canEdit, headerRender } = useEasyCoderTable()

  return (
    <div className="easy-coder-header">
      {headerRender?.[props?.slotId]?.()}
      {canEdit && (
        <div className="easy-coder-header-mask">
          <AddColumn refColumnId={props.id} />
          <RemoveColumn refColumnId={props.id} />
          <ColumnSetting refColumnId={props.id} />
        </div>
      )}
    </div>
  )
}
