import { useEffect, useRef, useState } from 'react'
import { Pagination as PaginationUi, PaginationProps as PaginationUiProps } from '@arco-design/web-react'
import { EasyCoderElement, useElementContext } from '@easy-coder/sdk/store'
import { useEffectCallback } from '@easy-coder/sdk/helper'

export interface PaginationProps extends EasyCoderElement.DataProps, PaginationUiProps {}

export interface PaginationExport {
  total?: number
  current?: number
  pageSize?: number
  setPageSize?: (pageSize: number) => void
  setCurrent?: (current: number) => void
  setTotal?: (total: number) => void
}

export default function Pagination({ total, defaultCurrent, defaultPageSize, onChange, onPageSizeChange, ...extra }: PaginationProps) {
  const [_total, setTotal] = useState<number>()
  const [_current, setCurrent] = useState<number>()
  const [_pageSize, setPageSize] = useState<number>()
  const changeFlag = useRef({ total: false, current: false, pageSize: false })
  const { exportAttr, exportEvent } = useElementContext<PaginationExport>()

  const handleChange = useEffectCallback(
    (pageNumber: number, pageSize: number) => {
      setCurrent(pageNumber)
      setPageSize(pageSize)
      changeFlag.current.current = true
      onChange?.(pageNumber, pageSize)
    },
    [onChange]
  )

  const handleChangePageSize = useEffectCallback(
    (size: number, current: number) => {
      setCurrent(current)
      setPageSize(size)
      changeFlag.current.pageSize = true
      onPageSizeChange?.(size, current)
    },
    [onPageSizeChange]
  )

  const handleSetCurrent = useEffectCallback(
    (current?: number) => {
      if (!current || current < 0) return

      setCurrent(current)
      changeFlag.current.current = true
      onChange?.(current, _pageSize || 10)
    },
    [_pageSize, onChange]
  )

  const handleSetPageSize = useEffectCallback(
    (pageSize?: number) => {
      if (!pageSize || pageSize < 0) return

      setPageSize(pageSize)
      changeFlag.current.pageSize = true
      onPageSizeChange?.(pageSize, _current || 1)
    },
    [_current, onPageSizeChange]
  )

  const handleSetTotal = useEffectCallback((total?: number) => {
    if (total === undefined || total < 0) return

    setTotal(total)
    changeFlag.current.total = true
  }, [])

  useEffect(() => {
    if (changeFlag.current.total || total === undefined || total < 0) return

    setTotal(total)
  }, [total])

  useEffect(() => {
    if (changeFlag.current.current || !defaultCurrent || defaultCurrent < 0) return

    setCurrent(defaultCurrent)
  }, [defaultCurrent])

  useEffect(() => {
    if (changeFlag.current.pageSize || !defaultPageSize || defaultPageSize < 0) return

    setPageSize(defaultPageSize)
  }, [defaultPageSize])

  useEffect(() => {
    exportAttr('current', _current)
  }, [_current])

  useEffect(() => {
    exportAttr('pageSize', _pageSize)
  }, [_pageSize])

  useEffect(() => {
    exportAttr('total', _total)
  }, [_total])

  useEffect(() => {
    exportEvent({
      setCurrent: handleSetCurrent,
      setPageSize: handleSetPageSize,
      setTotal: handleSetTotal,
    })

    return () => exportEvent({})
  }, [])

  return (
    <PaginationUi
      {...extra}
      total={total}
      current={_current}
      pageSize={_pageSize}
      onChange={handleChange}
      onPageSizeChange={handleChangePageSize}
    />
  )
}
