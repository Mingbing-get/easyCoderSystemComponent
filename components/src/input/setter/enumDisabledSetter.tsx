import { useEffect, useMemo, useState } from 'react'
import { WithLabel } from '@easy-coder/sdk/design'
import { Checkbox, Message } from '@arco-design/web-react'
import { useDataCenter, Enum } from '@easy-coder/sdk/data'
import { useEffectCallback } from '@easy-coder/sdk/helper'
import { Multilingual, i18n } from '@easy-coder/sdk/i18n'

interface Props {
  title?: Multilingual
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
        Message.error(`${i18n.translateFillEmpty({ zh: '未找到选项组', en: 'Enum group not found' })}: ${enumGroupName}`)
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
    <WithLabel title={i18n.translate(title)}>
      <Checkbox.Group
        disabled={disabled}
        value={checkedList}
        onChange={handleChange}>
        {enums.map((item) => (
          <Checkbox
            value={item.name}
            key={item.name}>
            {i18n.translate(item.label)}
          </Checkbox>
        ))}
      </Checkbox.Group>
    </WithLabel>
  )
}
