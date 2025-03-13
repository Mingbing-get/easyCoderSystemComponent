import { useCallback, useEffect, useRef, useState } from 'react'
import classnames from 'classnames'
import { Modal } from '@arco-design/web-react'
import { EasyCoderElement, useElementContext, useGetModalContainer, useEventBus } from '@easy-coder/sdk/store'
import { useEffectCallback } from '@easy-coder/sdk/helper'
import { i18n, Multilingual } from '@easy-coder/sdk/i18n'

import useInitOpenModal from './useInitOpenModal'

import './index.scss'

export interface ButtonProps extends EasyCoderElement.DataProps {
  style?: React.CSSProperties
  className?: string
  disabled?: boolean
  loading?: boolean
  needConfirm?: boolean
  confirmTitle?: string | Multilingual
  confirmDescription?: () => React.ReactNode

  onClick?: () => Promise<void>
  children?: () => React.ReactNode
}

interface ButtonExport {
  disabled?: boolean
  loading?: boolean
  setDisabled?: (disabled?: boolean) => void
  setLoading?: (loading?: boolean) => void
}

export default function Button({ disabled, loading, needConfirm, confirmTitle, confirmDescription, children, className, onClick, ...extra }: ButtonProps) {
  const { exportAttr, exportEvent } = useElementContext<ButtonExport>()
  const [_disabled, setDisabled] = useState(disabled)
  const [_loading, setLoading] = useState(loading)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [modal, modalHandle] = Modal.useModal()
  const getModalContainer = useGetModalContainer()
  const eventBus = useEventBus()

  useInitOpenModal(() => {
    modal.confirm({
      getPopupContainer: getModalContainer,
      getChildrenPopupContainer: () => document.body,
      title: i18n.translate(confirmTitle),
      content: confirmDescription?.(),
      onOk: async () => {
        handleCancelActive()
        await onClick?.()
      },
      onCancel: handleCancelActive,
      icon: null,
      closable: true,
    })
  })

  const handleCancelActive = useCallback(() => {
    eventBus.triggerListener('changeArea', {})
  }, [])

  const handleClick = useEffectCallback(
    (e: React.MouseEvent) => {
      if (_disabled || _loading || !buttonRef.current?.contains(e.target as HTMLElement)) return

      if (needConfirm) {
        handleCancelActive()
        modal.confirm({
          getPopupContainer: getModalContainer,
          getChildrenPopupContainer: () => document.body,
          title: i18n.translate(confirmTitle),
          content: confirmDescription?.(),
          onOk: async () => {
            handleCancelActive()
            await onClick?.()
          },
          onCancel: handleCancelActive,
          icon: null,
          closable: true,
        })
      } else {
        onClick?.()
      }
    },
    [onClick, _disabled, _loading, needConfirm, confirmTitle, confirmDescription]
  )

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
      ref={buttonRef}
      className={classnames('easy-coder-system-button', _disabled && 'is-disabled', _loading && 'is-loading', className)}
      onClick={handleClick}
      {...extra}>
      {children?.()}
      {modalHandle}
    </button>
  )
}
