import { useEffect, useMemo, useRef, useState } from 'react'
import classNames from 'classnames'
import { InputProps as ArcoInputProps } from '@arco-design/web-react'
import { EasyCoderElement, useEnv, useElementContext } from '@easy-coder/sdk/store'
import { SetterVariable, VariableDefine } from '@easy-coder/sdk/variable'
import { LookupInRecord } from '@easy-coder/sdk/data'
import { useEffectCallback } from '@easy-coder/sdk/helper'
import { ModalConfig } from '@easy-coder/sdk/design'

import { createDefineFromProps } from './utils'

import './index.scss'

export interface InputProps extends EasyCoderElement.DataProps {
  type: Exclude<VariableDefine.Desc['type'], 'object' | 'array' | 'json'>
  enumGroupName?: string
  modalName?: ModalConfig
  maxLength?: number

  style?: React.CSSProperties
  className?: string
  labelStyle?: React.CSSProperties
  labelClassName?: string
  label?: string
  direction?: 'row' | 'column'
  size?: ArcoInputProps['size']

  disabled?: boolean
  value?: number | string | LookupInRecord | string[] | LookupInRecord[]
  onChange?: (value?: number | string | LookupInRecord | string[] | LookupInRecord[]) => void
}

export interface InputExport {
  value?: number | string | LookupInRecord | string[] | LookupInRecord[]
  isDisabled?: boolean
  setValue: (value?: number | string | LookupInRecord | string[] | LookupInRecord[]) => void
  setDisabled: (disabled?: boolean) => void
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
]

export default function Input({
  type,
  enumGroupName,
  modalName,
  maxLength,
  style,
  className,
  labelStyle,
  labelClassName,
  label,
  direction = 'row',
  size = 'default',
  disabled,
  value,
  onChange,
  ...extra
}: InputProps) {
  const [_value, setValue] = useState(value)
  const [_disabled, setDisabled] = useState(disabled)
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
    if (isChangeBySelf.current) return

    setValue(value)
  }, [value])

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
  }, [])

  if (!define) {
    if (isPreviewing) {
      return <div {...extra}>未完成配置</div>
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
          className={classNames('easy-coder-input-label', `size-${size}`, labelClassName)}
          style={labelStyle}>
          {label}
        </label>
      )}
      <div className="easy-coder-input-inner">
        <SetterVariable
          size={size}
          define={define}
          disabled={_disabled}
          useFx={false}
          showLabel={false}
          value={_value}
          onChange={handleChangeValue}
        />
      </div>
    </div>
  )
}
