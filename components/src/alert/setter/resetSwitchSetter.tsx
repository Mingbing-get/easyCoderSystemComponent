import { Switch, SwitchProps } from '@arco-design/web-react'

import { WithLabel } from '@easy-coder/sdk/design'
import { useEffectCallback } from '@easy-coder/sdk/helper'
import { useElementContext, useStore, depRemoveEditor, depRemoveElement, EasyCoderState } from '@easy-coder/sdk/store'

type PropsType = 'attr' | 'slot' | 'multipleSlot'

interface PropsKeyWithType {
  key: string
  type: PropsType
  resetValue?: any
}

interface Props extends Pick<SwitchProps, 'size'> {
  value?: boolean
  disabled?: boolean
  onChange?: (value?: boolean) => any
  title?: string
  isVertical?: boolean
  whenTrue?: PropsKeyWithType[]
  whenFalse?: PropsKeyWithType[]
}

export default function ResetSwitchSetter({ title, isVertical, whenTrue, whenFalse, size, value, disabled, onChange }: Props) {
  const { id } = useElementContext()
  const { state } = useStore()

  const handleChange = useEffectCallback(
    async (checked?: boolean) => {
      const willHandle: PropsKeyWithType[] = []
      if (checked && whenTrue?.length) {
        willHandle.push(...whenTrue)
      }

      if (!checked && whenFalse?.length) {
        willHandle.push(...whenFalse)
      }

      if (willHandle.length > 0) {
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

      onChange?.(checked)
    },
    [onChange, whenTrue, whenFalse, id]
  )

  return (
    <WithLabel
      title={title}
      isVertical={isVertical}>
      <Switch
        size={size}
        checked={value}
        disabled={disabled}
        onChange={handleChange}
      />
    </WithLabel>
  )
}
