import { useMemo } from 'react'
import classNames from 'classnames'
import * as iconsFa from 'react-icons/fa'
import { WithLabel } from '@easy-coder/sdk/design'
import { Select } from '@arco-design/web-react'

import './iconPickSetter.scss'

interface Props {
  title?: string
  isVertical?: boolean
  value?: string
  disabled?: boolean
  onChange?: (value?: string) => void
}

export default function IconPickSetter({ title, isVertical, value = 'FaPlus', disabled, onChange }: Props) {
  const allIconNames = useMemo(() => Object.keys(iconsFa), [])

  const Render = useMemo(() => iconsFa[value] || iconsFa.FaPlus, [value])

  return (
    <WithLabel
      title={title}
      isVertical={isVertical}>
      <Select
        size="mini"
        value={value}
        renderFormat={() => <Render />}
        dropdownRender={() => (
          <div className={classNames('easy-coder-icon-pick-setter', disabled && 'is-disabled')}>
            {allIconNames.map((iconName) => {
              const Render = iconsFa[iconName]

              return (
                <div
                  className={classNames('easy-coder-icon-pick-cell', value === iconName && 'is-select')}
                  key={iconName}
                  onClick={disabled ? undefined : () => onChange?.(iconName)}>
                  <Render />
                </div>
              )
            })}
          </div>
        )}
      />
    </WithLabel>
  )
}
