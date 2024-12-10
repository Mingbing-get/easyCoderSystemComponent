import { useMemo } from 'react'
import { SelectSetter, SelectSetterProps } from '@easy-coder/sdk/design'
import { useEffectCallback } from '@easy-coder/sdk/helper'
import { EasyCoderState, useElementContext, useStore, depRemoveEditor } from '@easy-coder/sdk/store'

import { MenuProps } from '..'

export default function DataFromSetter({ onChange, ...extra }: Omit<SelectSetterProps, 'options'>) {
  const { id, removeSlot, updateProps } = useElementContext<any, MenuProps>()
  const { state } = useStore()

  const options = useMemo(
    () => [
      { value: 'modal', label: '数据模型' },
      { value: 'variable', label: '关联变量' },
      { value: 'custom', label: '自定义' },
    ],
    []
  )

  const handleChange = useEffectCallback(
    async (v: 'modal' | 'variable' | 'custom') => {
      await updateProps(
        {
          modalConfig: undefined,
          parentFieldName: undefined,
          customData: undefined,
          variableValue: undefined,
          childKeyName: undefined,
          idKeyName: undefined,
        },
        true
      )

      if (v !== 'custom') {
        await removeSlot('customRender')
      } else {
        await state.updateValue((old) => {
          const newEditorMap = { ...state.getValue<EasyCoderState.Desc>().editorMap }
          const newElementMap = { ...state.getValue<EasyCoderState.Desc>().elementMap }

          const element = newElementMap[id]
          if (!element) {
            console.error(`未找到组件: ${id}`)
            return
          }

          if (element.slotMap?.labelRender?.length) {
            element.slotMap.labelRender.forEach((slotId) => {
              depRemoveEditor(newEditorMap, newElementMap, slotId)
            })
            element.slotMap.labelRender = []
          }
          if (element.slotMap?.contentRender?.length) {
            element.slotMap.contentRender.forEach((slotId) => {
              depRemoveEditor(newEditorMap, newElementMap, slotId)
            })
            element.slotMap.contentRender = []
          }

          old.editorMap = newEditorMap
          old.elementMap = newElementMap
        })
      }

      onChange?.(v)
    },
    [onChange, id]
  )

  return (
    <SelectSetter
      options={options}
      onChange={handleChange}
      {...extra}
    />
  )
}
