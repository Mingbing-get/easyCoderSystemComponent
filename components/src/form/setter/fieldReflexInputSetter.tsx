import { useEffect, useMemo, useState } from 'react'
import { Checkbox } from '@arco-design/web-react'
import { WithLabel } from '@easy-coder/sdk/design'
import { Modal, useDataCenter } from '@easy-coder/sdk/data'
import { useElementContext, useInsertElement, useRemoveElement, useStateById } from '@easy-coder/sdk/store'
import { useEffectCallback } from '@easy-coder/sdk/helper'

import { InputProps } from '../../input'

export interface FieldReflexInputSetterProps {
  modalName?: string
  title?: React.ReactNode
  isVertical?: boolean

  value?: Record<string, string>
  disabled?: boolean
  onChange?: (value?: Record<string, string>) => void
}

interface SelectOption {
  value: string
  label: string
}

export default function FieldReflexInputSetter({ modalName, title, isVertical, value, disabled, onChange }: FieldReflexInputSetterProps) {
  const { id } = useElementContext()
  const element = useStateById('element', id)
  const insertElement = useInsertElement()
  const removeElement = useRemoveElement()
  const dataCenter = useDataCenter()

  const [modal, setModal] = useState<Modal>()

  useEffect(() => {
    if (!modalName) {
      setModal(undefined)
      return
    }

    dataCenter.modalList().then((modals) => {
      const modal = modals.find((modal) => modal.name === modalName)

      setModal(modal)
    })
  }, [modalName])

  const canAddOptions = useMemo(() => {
    const canAddOptions: SelectOption[] = []

    modal?.fields.forEach((field) => {
      if (field.type === 'json') return

      canAddOptions.push({
        value: field.name,
        label: field.label,
      })
    })

    return canAddOptions
  }, [modal])

  const selectValue = useMemo(() => Object.keys(value || {}), [value])

  const slotId = useMemo(() => element?.slotMap?.children?.[0], [element?.slotMap?.children])

  const handleSelect = useEffectCallback(
    async (fieldName: string) => {
      const field = modal?.fields.find((field) => field.name === fieldName)
      if (!field || field.type === 'json' || !slotId) return

      const defaultProps: InputProps = {
        isInForm: true,
        type: field.type,
        label: field.label,
        required: field.required,
      }
      if (field.type === 'lookup') {
        defaultProps.modalName = { name: field.modalName }
        if (field.multiple) {
          defaultProps.type = 'multipleLookup'
        }
      } else if (field.type === 'enum') {
        defaultProps.enumGroupName = field.enumGroupName
        if (field.multiple) {
          defaultProps.type = 'multipleEnum'
        }
      } else if (field.type === 'file') {
        defaultProps.maxLength = field.maxLength
      }

      const inputId = await insertElement('system_component_input', slotId, undefined, defaultProps)
      if (!inputId) return

      onChange?.({ ...value, [fieldName]: inputId })
    },
    [modal, value, slotId, onChange]
  )

  const handleDeselect = useEffectCallback(
    (fieldName: string) => {
      if (!value[fieldName]) return

      removeElement(value[fieldName])

      const newValue = { ...value }
      delete newValue[fieldName]

      onChange?.(newValue)
    },
    [modal, value, onChange]
  )

  return (
    <WithLabel
      title={title}
      isVertical={isVertical}>
      <Checkbox.Group
        value={selectValue}
        direction="vertical">
        {canAddOptions.map((op) => (
          <Checkbox
            disabled={disabled}
            key={op.value}
            value={op.value}
            onChange={(checked) => {
              checked ? handleSelect(op.value) : handleDeselect(op.value)
            }}>
            {op.label}
          </Checkbox>
        ))}
      </Checkbox.Group>
    </WithLabel>
  )
}
