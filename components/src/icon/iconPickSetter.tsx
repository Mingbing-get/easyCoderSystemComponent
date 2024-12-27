import { useMemo, useState } from 'react'
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
  const [searchText, setSearchText] = useState<string>()
  const allIconNames = useMemo(() => Object.keys(iconsFa), [])

  const Render = useMemo(() => iconsFa[value] || iconsFa.FaPlus, [value])

  const afterFilterIconNames = useMemo(() => {
    if (!searchText) return allIconNames

    return allIconNames.filter((iconName) => iconName.toLowerCase().includes(searchText.toLowerCase()))
  }, [searchText])

  return (
    <WithLabel
      title={title}
      isVertical={isVertical}>
      <Select
        size="mini"
        value={value}
        showSearch
        onSearch={setSearchText}
        renderFormat={() => (
          <span style={{ display: 'inline-flex', alignItems: 'center' }}>
            <span>{value.substring(2)}</span>
            <Render />
          </span>
        )}
        dropdownRender={() => (
          <div className={classNames('easy-coder-icon-pick-setter', disabled && 'is-disabled')}>
            {afterFilterIconNames.map((iconName) => {
              const Render = iconsFa[iconName]

              return (
                <div
                  className={classNames('easy-coder-icon-pick-cell', value === iconName && 'is-select')}
                  key={iconName}
                  onClick={disabled ? undefined : () => onChange?.(iconName)}>
                  <Render />
                  <span className="icon-name">{iconName.substring(2)}</span>
                </div>
              )
            })}
          </div>
        )}
      />
    </WithLabel>
  )
}
