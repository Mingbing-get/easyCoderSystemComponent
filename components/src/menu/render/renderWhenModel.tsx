import { useEffect, useMemo, useState } from 'react'
import classNames from 'classnames'
import { LookupInRecord } from '@easy-coder/sdk/data'
import { useModelRecords, useEnv } from '@easy-coder/sdk/store'
import { useEffectCallback } from '@easy-coder/sdk/helper'

import { MenuProps } from '..'
import BaseMenu from '../base'
import { MenuData } from '../base/type'

interface Props
  extends Pick<
    MenuProps,
    | 'modalConfig'
    | 'parentFieldName'
    | 'labelRender'
    | 'contentRender'
    | 'canResizeMenu'
    | 'contentClassName'
    | 'contentStyle'
    | 'defaultWidth'
    | 'extraRender'
    | 'menuClassName'
    | 'menuStyle'
    | 'mode'
    | 'theme'
    | 'onActiveChange'
  > {}

export default function RenderWhenModel<T extends LookupInRecord>({
  modalConfig,
  parentFieldName,
  canResizeMenu,
  contentClassName,
  contentStyle,
  defaultWidth,
  menuClassName,
  menuStyle,
  theme,
  mode,
  extraRender,
  labelRender,
  contentRender,
  onActiveChange,
}: Props) {
  const [records, setRecords] = useState<T[]>([])
  const [currentActiveRecordId, setCurrentActiveRecordId] = useState<number>()
  const { isPreviewing } = useEnv()

  const fields = useMemo(() => {
    const fieldNames = modalConfig?.fields?.map((field) => field.fieldName)

    if (fieldNames && parentFieldName && !fieldNames.includes(parentFieldName)) {
      fieldNames.push(parentFieldName)
    }

    return fieldNames
  }, [modalConfig?.fields, parentFieldName])

  const { initComplete, fetchRecords, transformCondition } = useModelRecords<T, '', true>({
    modalName: modalConfig?.name,
    fields,
    orders: modalConfig?.orders,
    useApiId: true,
    useExampleWhenPreview: true,
    exampleCount: 4,
  })

  const fetchNextLevelRecords = useEffectCallback(
    async (parentId?: number | number[]) => {
      let condition = modalConfig?.condition
      if (parentFieldName) {
        if (!parentId) {
          condition = { id: '', op: 'and', children: [{ op: 'isNull', keyPath: [parentFieldName], id: '' }] }
        } else if (typeof parentId === 'number') {
          condition = { id: '', op: 'and', children: [{ op: 'eq', keyPath: [parentFieldName], value: parentId, id: '' }] }
        } else {
          condition = { id: '', op: 'and', children: [{ op: 'in', keyPath: [parentFieldName], value: parentId, id: '' }] }
        }

        if (modalConfig?.condition) {
          condition.children.push(modalConfig?.condition)
        }
      }

      const modalCondition = await transformCondition(condition)
      if (modalCondition === false) return

      const res = await fetchRecords({
        condition: modalCondition,
      })

      if (!res) return

      if (isPreviewing && parentFieldName) {
        res.records.forEach((record) => (record[parentFieldName] = undefined))
      }

      if (!parentId) {
        setRecords(res.records)
      } else {
        setRecords((old) => {
          return [...old, ...res.records]
        })
      }

      if (!parentFieldName || parentId instanceof Array) return

      const ids: number[] = res.records.map((record) => record._id)
      if (ids.length === 0) return

      await fetchNextLevelRecords(ids)
    },
    [transformCondition, modalConfig?.condition, parentFieldName]
  )

  useEffect(() => {
    if (!initComplete) return

    fetchNextLevelRecords()
  }, [modalConfig?.name, modalConfig?.orders, modalConfig?.condition, fields, parentFieldName, initComplete])

  useEffect(() => {
    setCurrentActiveRecordId((old) => {
      if (old) return old

      const firstRecord = records?.[0]?._id
      return firstRecord
    })
  }, [records])

  const recordsToMenuData = useEffectCallback(
    (records: T[], parentId?: number) => {
      const menuData = records.reduce((total: MenuData[], record) => {
        if (!parentFieldName || (!parentId && !record[parentFieldName]) || (parentId && record[parentFieldName]?._id === parentId)) {
          const subMenus = parentFieldName ? recordsToMenuData(records, record._id) : []

          total.push({
            id: `${record._id}`,
            label: labelRender?.({ item: record }),
            subMenus,
          })
        }

        return total
      }, [])

      return menuData
    },
    [parentFieldName, labelRender]
  )

  const menuData = useMemo(() => recordsToMenuData(records), [records])

  const selectedKeys = useMemo(() => {
    if (!currentActiveRecordId) return

    return [`${currentActiveRecordId}`]
  }, [currentActiveRecordId])

  const currentRecord = useMemo(() => {
    return records.find((record) => record._id === currentActiveRecordId)
  }, [records, currentActiveRecordId])

  useEffect(() => {
    onActiveChange?.(currentRecord)
  }, [currentRecord])

  return (
    <>
      <BaseMenu
        style={menuStyle}
        className={menuClassName}
        triggerProps={{ showArrow: false }}
        mode={mode}
        theme={theme}
        defaultWidth={defaultWidth}
        canResize={canResizeMenu}
        extraRender={extraRender?.()}
        data={menuData}
        selectedKeys={selectedKeys}
        onClickMenuItem={(key) => setCurrentActiveRecordId(Number(key))}
      />
      <div
        className={classNames('easy-coder-menu-content', contentClassName)}
        style={contentStyle}>
        {currentRecord && contentRender?.({ item: currentRecord })}
      </div>
    </>
  )
}
