import classNames from 'classnames'
import { ModalConfig } from '@easy-coder/sdk/design'
import { EasyCoderElement } from '@easy-coder/sdk/store'

import RenderWhenCustom from './render/renderWhenCustom'
import RenderWhenVariable from './render/renderWhenVariable'
import RenderWhenModal from './render/renderWhenModal'

import '@arco-design/web-react/es/Timeline/style/index.css'
import './index.scss'

export interface CustomTimelineItem {
  id: string
  label: string
  contentSlotId: string
  dotSlotId?: string
  dotType?: 'hollow' | 'solid'
  lineType?: 'solid' | 'dashed' | 'dotted'
}

export type CustomTimelineItemRender = (payload: Pick<CustomTimelineItem, 'id' | 'label'>) => React.ReactNode

export interface TimelineProps extends EasyCoderElement.DataProps {
  className?: string
  style?: React.CSSProperties
  itemClassName?: string
  itemStyle?: React.CSSProperties

  direction?: 'horizontal' | 'vertical'
  mode?: 'left' | 'right' | 'top' | 'bottom' | 'alternate'

  dotType?: 'hollow' | 'solid'
  lineType?: 'solid' | 'dashed' | 'dotted'

  usePending?: boolean
  pendingRender?: () => React.ReactNode
  pendingDotRender?: () => React.ReactNode

  useCustomDot?: boolean
  customDotRender?: (payload: { item: any }) => React.ReactNode
  contentRender?: (payload: { item: any }) => React.ReactNode

  dataFrom?: 'modal' | 'variable' | 'custom'
  modalConfig?: ModalConfig
  fetchCount?: number

  variableValue?: any[]
  customData?: CustomTimelineItem[]
  customRender?: Record<string, CustomTimelineItemRender>
}

export default function Timeline({ dataFrom, className, ...extra }: TimelineProps) {
  if (dataFrom === 'custom') {
    return (
      <RenderWhenCustom
        {...extra}
        className={classNames('easy-coder-system-timeline', className)}
      />
    )
  }

  if (dataFrom === 'variable') {
    return (
      <RenderWhenVariable
        {...extra}
        className={classNames('easy-coder-system-timeline', className)}
      />
    )
  }

  if (dataFrom === 'modal') {
    return (
      <RenderWhenModal
        {...extra}
        className={classNames('easy-coder-system-timeline', className)}
      />
    )
  }

  const dataProps: EasyCoderElement.DataProps = {}
  for (const key in extra) {
    if (key.startsWith('data-')) {
      dataProps[key] = extra[key]
    }
  }

  return <span {...dataProps}>配置错误</span>
}
