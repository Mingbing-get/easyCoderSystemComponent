import { useMemo } from 'react'
import { Spin, Timeline } from '@arco-design/web-react'
import { EasyCoderElement, useModelRecords } from '@easy-coder/sdk/store'

import { TimelineProps } from '..'

interface Props extends Omit<TimelineProps, 'dataFrom' | 'variableValue' | 'customData' | 'customRender'> {}

export default function RenderWhenModal({
  itemClassName,
  itemStyle,
  dotType,
  lineType,
  usePending,
  pendingDotRender,
  pendingRender,
  useCustomDot,
  modalConfig,
  fetchCount,
  contentRender,
  customDotRender,
  ...extra
}: Props) {
  const autoFetch = useMemo(() => ({ limit: fetchCount || 10, condition: modalConfig?.condition }), [modalConfig?.condition, fetchCount])

  const { records, loading } = useModelRecords({
    modalName: modalConfig?.name,
    fields: modalConfig?.fields,
    orders: modalConfig?.orders,
    useApiId: true,
    useExampleWhenPreview: true,
    exampleCount: 5,
    autoFetch,
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
    <Timeline
      {...extra}
      pending={usePending ? pendingRender?.() : undefined}
      pendingDot={usePending ? pendingDotRender?.() : undefined}>
      {records?.map((item) => (
        <Timeline.Item
          key={item._id}
          className={itemClassName}
          style={itemStyle}
          dotType={dotType}
          lineType={lineType}
          dot={useCustomDot ? customDotRender?.({ item }) : undefined}>
          {contentRender?.({ item })}
        </Timeline.Item>
      ))}
    </Timeline>
  )
}
