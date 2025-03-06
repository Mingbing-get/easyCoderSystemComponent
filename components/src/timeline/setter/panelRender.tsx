import { useMemo } from 'react'
import { ObjectPanelOrLabelRenderProps, SelectSetter, WithLabel } from '@easy-coder/sdk/design'
import { useEffectCallback } from '@easy-coder/sdk/helper'
import { i18n, MultilingualInput } from '@easy-coder/sdk/i18n'

import { CustomTimelineItem } from '..'

export default function PanelRender({ item, disabled, onChange }: ObjectPanelOrLabelRenderProps<CustomTimelineItem>) {
  const dotTypeOptions = useMemo(
    () => [
      { value: 'solid', label: i18n.translate({ zh: '实心圆', en: 'Solid circle' }) },
      { value: 'hollow', label: i18n.translate({ zh: '空心圆', en: 'Hollow Circle' }) },
    ],
    []
  )

  const lineTypeOptions = useMemo(
    () => [
      { value: 'solid', label: i18n.translate({ zh: '实线', en: 'Solid line' }) },
      { value: 'dashed', label: i18n.translate({ zh: '虚线', en: 'Dashed line' }) },
      { value: 'dotted', label: i18n.translate({ zh: '点线', en: 'Dot line' }) },
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
      <WithLabel title={i18n.translate({ zh: '标签', en: 'Label' })}>
        <MultilingualInput
          size="mini"
          value={item.label}
          onInputComplete={(v) => handleChange('label', v)}
          disabled={disabled}
        />
      </WithLabel>
      <SelectSetter
        title={i18n.translate({ zh: '点类型', en: 'Dot type' })}
        disabled={disabled}
        value={item.dotType}
        options={dotTypeOptions}
        onChange={(v) => handleChange('dotType', v as string)}
      />
      <SelectSetter
        title={i18n.translate({ zh: '线类型', en: 'Line type' })}
        disabled={disabled}
        value={item.lineType}
        options={lineTypeOptions}
        onChange={(v) => handleChange('lineType', v as string)}
      />
    </div>
  )
}
