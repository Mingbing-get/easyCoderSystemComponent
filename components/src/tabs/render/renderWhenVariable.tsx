import { useEffect, useState } from 'react'
import { Tabs } from '@arco-design/web-react'
import { useEffectCallback } from '@easy-coder/sdk/helper'

import { TabsProps } from '..'

interface Props extends Omit<TabsProps, 'dataFrom' | 'modalConfig' | 'customData' | 'customRender' | 'fetchCount'> {}

export default function RenderWhenVariable({ panelClassName, panelStyle, extraRender, variableValue, titleRender, contentRender, onChange, ...extra }: Props) {
  const [activeKey, setActiveKey] = useState<string>()

  const handleChange = useEffectCallback(
    (key: string) => {
      const item = variableValue?.[Number(key)]
      if (!item) return

      setActiveKey(key)
      onChange?.(item)
    },
    [variableValue, onChange]
  )

  useEffect(() => {
    if (!variableValue?.length) {
      setActiveKey(undefined)
      return
    }

    setActiveKey((old) => {
      const item = old ? variableValue?.[Number(old)] : undefined
      if (item) return old

      onChange?.(variableValue[0])
      return '0'
    })
  }, [variableValue])

  return (
    <Tabs
      {...extra}
      destroyOnHide
      activeTab={activeKey}
      extra={extraRender?.()}
      onChange={handleChange}>
      {variableValue?.map((item, index) => (
        <Tabs.TabPane
          className={panelClassName}
          style={panelStyle}
          key={`${index}`}
          title={titleRender?.({ item })}>
          {contentRender?.({ item })}
        </Tabs.TabPane>
      ))}
    </Tabs>
  )
}
