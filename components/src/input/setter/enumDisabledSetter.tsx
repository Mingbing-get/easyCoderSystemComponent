import { useEffect, useMemo, useState } from 'react'
import { WithLabel } from '@easy-coder/sdk/design'
import { Checkbox, Message } from '@arco-design/web-react'
import { useDataCenter, Enum } from '@easy-coder/sdk/data'
import { useEffectCallback } from '@easy-coder/sdk/helper'

interface Props {
  title?: string
  enumGroupName: string

  value?: string[]
  disabled?: boolean
  onChange?: (value?: string[]) => void
}

export default function EnumDisabledSetter({ title, enumGroupName, value, disabled, onChange }: Props) {
  const [enums, setEnums] = useState<Enum[]>([])
  const dataCenter = useDataCenter()

  useEffect(() => {
    dataCenter.enumGroupList().then((enumGroups) => {
      const enumGroup = enumGroups.find((group) => group.name === enumGroupName)
      if (!enumGroup) {
        setEnums([])
        Message.error(`未找到选项组: ${enumGroupName}`)
        return
      }

      setEnums(enumGroup.enums)
    })
  }, [enumGroupName])

  const checkedList = useMemo(() => {
    return enums.reduce((total: string[], item) => {
      if (!value?.includes(item.name)) {
        total.push(item.name)
      }

      return total
    }, [])
  }, [enums, value])

  const handleChange = useEffectCallback(
    (value?: string[]) => {
      const disabledValues = enums.reduce((total: string[], item) => {
        if (!value?.includes(item.name)) {
          total.push(item.name)
        }

        return total
      }, [])

      onChange?.(disabledValues)
    },
    [onChange, enums]
  )

  return (
    <WithLabel title={title}>
      <Checkbox.Group
        disabled={disabled}
        value={checkedList}
        onChange={handleChange}>
        {enums.map((item) => (
          <Checkbox
            value={item.name}
            key={item.name}>
            {item.label}
          </Checkbox>
        ))}
      </Checkbox.Group>
    </WithLabel>
  )
}
