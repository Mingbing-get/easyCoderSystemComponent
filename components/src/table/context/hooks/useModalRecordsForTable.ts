import { useEffect, useMemo, useState } from 'react'
import { useModelRecords } from '@easy-coder/sdk/store'
import { useEffectCallback } from '@easy-coder/sdk/helper'

import { useEasyCoderTable } from '..'

export default function useModalRecordsForTable() {
  const [records, setRecords] = useState<Record<string, any>[]>([])
  const [total, setTotal] = useState<number>()
  const [loading, setLoading] = useState(false)
  const { dataFrom, modalConfig, columns } = useEasyCoderTable()

  const fields = useMemo(() => {
    const fields: string[] = []

    const stack = [...(columns || [])]
    while (stack.length > 0) {
      const first = stack.pop()

      if (first.fieldKeys && !fields.includes(first.fieldKeys)) {
        fields.push(first.fieldKeys)
      }
      if (first.children?.length) {
        stack.push(...first.children)
      }
    }

    return fields
  }, [columns])

  const { initComplete, transformCondition, fetchRecords } = useModelRecords({
    modalName: modalConfig?.name,
    fields,
    orders: modalConfig?.orders,
    useApiId: true,
    useExampleWhenPreview: true,
  })

  const fetchByPage = useEffectCallback(
    async (page: number = 1, pageSize: number = 10) => {
      setLoading(true)

      const condition = await transformCondition(modalConfig?.condition)
      if (condition === false) {
        setLoading(false)
        return
      }

      const res = await fetchRecords({
        offset: (page - 1) * pageSize,
        limit: pageSize,
        condition,
      })

      setLoading(false)

      if (res === false) return

      setRecords(res.records)
      setTotal(res.total)
    },
    [transformCondition, modalConfig?.condition]
  )

  useEffect(() => {
    if (dataFrom !== 'modal' || !modalConfig?.name || !initComplete || fields.length === 0) return

    fetchByPage()
  }, [dataFrom, initComplete, modalConfig?.name, fields])

  return {
    records,
    total,
    loading,
    fetchByPage,
  }
}
