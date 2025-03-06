import { useEffect, useMemo, useRef, useState } from 'react'
import classNames from 'classnames'
import { InputProps as ArcoInputProps } from '@arco-design/web-react'
import { EasyCoderElement, useEnv, useElementContext } from '@easy-coder/sdk/store'
import { VariableCondition, VariableDefine } from '@easy-coder/sdk/variable'
import { LookupInRecord } from '@easy-coder/sdk/data'
import { useEffectCallback } from '@easy-coder/sdk/helper'
import { ModalConfig } from '@easy-coder/sdk/design'
import { Multilingual, i18n } from '@easy-coder/sdk/i18n'

import { createDefineFromProps } from './utils'
import Base from './base'

import './index.scss'

export interface InputProps extends EasyCoderElement.DataProps {
  type: Exclude<VariableDefine.Desc['type'], 'object' | 'array' | 'json'>
  enumGroupName?: string
  disableEnumNames?: string[]
  modalName?: ModalConfig
  condition?: VariableCondition.Desc
  maxLength?: number

  style?: React.CSSProperties
  className?: string
  labelStyle?: React.CSSProperties
  labelClassName?: string
  label?: string | Multilingual
  extraText?: string | Multilingual
  required?: boolean
  isInForm?: boolean

  direction?: 'row' | 'column'
  size?: ArcoInputProps['size']

  disabled?: boolean
  value?: number | string | Multilingual | LookupInRecord | string[] | LookupInRecord[]
  onChange?: (value?: number | string | Multilingual | LookupInRecord | string[] | LookupInRecord[]) => void
}

export interface InputExport {
  value?: number | string | Multilingual | LookupInRecord | string[] | LookupInRecord[]
  isDisabled?: boolean
  hasError?: boolean
  setValue?: (value?: number | string | Multilingual | LookupInRecord | string[] | LookupInRecord[]) => void
  setDisabled?: (disabled?: boolean) => void
  setExtraText?: (text?: string | Multilingual) => void
  setErrorText?: (text?: string | Multilingual) => void
}

export const supportTypes: InputProps['type'][] = [
  'boolean',
  'date',
  'datetime',
  'enum',
  'file',
  'float',
  'lookup',
  'multipleEnum',
  'multipleLookup',
  'number',
  'string',
  'text',
  'multilingual',
]

export default function Input({
  type,
  enumGroupName,
  disableEnumNames,
  modalName,
  condition,
  maxLength,
  style,
  className,
  labelStyle,
  labelClassName,
  label,
  extraText,
  required,
  isInForm,
  direction = 'row',
  size = 'default',
  disabled,
  value,
  onChange,
  ...extra
}: InputProps) {
  const [_value, setValue] = useState(isInForm ? undefined : value)
  const [_disabled, setDisabled] = useState(disabled)
  const [errorText, setErrorText] = useState<string | Multilingual>()
  const [_extraText, setExtraText] = useState<string | Multilingual>(extraText)
  const isChangeBySelf = useRef(false)

  const { isPreviewing } = useEnv()
  const { exportAttr, exportEvent } = useElementContext<InputExport, InputProps>()

  const define = useMemo(() => {
    return createDefineFromProps({ type, enumGroupName, modalName, maxLength })
  }, [type, enumGroupName, modalName, maxLength])

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
    setExtraText(extraText)
  }, [extraText])

  useEffect(() => {
    if (isChangeBySelf.current || isInForm) return

    setValue(value)
  }, [value, isInForm])

  useEffect(() => {
    exportAttr('isDisabled', _disabled)
  }, [_disabled])

  useEffect(() => {
    exportAttr('value', _value)
  }, [_value])

  useEffect(() => {
    exportAttr('hasError', !!errorText)
  }, [errorText])

  useEffect(() => {
    exportEvent({
      setValue: handleChangeValue,
      setDisabled,
      setErrorText,
      setExtraText,
    })

    return () => exportEvent({})
  }, [])

  if (!define) {
    if (isPreviewing) {
      return <div {...extra}>{i18n.translate({ zh: '未完成配置', en: 'Incomplete configuration' })}</div>
    }

    return null
  }

  return (
    <div
      className={classNames('easy-coder-input', `direction-${direction}`, className)}
      style={style}
      {...extra}>
      {label && (
        <label
          className={classNames('easy-coder-input-label', `size-${size}`, required && 'is-required', labelClassName)}
          style={labelStyle}>
          {i18n.translateFillEmpty(label)}
        </label>
      )}
      <div className="easy-coder-input-inner">
        <Base
          size={size}
          define={define}
          disabledNames={disableEnumNames}
          condition={condition}
          disabled={_disabled}
          value={_value}
          onChange={handleChangeValue}
        />
        {errorText && <p className="easy-coder-input-error-tip">{i18n.translateFillEmpty(errorText)}</p>}
        {_extraText && <p className="easy-coder-input-extra-tip">{i18n.translateFillEmpty(_extraText)}</p>}
      </div>
    </div>
  )
}
