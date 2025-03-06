import { Empty } from '@arco-design/web-react'

import { i18n } from '@easy-coder/sdk/i18n'

import { useEasyCoderTable } from '../../context'
import AddRow from '../addRow'

export default function EmptyRender() {
  const { canEdit } = useEasyCoderTable()

  if (canEdit) {
    return (
      <Empty
        icon={<AddRow />}
        description={i18n.translate({ zh: '当前表格未配置行，点击插入行', en: 'The current table has no rows configured. Click to insert a row' })}
      />
    )
  }

  return <Empty />
}
