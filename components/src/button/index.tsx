import { useEffect, useState } from 'react'
import { EasyCoderElement, useElementContext } from '@easy-coder/sdk/store'
import { useEffectCallback } from '@easy-coder/sdk/helper'
import classnames from 'classnames'

import './index.scss'

export interface ButtonProps extends EasyCoderElement.DataProps {
  style?: React.CSSProperties
  className?: string
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  children?: () => React.ReactNode
}

interface ButtonExport {
  disabled?: boolean
  loading?: boolean
  setDisabled?: (disabled?: boolean) => void
  setLoading?: (loading?: boolean) => void
}

export default function Button({ disabled, loading, children, className, onClick, ...extra }: ButtonProps) {
  const { exportAttr, exportEvent } = useElementContext<ButtonExport>()
  const [_disabled, setDisabled] = useState(disabled)
  const [_loading, setLoading] = useState(loading)

  const handleClick = useEffectCallback(() => {
    if (_disabled || _loading) return

    onClick?.()
  }, [onClick, _disabled, _loading])

  useEffect(() => {
    setDisabled(disabled)
  }, [disabled])

  useEffect(() => {
    setLoading(loading)
  }, [loading])

  useEffect(() => {
    exportAttr('disabled', _disabled)
  }, [_disabled])

  useEffect(() => {
    exportAttr('loading', _loading)
  }, [_loading])

  useEffect(() => {
    exportEvent({
      setDisabled,
      setLoading,
    })

    return () => exportEvent({})
  }, [])

  return (
    <button
      className={classnames('easy-coder-system-button', disabled && 'is-disabled', loading && 'is-loading', className)}
      onClick={handleClick}
      {...extra}>
      {children?.()}
    </button>
  )
}
