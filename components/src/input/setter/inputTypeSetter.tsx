import { SelectSetter, SelectSetterProps } from '@easy-coder/sdk/design'
import { useEffectCallback } from '@easy-coder/sdk/helper'
import { useElementContext } from '@easy-coder/sdk/store'

import { InputProps } from '..'

export default function InputTypeSetter({ onChange, ...extra }: SelectSetterProps) {
  const { updateProps } = useElementContext<any, InputProps>()

  const handleChange = useEffectCallback(
    async (v?: InputProps['type']) => {
      await updateProps(
        {
          modalName: undefined,
          maxLength: undefined,
          enumGroupName: undefined,
          value: undefined,
        },
        true
      )

      onChange?.(v)
    },
    [onChange]
  )

  return (
    <SelectSetter
      onChange={handleChange}
      {...extra}
    />
  )
}
