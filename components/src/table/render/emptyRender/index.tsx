import { Empty } from '@arco-design/web-react'

import { useEasyCoderTable } from '../../context'
import AddRow from '../addRow'

export default function EmptyRender() {
  const { canEdit } = useEasyCoderTable()

  if (canEdit) {
    return (
      <Empty
        icon={<AddRow />}
        description="当前表格未配置行，点击插入行"
      />
    )
  }

  return <Empty />
}
