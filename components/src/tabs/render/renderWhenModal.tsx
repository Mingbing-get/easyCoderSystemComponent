import { useEffect, useState } from 'react'
import { Tabs, Spin } from '@arco-design/web-react'
import { useEffectCallback } from '@easy-coder/sdk/helper'
import { EasyCoderElement, useModelRecords } from '@easy-coder/sdk/store'

import { TabsProps } from '..'

interface Props extends Omit<TabsProps, 'dataFrom' | 'variableValue' | 'customData' | 'customRender'> {}

export default function RenderWhenModal({ panelClassName, panelStyle, extraRender, modalConfig, titleRender, contentRender, onChange, ...extra }: Props) {
  const [activeKey, setActiveKey] = useState<string>()

  const { records, loading } = useModelRecords({
    modalName: modalConfig?.name,
    fields: modalConfig?.fields,
    orders: modalConfig?.orders,
    useApiId: true,
    useExampleWhenPreview: true,
    exampleCount: 5,
    autoFetch: {
      limit: 20,
      condition: modalConfig?.condition,
    },
  })

  const handleChange = useEffectCallback(
    (key: string) => {
      const item = records?.find((record) => record._id === Number(key))
      if (!item) return

      setActiveKey(key)
      onChange?.(item)
    },
    [records, onChange]
  )

  useEffect(() => {
    if (!records?.length) {
      setActiveKey(undefined)
      return
    }

    setActiveKey((old) => {
      const record = records.find((record) => record._id === Number(old))
      if (record) return old

      onChange?.(records[0])
      return `${records[0]._id}`
    })
  }, [records])

  if (loading) {
    const dataProps: EasyCoderElement.DataProps = {}
    for (const key in extra) {
      if (key.startsWith('data-')) {
        dataProps[key] = extra[key]
      }
    }

    return (
      <Spin
        {...dataProps}
        style={extra.style}
        className={extra.className}
        loading
      />
    )
  }

  return (
    <Tabs
      {...extra}
      destroyOnHide
      activeTab={activeKey}
      extra={extraRender?.()}
      onChange={handleChange}>
      {records?.map((item) => (
        <Tabs.TabPane
          className={panelClassName}
          style={panelStyle}
          key={`${item._id}`}
          title={titleRender?.({ item })}>
          {contentRender?.({ item })}
        </Tabs.TabPane>
      ))}
    </Tabs>
  )
}
