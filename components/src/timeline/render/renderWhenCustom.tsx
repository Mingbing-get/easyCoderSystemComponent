import { Timeline } from '@arco-design/web-react'

import { TimelineProps } from '..'

interface Props extends Omit<TimelineProps, 'customDotRender' | 'contentRender' | 'dataFrom' | 'modalConfig' | 'variableValue'> {}

export default function RenderWhenCustom({
  itemClassName,
  itemStyle,
  dotType,
  lineType,
  usePending,
  pendingDotRender,
  pendingRender,
  useCustomDot,
  customData,
  customRender,
  ...extra
}: Props) {
  return (
    <Timeline
      {...extra}
      pending={usePending ? pendingRender?.() : undefined}
      pendingDot={usePending ? pendingDotRender?.() : undefined}>
      {customData?.map((item) => (
        <Timeline.Item
          key={item.id}
          className={itemClassName}
          style={itemStyle}
          dotType={item.dotType || dotType}
          lineType={item.lineType || lineType}
          dot={useCustomDot ? customRender?.[item.dotSlotId]?.(item) : undefined}>
          {customRender?.[item.contentSlotId]?.(item)}
        </Timeline.Item>
      ))}
    </Timeline>
  )
}
