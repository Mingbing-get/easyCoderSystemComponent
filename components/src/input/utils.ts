import { VariableDefine } from '@easy-coder/sdk/variable'

import { InputProps, supportTypes } from '.'

interface Options {
  label?: string
  apiName?: string
}

export function createDefineFromProps(
  { type, modalName, enumGroupName, maxLength }: Pick<InputProps, 'type' | 'modalName' | 'enumGroupName' | 'maxLength'>,
  { label = '', apiName = '' }: Options = {}
): Exclude<VariableDefine.Desc, VariableDefine.Object | VariableDefine.Array | VariableDefine.Json> | undefined {
  if (!type || !supportTypes.includes(type)) return

  if (type === 'lookup' || type === 'multipleLookup') {
    if (!modalName?.name) return

    return {
      type,
      label,
      apiName,
      modalName: modalName.name,
    }
  }

  if (type === 'enum' || type === 'multipleEnum') {
    if (!enumGroupName) return

    return {
      type,
      label,
      apiName,
      enumGroupName,
    }
  }

  if (type === 'file') {
    return {
      type,
      label,
      apiName,
      maxLength,
    }
  }

  return {
    type,
    label,
    apiName,
  }
}
