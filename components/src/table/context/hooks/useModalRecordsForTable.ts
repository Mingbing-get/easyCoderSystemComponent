import { useEffect, useMemo, useState } from 'react'
import { useModelRecords } from '@easy-coder/sdk/store'
import { useEffectCallback, useCompareCache } from '@easy-coder/sdk/helper'
import { isSameModalCondition } from '@easy-coder/sdk/variable'
import { CRUD } from '@easy-coder/sdk/data'

import { useEasyCoderTable } from '..'

export default function useModalRecordsForTable() {
  const [records, setRecords] = useState<Record<string, any>[]>([])
  const [total, setTotal] = useState<number>()
  const [loading, setLoading] = useState(false)
  const { dataFrom, modalConfig, columns } = useEasyCoderTable()
  const [modalCondition, setModalCondition] = useState<CRUD.Condition<any> | false>()
  const cacheModalCondition = useCompareCache(modalCondition, (before, after) => {
    if (before === false && after === false) return true

    if (before === false || after === false) return false

    return isSameModalCondition(before, after)
  })

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

  const { transformCondition, fetchRecords } = useModelRecords({
    modalName: modalConfig?.name,
    fields,
    orders: modalConfig?.orders,
    useApiId: true,
    useExampleWhenPreview: true,
  })

  useEffect(() => {
    transformCondition(modalConfig?.condition).then(setModalCondition)
  }, [modalConfig?.condition, transformCondition])

  const fetchByPage = useEffectCallback(
    async (page: number = 1, pageSize: number = 10) => {
      if (cacheModalCondition === false) return

      setLoading(true)

      const res = await fetchRecords({
        offset: (page - 1) * pageSize,
        limit: pageSize,
        condition: cacheModalCondition,
      })

      setLoading(false)

      if (res === false) return

      setRecords(res.records)
      setTotal(res.total)
    },
    [cacheModalCondition]
  )

  useEffect(() => {
    if (dataFrom !== 'modal' || !modalConfig?.name || fields.length === 0) return

    fetchByPage()
  }, [dataFrom, modalConfig?.name, cacheModalCondition, fields])

  return {
    records,
    total,
    loading,
    fetchByPage,
  }
}
