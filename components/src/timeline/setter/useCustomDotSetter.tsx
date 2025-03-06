import { Switch, SwitchProps } from '@arco-design/web-react'

import { WithLabel } from '@easy-coder/sdk/design'
import { useEffectCallback } from '@easy-coder/sdk/helper'
import { useElementContext, useStore, depRemoveEditor, depRemoveElement, EasyCoderState } from '@easy-coder/sdk/store'
import { i18n } from '@easy-coder/sdk/i18n'

import { TimelineProps } from '..'

interface Props extends Pick<SwitchProps, 'size'> {
  value?: boolean
  disabled?: boolean
  onChange?: (value?: boolean) => any
  title?: string
  isVertical?: boolean
}

export default function UseCustomDotSetter({ onChange, title, value, disabled, isVertical, size }: Props) {
  const { id, insertSlot } = useElementContext<any, TimelineProps>()
  const { state } = useStore()

  const handleChange = useEffectCallback(
    async (checked?: boolean) => {
      const element = state.getValue<EasyCoderState.Element>(['elementMap', id])
      if (!element) {
        console.error(`未找到组件: ${id}`)
        return
      }

      const props: TimelineProps = element.props

      if (props.dataFrom === 'custom') {
        if (props.customData?.length) {
          if (checked) {
            const slots = await insertSlot(
              'customRender',
              new Array(props.customData.length).fill(1).map(() => i18n.translate({ zh: '自定义点插槽', en: 'Custom dot slot' }))
            )

            if (slots.length !== props.customData.length) return

            await state.updateValue(async (old) => {
              const newEditorMap = { ...state.getValue<EasyCoderState.Desc>().editorMap }
              const newElementMap = { ...state.getValue<EasyCoderState.Desc>().elementMap }

              element.props = {
                ...props,
                customData: props.customData.map((item, index) => ({ ...item, dotSlotId: slots[index].slotId })),
              }

              old.editorMap = newEditorMap
              old.elementMap = newElementMap
            })
          } else {
            await state.updateValue(async (old) => {
              const newEditorMap = { ...state.getValue<EasyCoderState.Desc>().editorMap }
              const newElementMap = { ...state.getValue<EasyCoderState.Desc>().elementMap }

              const slotIds = props.customData.map((item) => item.dotSlotId)
              slotIds.forEach((slotId) => {
                depRemoveEditor(newEditorMap, newElementMap, slotId)
              })

              element.slotMap.customRender = element.slotMap.customRender.filter((id) => !slotIds.includes(id))
              element.props = {
                ...props,
                customData: props.customData.map((item) => ({ ...item, dotSlotId: undefined })),
              }

              old.editorMap = newEditorMap
              old.elementMap = newElementMap
            })
          }
        }
      } else {
        if (!checked) {
          await state.updateValue(async (old) => {
            const newEditorMap = { ...state.getValue<EasyCoderState.Desc>().editorMap }
            const newElementMap = { ...state.getValue<EasyCoderState.Desc>().elementMap }

            if (element.slotMap?.customDotRender?.length) {
              element.slotMap.customDotRender.forEach((slotId) => {
                const editor = newEditorMap[slotId]
                if (!editor) return

                editor.elements.forEach((eleId) => {
                  depRemoveElement(newEditorMap, newElementMap, eleId)
                })
                editor.elements = []
              })
            }

            old.editorMap = newEditorMap
            old.elementMap = newElementMap
          })
        }
      }

      onChange?.(checked)
    },
    [onChange, id]
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
