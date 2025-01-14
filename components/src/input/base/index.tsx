import {
  BooleanSetter,
  DateSetter,
  DateTimeSetter,
  EnumSetter,
  FileSetter,
  FloatSetter,
  MultipleEnumSetter,
  NumberSetter,
  StringSetter,
  TextSetter,
  VariableCondition,
  VariableDefine,
} from '@easy-coder/sdk/variable'

import WithConditionLookUpSetter from './withConditionLookupSetter'
import WithConditionMultipleLookupSetter from './withConditionMultipleLookupSetter'

import { InputProps } from '..'

type AcceptVariableDefine = Exclude<VariableDefine.Desc, VariableDefine.Object | VariableDefine.Array | VariableDefine.Json>

interface Props {
  size?: InputProps['size']
  value?: any
  define: AcceptVariableDefine
  disabled?: boolean
  onChange?: (value?: any) => void

  disabledNames?: string[]
  disabledApiNames?: string[]
  condition?: VariableCondition.Desc
}

export default function Base({ define, disabledApiNames, disabledNames, condition, ...props }: Props) {
  if (define.type === 'boolean') {
    return (
      <BooleanSetter
        define={define}
        {...props}
      />
    )
  }

  if (define.type === 'date') {
    return (
      <DateSetter
        define={define}
        {...props}
      />
    )
  }

  if (define.type === 'datetime') {
    return (
      <DateTimeSetter
        define={define}
        {...props}
      />
    )
  }

  if (define.type === 'enum') {
    return (
      <EnumSetter
        define={define}
        disabledApiNames={disabledApiNames}
        disabledNames={disabledNames}
        {...props}
      />
    )
  }

  if (define.type === 'multipleEnum') {
    return (
      <MultipleEnumSetter
        disabledApiNames={disabledApiNames}
        disabledNames={disabledNames}
        define={define}
        {...props}
      />
    )
  }

  if (define.type === 'float') {
    return (
      <FloatSetter
        define={define}
        {...props}
      />
    )
  }

  if (define.type === 'file') {
    return (
      <FileSetter
        define={define}
        {...props}
      />
    )
  }

  if (define.type === 'lookup') {
    return (
      <WithConditionLookUpSetter
        define={define}
        condition={condition}
        {...props}
      />
    )
  }

  if (define.type === 'multipleLookup') {
    return (
      <WithConditionMultipleLookupSetter
        define={define}
        condition={condition}
        {...props}
      />
    )
  }

  if (define.type === 'number') {
    return (
      <NumberSetter
        define={define}
        {...props}
      />
    )
  }

  if (define.type === 'string') {
    return (
      <StringSetter
        define={define}
        {...props}
      />
    )
  }

  if (define.type === 'text') {
    return (
      <TextSetter
        define={define}
        {...props}
      />
    )
  }

  return null
}
