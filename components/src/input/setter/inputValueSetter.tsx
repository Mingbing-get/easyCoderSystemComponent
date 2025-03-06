import { useMemo } from 'react'
import { SetterVariable } from '@easy-coder/sdk/variable'
import { useVariableDefine } from '@easy-coder/sdk/store'
import { Multilingual } from '@easy-coder/sdk/i18n'

import { InputProps } from '..'
import { createDefineFromProps } from '../utils'

interface Props extends Pick<InputProps, 'type' | 'modalName' | 'enumGroupName' | 'maxLength'> {
  label?: Multilingual
  value?: any
  disabled?: boolean
  onChange?: (value?: any) => void
}

export default function InputValueSetter({ label, value, disabled, onChange, type, enumGroupName, modalName, maxLength }: Props) {
  const { initComplete, variableDefine } = useVariableDefine()

  const define = useMemo(() => {
    return createDefineFromProps({ type, enumGroupName, modalName, maxLength }, { label })
  }, [type, enumGroupName, modalName, maxLength, label])

  if (!define || !initComplete) return null

  return (
    <SetterVariable
      define={define}
      value={value}
      disabled={disabled}
      onChange={onChange}
      variables={variableDefine}
      size="mini"
      useFx
    />
  )
}
