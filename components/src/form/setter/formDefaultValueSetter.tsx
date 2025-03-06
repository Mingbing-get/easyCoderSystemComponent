import { useMemo } from 'react'
import { WithLabel } from '@easy-coder/sdk/design'
import { SetterVariable, VariableDefine } from '@easy-coder/sdk/variable'
import { useVariableDefine } from '@easy-coder/sdk/store'

interface Props {
  modalName?: string
  value?: Record<string, any>
  disabled?: boolean
  onChange?: (value?: Record<string, any>) => void
  title?: React.ReactNode
  isVertical?: boolean
}

export default function FormDefaultValueSetter({ modalName, value, disabled, onChange, title, isVertical }: Props) {
  const { initComplete, variableDefine } = useVariableDefine()

  const define: VariableDefine.Lookup | undefined = useMemo(() => {
    if (!modalName) return

    return {
      type: 'lookup',
      label: {},
      apiName: '',
      modalName,
    }
  }, [modalName])

  if (!define || !initComplete) return

  return (
    <WithLabel
      title={title}
      isVertical={isVertical}>
      <SetterVariable
        define={define}
        disabled={disabled}
        showLabel={false}
        variables={variableDefine}
        useFx
        size="mini"
        value={value}
        onChange={onChange}
      />
    </WithLabel>
  )
}
