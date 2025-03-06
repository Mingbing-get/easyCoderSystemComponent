import classNames from 'classnames'
import { ModalConfig } from '@easy-coder/sdk/design'
import { EasyCoderElement } from '@easy-coder/sdk/store'
import { Multilingual, i18n } from '@easy-coder/sdk/i18n'

import RenderWhenCustom from './render/renderWhenCustom'
import RenderWhenModal from './render/renderWhenModal'
import RenderWhenVariable from './render/renderWhenVariable'

import './index.scss'

export interface CustomCollapseItem {
  id: string
  label: Multilingual
  headerSlotId: string
  extraSlotId: string
  contentSlotId: string
}

export type CustomCollapseItemRender = (payload: Pick<CustomCollapseItem, 'id' | 'label'>) => React.ReactNode

export interface CollapseProps extends EasyCoderElement.DataProps {
  className?: string
  style?: React.CSSProperties
  itemClassName?: string
  itemStyle?: React.CSSProperties
  contentStyle?: React.CSSProperties

  bordered?: boolean
  triggerRegion?: 'header' | 'icon'

  dataFrom?: 'modal' | 'variable' | 'custom'
  modalConfig?: ModalConfig
  fetchCount?: number

  variableValue?: any[]
  extraRender?: (payload: { item?: any }) => React.ReactNode
  headerRender?: (payload: { item?: any }) => React.ReactNode
  contentRender?: (payload: { item?: any }) => React.ReactNode

  customData?: CustomCollapseItem[]
  customRender?: Record<string, CustomCollapseItemRender>
}

export default function Collapse({ dataFrom, className, ...extra }: CollapseProps) {
  if (dataFrom === 'custom') {
    return (
      <RenderWhenCustom
        {...extra}
        className={classNames('easy-coder-collapse', className)}
      />
    )
  }

  if (dataFrom === 'variable') {
    return (
      <RenderWhenVariable
        {...extra}
        className={classNames('easy-coder-collapse', className)}
      />
    )
  }

  if (dataFrom === 'modal') {
    return (
      <RenderWhenModal
        {...extra}
        className={classNames('easy-coder-collapse', className)}
      />
    )
  }

  const dataProps: EasyCoderElement.DataProps = {}
  for (const key in extra) {
    if (key.startsWith('data-')) {
      dataProps[key] = extra[key]
    }
  }

  return <span {...dataProps}>{i18n.translate({ zh: '配置错误', en: 'Config Error' })}</span>
}
