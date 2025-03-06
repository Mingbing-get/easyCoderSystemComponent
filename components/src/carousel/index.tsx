import { useMemo } from 'react'
import { CarouselProps as CarouselBaseProps } from '@arco-design/web-react'
import { ModalConfig } from '@easy-coder/sdk/design'
import { EasyCoderElement, useEnv } from '@easy-coder/sdk/store'
import { Multilingual, i18n } from '@easy-coder/sdk/i18n'

import RenderWhenCustom from './render/renderWhenCustom'
import RenderWhenModal from './render/renderWhenModal'
import RenderWhenVariable from './render/renderWhenVariable'

export interface CustomCarouselItem {
  id: string
  slotId: string
  label: Multilingual
}

export type CustomCarouselItemRender = (payload: Pick<CustomCarouselItem, 'id' | 'label'>) => React.ReactNode

export interface CarouselProps
  extends EasyCoderElement.DataProps,
    Pick<CarouselBaseProps, 'moveSpeed' | 'animation' | 'direction' | 'indicatorPosition' | 'indicatorType' | 'showArrow' | 'autoPlay' | 'style'> {
  arrowClassName?: string
  className?: string
  indicatorClassName?: string
  autoPlayInterval?: number

  dataFrom?: 'modal' | 'variable' | 'custom'
  modalConfig?: ModalConfig
  fetchCount?: number

  variableValue?: any[]
  itemRender?: (payload: { item?: any }) => React.ReactNode

  customData?: CustomCarouselItem[]
  customRender?: Record<string, CustomCarouselItemRender>

  onChange?: (item: any) => void
}

export default function Carousel({
  autoPlay,
  autoPlayInterval,
  dataFrom,
  modalConfig,
  fetchCount,
  variableValue,
  itemRender,
  customData,
  customRender,
  ...extra
}: CarouselProps) {
  const { isPreviewing } = useEnv()

  const _autoPlay = useMemo(() => {
    if (isPreviewing || !autoPlay) return false

    return {
      interval: autoPlayInterval || 5000,
      hoverToPause: true,
    }
  }, [isPreviewing, autoPlay, autoPlayInterval])

  if (dataFrom === 'custom') {
    return (
      <RenderWhenCustom
        {...extra}
        autoPlay={_autoPlay}
        customData={customData}
        customRender={customRender}
      />
    )
  }

  if (dataFrom === 'variable') {
    return (
      <RenderWhenVariable
        {...extra}
        autoPlay={_autoPlay}
        variableValue={variableValue}
        itemRender={itemRender}
      />
    )
  }

  if (dataFrom === 'modal') {
    return (
      <RenderWhenModal
        {...extra}
        autoPlay={_autoPlay}
        fetchCount={fetchCount}
        modalConfig={modalConfig}
        itemRender={itemRender}
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
