import { useMemo } from 'react'
import { SetterVariable } from '@easy-coder/sdk/variable'

import { InputProps } from '..'
import { createDefineFromProps } from '../utils'

interface Props extends Pick<InputProps, 'type' | 'modalName' | 'enumGroupName' | 'maxLength'> {
  label?: string
  value?: any
  disabled?: boolean
  onChange?: (value?: any) => void
}

export default function InputValueSetter({ label, value, disabled, onChange, type, enumGroupName, modalName, maxLength }: Props) {
  const define = useMemo(() => {
    return createDefineFromProps({ type, enumGroupName, modalName, maxLength }, { label })
  }, [type, enumGroupName, modalName, maxLength, label])

  if (!define) return null

  return (
    <SetterVariable
      define={define}
      value={value}
      disabled={disabled}
      onChange={onChange}
      size="mini"
      useFx
    />
  )
}
