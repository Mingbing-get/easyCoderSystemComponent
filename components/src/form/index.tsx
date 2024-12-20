import { useEffect, useRef, useState } from 'react'
import { ModalConfig } from '@easy-coder/sdk/design'
import { useEffectCallback } from '@easy-coder/sdk/helper'
import { EasyCoderElement, useElementContext, COMPONENT_VARIABLE, COMPONENT_EVENT, useStore } from '@easy-coder/sdk/store'

export interface FormProps extends EasyCoderElement.DataProps {
  style?: React.CSSProperties
  className?: string
  modalConfig?: ModalConfig
  fieldReflexInputElement?: Record<string, string>
  defaultValue?: Record<string, any>
  children?: (value?: Record<string, any>) => React.ReactNode

  onChange?: (value: Record<string, any>) => void
}

export interface FormExport {
  value: Record<string, any>
  setValue?: (value?: Record<string, any>) => void
  clear?: () => void
}

export default function Form({ children, modalConfig, fieldReflexInputElement, defaultValue, onChange, ...extra }: FormProps) {
  const customIsEdit = useRef(false)
  const [value, setValue] = useState({})
  const valueRef = useRef({})
  const { variableStore } = useStore()

  const { exportAttr, exportEvent } = useElementContext<FormExport, FormProps>()

  const handleTriggerInputChange = useEffectCallback(
    (beforeValue?: Record<string, any>, newValue?: Record<string, any>) => {
      for (const key in fieldReflexInputElement) {
        if (beforeValue?.[key] === newValue?.[key]) {
          continue
        }

        const setInputValue = variableStore.getValue<((v?: any) => void) | undefined>([COMPONENT_EVENT, fieldReflexInputElement[key], 'setValue'])
        setInputValue?.(newValue?.[key])
      }

      valueRef.current = newValue
    },
    [fieldReflexInputElement]
  )

  const handleChangeValue = useEffectCallback(
    (value?: Record<string, any>) => {
      customIsEdit.current = true

      setValue((old) => {
        const newValue = value || {}

        handleTriggerInputChange(old, newValue)
        onChange?.(newValue)

        return newValue
      })
    },
    [onChange]
  )

  const handleClear = useEffectCallback(() => {
    customIsEdit.current = true

    setValue((old) => {
      const newValue = {}

      handleTriggerInputChange(old, newValue)
      onChange?.(newValue)

      return newValue
    })
  }, [onChange])

  const handleChangeValueByField = useEffectCallback(
    (fieldName: string, v: any) => {
      customIsEdit.current = true

      setValue((old) => {
        if (old[fieldName] === v) return old

        const newValue = { ...old, [fieldName]: v }

        onChange?.(newValue)

        return newValue
      })
    },
    [onChange]
  )

  useEffect(() => {
    return variableStore.addChangeListener((paths) => {
      for (const fieldName in fieldReflexInputElement) {
        const needUpdatePath = [COMPONENT_VARIABLE, fieldReflexInputElement[fieldName], 'value']

        const elementValueIsChange = paths.some((path) => {
          for (let i = 0; i < needUpdatePath.length; i++) {
            if (path[i] !== needUpdatePath[i]) return false
          }

          return true
        })

        if (elementValueIsChange) {
          handleChangeValueByField(fieldName, variableStore.getValue(needUpdatePath))
        }

        const needUpdateFnPath = [COMPONENT_EVENT, fieldReflexInputElement[fieldName], 'setValue']
        const elementSetValueIsChange = paths.some((path) => {
          for (let i = 0; i < needUpdateFnPath.length - 1; i++) {
            if (path[i] !== needUpdateFnPath[i]) return false
          }

          return true
        })

        if (elementSetValueIsChange) {
          const setInputValue = variableStore.getValue<((v?: any) => void) | undefined>(needUpdateFnPath)
          setInputValue?.(valueRef.current?.[fieldName])
        }
      }
    })
  }, [fieldReflexInputElement])

  useEffect(() => {
    if (customIsEdit.current) return

    setValue((old) => {
      const newValue = defaultValue || {}

      handleTriggerInputChange(old, newValue)

      return newValue
    })
  }, [defaultValue])

  useEffect(() => {
    exportAttr('value', value)
  }, [value])

  useEffect(() => {
    exportEvent({
      setValue: handleChangeValue,
      clear: handleClear,
    })

    return () => exportEvent({})
  }, [])

  return <div {...extra}>{children?.({ value })}</div>
}
