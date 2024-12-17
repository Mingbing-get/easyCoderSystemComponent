import { Popover } from '@arco-design/web-react'

import { useEasyCoderTable } from '../../context'
import AddRow from '../addRow'
import RemoveRow from '../removeRow'

interface Props extends React.HTMLAttributes<HTMLTableRowElement> {
  record: Record<string, string>
  index: number
}

export default function EasyCoderTableRow({ record, index, ...props }: Props) {
  const { canEdit } = useEasyCoderTable()

  if (!canEdit) {
    return <tr {...props} />
  }

  return (
    <Popover
      trigger="hover"
      position="left"
      content={
        <div className="easy-coder-table-add-group">
          <AddRow
            index={index}
            location="pre"
          />
          <AddRow
            index={index}
            location="next"
          />
          <RemoveRow index={index} />
        </div>
      }
      triggerProps={{ showArrow: false, popupAlign: { left: 0 } }}>
      <tr {...props} />
    </Popover>
  )
}
