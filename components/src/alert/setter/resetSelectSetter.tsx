import { SelectSetter, SelectSetterProps } from '@easy-coder/sdk/design'
import { useEffectCallback } from '@easy-coder/sdk/helper'
import { EasyCoderState, useElementContext, useStore, depRemoveEditor, depRemoveElement } from '@easy-coder/sdk/store'

type PropsType = 'attr' | 'slot' | 'multipleSlot'

interface PropsKeyWithType {
  key: string
  type: PropsType
  resetValue?: any
}

interface Props extends SelectSetterProps {
  when: Record<string, PropsKeyWithType[]>
}

export default function ResetSelectSetter({ when, onChange, ...extra }: Props) {
  const { id } = useElementContext()
  const { state } = useStore()

  const handleChange = useEffectCallback(
    async (value: string) => {
      const willHandle = when[value]

      if (willHandle?.length) {
        await state.updateValue((old) => {
          const newEditorMap = { ...state.getValue<EasyCoderState.Desc>().editorMap }
          const newElementMap = { ...state.getValue<EasyCoderState.Desc>().elementMap }

          const element = newElementMap[id]
          if (!element) {
            console.error(`未找到组件: ${id}`)
            return
          }

          willHandle.forEach(({ type, key, resetValue }) => {
            if (type === 'attr') {
              if (element.props) {
                element.props[key] = resetValue
              }
            } else if (type === 'multipleSlot') {
              if (element.slotMap?.[key]?.length) {
                element.slotMap[key].forEach((slotId) => {
                  depRemoveEditor(newEditorMap, newElementMap, slotId)
                })

                element.slotMap[key] = []
              }
            } else if (type === 'slot') {
              if (element.slotMap?.[key]?.length) {
                element.slotMap[key].forEach((slotId) => {
                  const editor = newEditorMap[slotId]
                  if (!editor) return

                  editor.elements.forEach((eleId) => {
                    depRemoveElement(newEditorMap, newElementMap, eleId)
                  })
                  editor.elements = []
                })
              }
            }
          })

          old.editorMap = newEditorMap
          old.elementMap = newElementMap
        })
      }

      onChange?.(value)
    },
    [onChange, when, id]
  )

  return (
    <SelectSetter
      {...extra}
      onChange={handleChange}
    />
  )
}
