import { useEffect, useMemo, useRef, useState } from 'react'
import classNames from 'classnames'
import { Rate as RateBase, RateProps as RateBaseProps } from '@arco-design/web-react'
import { useEffectCallback } from '@easy-coder/sdk/helper'
import { EasyCoderElement, useElementContext } from '@easy-coder/sdk/store'
import { Multilingual, i18n } from '@easy-coder/sdk/i18n'

import './index.scss'

export interface RateProps
  extends EasyCoderElement.DataProps,
    Omit<RateBaseProps, 'defaultValue' | 'value' | 'className' | 'character' | 'onChange' | 'readonly' | 'tooltips'> {
  className?: string
  defaultValue?: number
  useCustomCharacter?: boolean
  tooltips?: Multilingual[]
  characterRender?: (payload: { index: number }) => React.ReactNode
  onChange?: (value: number) => void
}

export interface RateExport {
  value?: number
  isDisabled?: boolean
  setValue?: (value?: number) => void
  setDisabled?: (disabled?: boolean) => void
}

export default function Rate({ defaultValue, disabled, onChange, className, useCustomCharacter, characterRender, tooltips, ...extra }: RateProps) {
  const [_value, setValue] = useState(defaultValue)
  const [_disabled, setDisabled] = useState(disabled)
  const isChangeBySelf = useRef(false)

  const { exportAttr, exportEvent } = useElementContext<RateExport, RateProps>()

  const handleChangeValue = useEffectCallback(
    (v?: any) => {
      isChangeBySelf.current = true
      setValue(v)
      onChange?.(v)
    },
    [onChange]
  )

  useEffect(() => {
    setDisabled(disabled)
  }, [disabled])

  useEffect(() => {
    if (isChangeBySelf.current) return

    setValue(defaultValue)
  }, [defaultValue])

  useEffect(() => {
    exportAttr('isDisabled', _disabled)
  }, [_disabled])

  useEffect(() => {
    exportAttr('value', _value)
  }, [_value])

  useEffect(() => {
    exportEvent({
      setValue: handleChangeValue,
      setDisabled,
    })

    return () => exportEvent({})
  }, [])

  const translateTips = useMemo(() => tooltips?.map((item) => i18n.translate(item)), [tooltips])

  return (
    <RateBase
      {...extra}
      className={classNames('easy-coder-system-rate', className)}
      value={_value}
      disabled={_disabled}
      onChange={handleChangeValue}
      character={useCustomCharacter ? (index) => characterRender?.({ index }) : undefined}
      tooltips={translateTips}
    />
  )
}
