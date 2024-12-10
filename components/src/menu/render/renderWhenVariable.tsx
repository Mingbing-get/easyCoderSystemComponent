import { useEffect, useMemo, useState } from 'react'
import classNames from 'classnames'
import { useEffectCallback } from '@easy-coder/sdk/helper'

import { MenuProps } from '..'
import BaseMenu from '../base'
import { MenuData } from '../base/type'
import useStandardVariable from '../hooks/useStandardVariable'

interface Props
  extends Pick<
    MenuProps,
    | 'variableValue'
    | 'childKeyName'
    | 'idKeyName'
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

export default function RenderWhenVariable({
  variableValue,
  childKeyName,
  idKeyName,
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
  const [currentActiveRecordId, setCurrentActiveRecordId] = useState<string>()

  const afterTransformValue = useStandardVariable({
    value: variableValue,
    propsKey: 'variableValue',
    childKeyName,
  })

  const recordsToMenuData = useEffectCallback(
    (records: Record<string, any>[], idKeyName: string, childKeyName?: string) => {
      if (!records?.length || !idKeyName) return []

      const menuData: MenuData[] = records.map((record) => {
        const children = childKeyName && record[childKeyName]
        const subMenus = recordsToMenuData(children, idKeyName, childKeyName)

        return {
          id: `${record[idKeyName]}`,
          label: labelRender?.({ item: record }),
          subMenus,
        }
      }, [])

      return menuData
    },
    [labelRender]
  )

  const menuData = useMemo(() => recordsToMenuData(afterTransformValue, idKeyName, childKeyName), [afterTransformValue, idKeyName, childKeyName])

  useEffect(() => {
    if (!afterTransformValue?.length) return

    setCurrentActiveRecordId((old) => {
      if (old) return old

      return `${afterTransformValue?.[0]?.[idKeyName]}`
    })
  }, [afterTransformValue, idKeyName])

  const selectedKeys = useMemo(() => [currentActiveRecordId], [currentActiveRecordId])

  const currentRecord = useMemo(() => {
    const records = [...(afterTransformValue || [])]

    while (records.length > 0) {
      const first = records.shift()
      if (first?.[idKeyName] === currentActiveRecordId) return first

      if (first?.[childKeyName]?.length) {
        records.push(...first[childKeyName])
      }
    }
  }, [afterTransformValue, childKeyName, idKeyName, currentActiveRecordId])

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
        onClickMenuItem={setCurrentActiveRecordId}
      />
      <div
        className={classNames('easy-coder-menu-content', contentClassName)}
        style={contentStyle}>
        {currentRecord && contentRender?.({ item: currentRecord })}
      </div>
    </>
  )
}
