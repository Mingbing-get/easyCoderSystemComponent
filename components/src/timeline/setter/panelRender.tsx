import { useMemo } from 'react'
import { Input } from '@arco-design/web-react'
import { ObjectPanelOrLabelRenderProps, SelectSetter, WithLabel } from '@easy-coder/sdk/design'
import { useEffectCallback } from '@easy-coder/sdk/helper'

import { CustomTimelineItem } from '..'

export default function PanelRender({ item, disabled, onChange }: ObjectPanelOrLabelRenderProps<CustomTimelineItem>) {
  const dotTypeOptions = useMemo(
    () => [
      { value: 'solid', label: '实心圆' },
      { value: 'hollow', label: '空心圆' },
    ],
    []
  )

  const lineTypeOptions = useMemo(
    () => [
      { value: 'solid', label: '实线' },
      { value: 'dashed', label: '虚线' },
      { value: 'dotted', label: '点线' },
    ],
    []
  )

  const handleChange = useEffectCallback(
    <K extends keyof CustomTimelineItem>(key: K, v: CustomTimelineItem[K]) => {
      onChange?.({ ...item, [key]: v })
    },
    [item, onChange]
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: 240 }}>
      <WithLabel title="标签">
        <Input
          size="mini"
          value={item.label}
          onChange={(v) => handleChange('label', v)}
          disabled={disabled}
        />
      </WithLabel>
      <SelectSetter
        title="点类型"
        disabled={disabled}
        value={item.dotType}
        options={dotTypeOptions}
        onChange={(v) => handleChange('dotType', v as string)}
      />
      <SelectSetter
        title="线类型"
        disabled={disabled}
        value={item.lineType}
        options={lineTypeOptions}
        onChange={(v) => handleChange('lineType', v as string)}
      />
    </div>
  )
}
