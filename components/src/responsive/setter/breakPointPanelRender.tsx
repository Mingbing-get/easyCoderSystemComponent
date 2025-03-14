import { ObjectPanelOrLabelRenderProps, InProStyleSetter, WithLabel } from '@easy-coder/sdk/design'
import { MultilingualInput, i18n } from '@easy-coder/sdk/i18n'
import { InputNumber } from '@arco-design/web-react'

import { BreakPoint } from '..'
import { editorStyleModels } from '../config'

import './breakPointPanelRender.scss'

export default function BreakPointPanelRender({ item, disabled, onChange }: ObjectPanelOrLabelRenderProps<BreakPoint>) {
  return (
    <div className="easy-coder-break-point-panel-render">
      <WithLabel title={i18n.translate({ zh: '标签', en: 'label' })}>
        <MultilingualInput
          value={item.label}
          size="mini"
          disabled={disabled}
          onInputComplete={(v) => onChange?.({ ...item, label: v })}
        />
      </WithLabel>
      <WithLabel title={i18n.translate({ zh: '最大宽度', en: 'Max width' })}>
        <InputNumber
          size="mini"
          disabled={disabled}
          min={0}
          step={1}
          value={item.max}
          onChange={(v) => onChange?.({ ...item, max: v })}
        />
      </WithLabel>
      <InProStyleSetter
        value={item.style}
        disabled={disabled}
        title={i18n.translate({ zh: '生效样式', en: 'Active style' })}
        supportModels={editorStyleModels}
        onChange={(v) => onChange?.({ ...item, style: v })}
      />
    </div>
  )
}
