import { ModalConfig, ModalMetaSetter, ModalMetaSetterProps } from '@easy-coder/sdk/design'
import { useEffectCallback } from '@easy-coder/sdk/helper'
import { useElementContext, useStore, EasyCoderState, depRemoveElement } from '@easy-coder/sdk/store'

import { FormProps } from '..'

export default function FormModalSetter({ onChange, ...props }: ModalMetaSetterProps) {
  const { id } = useElementContext<unknown, FormProps>()
  const { state } = useStore()

  const handleChange = useEffectCallback(
    async (value?: ModalConfig) => {
      const element = state.getValue<EasyCoderState.Element>(['elementMap', id])

      const fieldReflex = element?.props?.fieldReflexInputElement

      await state.updateValue((old) => {
        const newEditorMap = { ...state.getValue<EasyCoderState.Desc>().editorMap }
        const newElementMap = { ...state.getValue<EasyCoderState.Desc>().elementMap }

        const element = newElementMap[id]
        if (element) {
          element.props = {
            ...element.props,
            defaultValue: undefined,
            fieldReflexInputElement: undefined,
          }
        }

        for (const key in fieldReflex) {
          depRemoveElement(newEditorMap, newElementMap, fieldReflex[key])
        }

        old.editorMap = newEditorMap
        old.elementMap = newElementMap
      })

      onChange?.(value)
    },
    [id, onChange]
  )

  return (
    <ModalMetaSetter
      onChange={handleChange}
      {...props}
    />
  )
}
