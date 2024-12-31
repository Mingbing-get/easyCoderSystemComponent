import { useEffect, useMemo, useRef, useState } from 'react'
import classNames from 'classnames'
import { Slider as SliderBase, SliderProps as SliderBaseProps } from '@arco-design/web-react'
import { useEffectCallback } from '@easy-coder/sdk/helper'
import { EasyCoderElement, useElementContext } from '@easy-coder/sdk/store'

import '@arco-design/web-react/es/Slider/style/index.css'
import './index.scss'

export interface SliderProps
  extends EasyCoderElement.DataProps,
    Pick<SliderBaseProps, 'style' | 'tooltipPosition' | 'disabled' | 'min' | 'max' | 'step' | 'showTicks' | 'showInput' | 'onChange'> {
  direction?: 'vertical' | 'horizontal'
  tooltipVisible?: 'whenHover' | 'none' | 'until'
  className?: string
  defaultValue?: number
}

export interface SliderExport {
  value?: number
  isDisabled?: boolean
  setValue?: (value?: number) => void
  setDisabled?: (disabled?: boolean) => void
}

export default function Slider({ className, defaultValue, direction, disabled, onChange, tooltipVisible, ...extra }: SliderProps) {
  const [_value, setValue] = useState(defaultValue)
  const [_disabled, setDisabled] = useState(disabled)
  const isChangeBySelf = useRef(false)

  const { exportAttr, exportEvent } = useElementContext<SliderExport, SliderProps>()

  const handleChangeValue = useEffectCallback(
    (v?: any) => {
      isChangeBySelf.current = true
      setValue(v)
      onChange?.(v)
    },
    [onChange]
  )

  useEffect(() => {
    setDisabled(disabled)
  }, [disabled])

  useEffect(() => {
    if (isChangeBySelf.current) return

    setValue(defaultValue)
  }, [defaultValue])

  useEffect(() => {
    exportAttr('isDisabled', _disabled)
  }, [_disabled])

  useEffect(() => {
    exportAttr('value', _value)
  }, [_value])

  useEffect(() => {
    exportEvent({
      setValue: handleChangeValue,
      setDisabled,
    })

    return () => exportEvent({})
  }, [])

  const mergeProps = useMemo(() => {
    if (tooltipVisible === 'none') {
      return {
        tooltipVisible: false,
      }
    }

    if (tooltipVisible === 'until') {
      return {
        tooltipVisible: true,
      }
    }

    return {}
  }, [tooltipVisible])

  return (
    <SliderBase
      {...extra}
      {...mergeProps}
      className={classNames('easy-coder-slider', className)}
      marks={{
        [extra.min]: extra.min,
        [extra.max]: extra.max,
      }}
      vertical={direction === 'vertical'}
      value={_value}
      disabled={_disabled}
      onChange={handleChangeValue}
    />
  )
}
