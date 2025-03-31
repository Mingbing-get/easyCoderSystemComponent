import { useEffect, useLayoutEffect, useState } from 'react'
import { useResize, useDebounceAndThrottle, useEffectCallback } from '@easy-coder/sdk/helper'

interface Options {
  gap: {
    x: number
    y: number
  }
  itemSize: {
    width: number
    height: number
  }
  wrapper: {
    paddingX: number
    paddingY: number
  }
  total: number
}

interface VirtualGridInfo {
  count: number
  start: number
  paddingTop: number
  wrapperHeight: number
}

export default function useVirtualGrid<T extends HTMLElement>({ gap, itemSize, wrapper, total }: Options) {
  const { domRef, width, height } = useResize<T>()
  const [info, setInfo] = useState<VirtualGridInfo>({
    count: 0,
    start: 0,
    paddingTop: 0,
    wrapperHeight: 0,
  })

  const computedDom = useDebounceAndThrottle(
    useEffectCallback(() => {
      if (!domRef.current) return

      if (!total) {
        setInfo({
          count: 0,
          start: 0,
          paddingTop: 0,
          wrapperHeight: 0,
        })
        return
      }

      const factWidth = width - wrapper.paddingX
      const factHeight = height - wrapper.paddingY

      const baseColumnCount = Math.floor(factWidth / (itemSize.width + gap.x))
      const columnCount = factWidth - baseColumnCount * (itemSize.width + gap.x) > itemSize.width ? baseColumnCount + 1 : baseColumnCount
      const rowCount = Math.floor(factHeight / (itemSize.height + gap.y)) + 2
      const totalCount = columnCount * rowCount

      const scrollRows = Math.floor(domRef.current.scrollTop / (itemSize.height + gap.y))
      const scrollCount = scrollRows * columnCount

      setInfo({
        count: Math.min(totalCount, total),
        start: scrollCount,
        paddingTop: scrollRows * (itemSize.height + gap.y),
        wrapperHeight: Math.floor(total / columnCount) * (itemSize.height + gap.y) + itemSize.height,
      })
    }, [width, height, total])
  )

  useEffect(() => {
    computedDom()
  }, [width, height, total])

  useLayoutEffect(() => {
    if (!domRef.current) return

    domRef.current.addEventListener('scroll', computedDom)
    computedDom()

    return () => {
      domRef.current?.removeEventListener('scroll', computedDom)
    }
  }, [domRef.current])

  return { domRef, info }
}
