import { Collapse, Spin } from '@arco-design/web-react'
import { EasyCoderElement, useModelRecords } from '@easy-coder/sdk/store'

import { CollapseProps } from '..'

interface Props extends Omit<CollapseProps, 'triggerRegion' | 'dataFrom' | 'variableValue' | 'customData' | 'customRender'> {
  triggerRegion?: 'header' | 'icon'
}

export default function RenderWhenModal({ itemClassName, itemStyle, contentStyle, modalConfig, headerRender, extraRender, contentRender, ...extra }: Props) {
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
    <Collapse
      {...extra}
      destroyOnHide>
      {records?.map((record) => (
        <Collapse.Item
          key={record._id}
          name={record._id}
          className={itemClassName}
          style={itemStyle}
          contentStyle={contentStyle}
          header={headerRender?.({ item: record })}
          extra={extraRender?.({ item: record })}>
          {contentRender?.({ item: record })}
        </Collapse.Item>
      ))}
    </Collapse>
  )
}
