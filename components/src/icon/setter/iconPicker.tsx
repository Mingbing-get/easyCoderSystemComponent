import { Select } from '@arco-design/web-react'
import { WithLabel } from '@easy-coder/sdk/design'
import { i18n } from '@easy-coder/sdk/i18n'

import { WithGroupInfoSVGIcon } from '../type'
import RenderSvgIcon from './renderSvgIcon'
import PickerPanel from './pickerPanel'

import './iconPicker.scss'

interface Props {
  title?: string
  isVertical?: boolean

  value?: WithGroupInfoSVGIcon
  disabled?: boolean
  onChange?: (value?: WithGroupInfoSVGIcon) => void
}

export default function IconPickerSetter({ title, isVertical, value, disabled, onChange }: Props) {
  return (
    <WithLabel
      title={title}
      isVertical={isVertical}>
      <Select
        triggerProps={{
          style: {
            width: 'fit-content',
          },
        }}
        getPopupContainer={() => document.body}
        size="mini"
        disabled={disabled}
        options={[]}
        value={value ? '111' : undefined}
        renderFormat={() =>
          value ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <RenderSvgIcon
                tags={value.tags}
                viewBox={value.viewBox}
                fill={value.fill}
                stroke={value.stroke}
                strokeWidth={value.strokeWidth}
              />
              <span>{i18n.translateFillEmpty(value.label)}</span>
            </span>
          ) : null
        }
        dropdownRender={() => (
          <PickerPanel
            value={value}
            onPick={onChange}
          />
        )}
      />
    </WithLabel>
  )
}
