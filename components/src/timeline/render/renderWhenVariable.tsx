import { Timeline } from '@arco-design/web-react'

import { TimelineProps } from '..'

interface Props extends Omit<TimelineProps, 'dataFrom' | 'modalConfig' | 'customData' | 'customRender'> {}

export default function RenderWhenVariable({
  itemClassName,
  itemStyle,
  dotType,
  lineType,
  usePending,
  pendingDotRender,
  pendingRender,
  useCustomDot,
  variableValue,
  contentRender,
  customDotRender,
  ...extra
}: Props) {
  return (
    <Timeline
      {...extra}
      pending={usePending ? pendingRender?.() : undefined}
      pendingDot={usePending ? pendingDotRender?.() : undefined}>
      {variableValue?.map((item, index) => (
        <Timeline.Item
          key={index}
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
