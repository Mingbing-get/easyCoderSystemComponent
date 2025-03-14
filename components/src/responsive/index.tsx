import { useMemo, useRef, useState, useEffect, useCallback, useLayoutEffect } from 'react'
import { EasyCoderElement, useActiveGlobalStyleVarGroup } from '@easy-coder/sdk/store'
import { StyleDefine, StyleConvert } from '@easy-coder/sdk/style'
import { useDebounceAndThrottle, useEffectCallback } from '@easy-coder/sdk/helper'
import { Multilingual } from '@easy-coder/sdk/i18n'

export interface BreakPoint {
  label?: Multilingual
  max: number
  style?: StyleDefine
}

export interface ResponsiveProps extends EasyCoderElement.DataProps {
  style?: React.CSSProperties
  className?: string

  observeType?: 'screen' | 'box'
  defaultStyle?: StyleDefine
  screenBreakPoints?: BreakPoint[]
  boxBreakPoints?: BreakPoint[]
  children?: (payload: { pointIndex?: number }) => React.ReactElement
}

export default function Responsive({ observeType, defaultStyle, screenBreakPoints, boxBreakPoints, children, ...extra }: ResponsiveProps) {
  const styleVarGroup = useActiveGlobalStyleVarGroup()
  const styleConvert = useRef(new StyleConvert())
  const [effectStyle, setEffectStyle] = useState<StyleDefine>()
  const [pointIndex, setPointIndex] = useState<number>()
  const wrapperRef = useRef<HTMLDivElement>(null)

  const child = useMemo(() => {
    if (!children) return null

    const slotStyle = styleConvert.current.toString(effectStyle, styleVarGroup?.vars) || {}

    const childNode = children({ pointIndex })
    childNode.props = { ...childNode.props, coverStyle: slotStyle }

    return childNode
  }, [children, effectStyle, styleVarGroup, pointIndex])

  const handleComputedPointUseScreen = useEffectCallback(() => {
    if (observeType !== 'screen') return

    const screenWidth = document.documentElement.clientWidth
    let pointIndex: number | undefined
    let minMax = -1
    screenBreakPoints?.forEach((point, index) => {
      if (screenWidth <= point.max && (minMax < 0 || minMax > point.max)) {
        pointIndex = index
        minMax = point.max
      }
    })

    if (pointIndex === undefined) {
      setEffectStyle(defaultStyle)
      setPointIndex(undefined)
    } else {
      setEffectStyle(screenBreakPoints?.[pointIndex]?.style)
      setPointIndex(pointIndex)
    }
  }, [screenBreakPoints, observeType, defaultStyle])

  const handleComputedPointUseBox = useEffectCallback(() => {
    if (observeType !== 'box') return

    const boxWidth = wrapperRef.current ? wrapperRef.current.clientWidth : Infinity

    let pointIndex: number | undefined
    let minMax = -1
    boxBreakPoints?.forEach((point, index) => {
      if (boxWidth <= point.max && (minMax < 0 || minMax > point.max)) {
        pointIndex = index
        minMax = point.max
      }
    })

    if (pointIndex === undefined) {
      setEffectStyle(defaultStyle)
      setPointIndex(undefined)
    } else {
      setEffectStyle(boxBreakPoints?.[pointIndex]?.style)
      setPointIndex(pointIndex)
    }
  }, [boxBreakPoints, observeType, defaultStyle])

  const handleComputedPoint = useDebounceAndThrottle(
    useCallback(() => {
      handleComputedPointUseScreen()
      handleComputedPointUseBox()
    }, []),
    200
  )

  useEffect(() => {
    handleComputedPoint()
  }, [observeType, defaultStyle, screenBreakPoints, boxBreakPoints])

  useEffect(() => {
    if (observeType !== 'screen') return

    window.addEventListener('resize', handleComputedPoint)

    return () => {
      window.removeEventListener('resize', handleComputedPoint)
    }
  }, [observeType])

  useLayoutEffect(() => {
    if (observeType !== 'box' || !wrapperRef.current) return

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target !== wrapperRef.current) {
          continue
        }

        handleComputedPoint()
      }
    })
    observer.observe(wrapperRef.current)

    return () => {
      if (wrapperRef.current) {
        observer.unobserve(wrapperRef.current)
      }
      observer.disconnect()
    }
  }, [observeType, wrapperRef.current])

  return (
    <div
      ref={wrapperRef}
      {...extra}>
      {child}
    </div>
  )
}
