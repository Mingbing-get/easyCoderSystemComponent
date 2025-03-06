import { useEffect, useState } from 'react'
import classNames from 'classnames'
import { ModalConfig } from '@easy-coder/sdk/design'
import { EasyCoderElement, useElementContext } from '@easy-coder/sdk/store'
import { useEffectCallback } from '@easy-coder/sdk/helper'
import { Multilingual, i18n } from '@easy-coder/sdk/i18n'

import RenderWhenCustom from './render/renderWhenCustom'
import RenderWhenVariable from './render/renderWhenVariable'
import RenderWhenModal from './render/renderWhenModal'

import './index.scss'

export interface CustomTabItem {
  id: string
  label: Multilingual
  titleSlotId: string
  contentSlotId: string
}

export type CustomTabItemRender = (payload: Pick<CustomTabItem, 'id' | 'label'>) => React.ReactNode

export interface TabsProps extends EasyCoderElement.DataProps {
  className?: string
  style?: React.CSSProperties
  panelClassName?: string
  panelStyle?: React.CSSProperties
  direction?: 'horizontal' | 'vertical'
  overflow?: 'scroll' | 'dropdown'
  scrollPosition?: 'start' | 'end' | 'center' | 'auto'
  size?: 'mini' | 'small' | 'default' | 'large'
  tabPosition?: 'left' | 'right' | 'top' | 'bottom'
  type?: 'line' | 'card' | 'card-gutter' | 'text' | 'rounded' | 'capsule'

  extraRender?: () => React.ReactNode

  dataFrom?: 'modal' | 'variable' | 'custom'
  modalConfig?: ModalConfig
  fetchCount?: number

  variableValue?: any[]
  titleRender?: (payload: { item: any }) => React.ReactNode
  contentRender?: (payload: { item: any }) => React.ReactNode

  customData?: CustomTabItem[]
  customRender?: Record<string, CustomTabItemRender>
  onChange?: (item?: any) => void
}

export interface TabsExport {
  activeItem: any
}

export default function Tabs({ dataFrom, className, onChange, ...extra }: TabsProps) {
  const { exportAttr } = useElementContext<TabsExport>()
  const [activeItem, setActiveItem] = useState<any>()

  const handleChange = useEffectCallback(
    (item: any) => {
      setActiveItem(item)
      onChange?.(item)
    },
    [onChange]
  )

  useEffect(() => {
    exportAttr('activeItem', activeItem)
  }, [activeItem])

  if (dataFrom === 'custom') {
    return (
      <RenderWhenCustom
        {...extra}
        onChange={handleChange}
        className={classNames('easy-coder-system-tabs', className)}
      />
    )
  }

  if (dataFrom === 'variable') {
    return (
      <RenderWhenVariable
        {...extra}
        onChange={handleChange}
        className={classNames('easy-coder-system-tabs', className)}
      />
    )
  }

  if (dataFrom === 'modal') {
    return (
      <RenderWhenModal
        {...extra}
        onChange={handleChange}
        className={classNames('easy-coder-system-tabs', className)}
      />
    )
  }

  const dataProps: EasyCoderElement.DataProps = {}
  for (const key in extra) {
    if (key.startsWith('data-')) {
      dataProps[key] = extra[key]
    }
  }

  return <span {...dataProps}>{i18n.translate({ zh: '配置错误', en: 'Config error' })}</span>
}
