import { SelectSetter, SelectSetterProps } from '@easy-coder/sdk/design'
import { useEffectCallback } from '@easy-coder/sdk/helper'
import { useElementContext } from '@easy-coder/sdk/store'

import { TableProps } from '..'

interface DataFromOption {
  value: Required<TableProps>['dataFrom']
  label: string
}

const dataFromOptions: DataFromOption[] = [
  {
    value: 'modal',
    label: '数据模型',
  },
  {
    value: 'variable',
    label: '关联变量',
  },
  {
    value: 'custom',
    label: '自定义',
  },
]

interface Props extends Omit<SelectSetterProps, 'options' | 'isMultiple' | 'displayAs'> {}

export default function DataFromSetter({ onChange, ...props }: Props) {
  const { updateProps, removeSlot } = useElementContext<unknown, TableProps>()

  const handleChange = useEffectCallback(
    async (v: DataFromOption['value']) => {
      await updateProps(
        {
          modalConfig: undefined,
          variableValue: undefined,
          columns: undefined,
          rows: undefined,
          loopRow: undefined,
        },
        true
      )

      await removeSlot('headerRender')
      await removeSlot('customCellRender')
      await removeSlot('rowRender')

      onChange?.(v)
    },
    [onChange]
  )

  return (
    <SelectSetter
      {...props}
      onChange={handleChange}
      options={dataFromOptions}
    />
  )
}
