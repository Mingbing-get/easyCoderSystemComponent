import { useEffect, useMemo, useState } from 'react'
import classNames from 'classnames'
import { TagProps, Tag } from '@arco-design/web-react'
import { IconFile } from '@arco-design/web-react/icon'

import { FileInRecord, LookupInRecord, WithEnumsGroup, useDataCenter } from '@easy-coder/sdk/data'
import { VariableDefine } from '@easy-coder/sdk/variable'
import { i18n } from '@easy-coder/sdk/i18n'

import './index.scss'

interface Props {
  style?: React.CSSProperties
  className?: string
  value?: any
  type: Exclude<VariableDefine.Desc['type'], 'object' | 'array' | 'json'>
  enumGroupName?: string
  modalName?: string
  tagSize?: TagProps['size']
  onClick?: (value: any) => void
}

type CommonPropsKey = 'value' | 'style' | 'className' | 'onClick'

export default function DisplayVariable({ type, enumGroupName, modalName, tagSize, ...common }: Props) {
  if (common.value === null || common.value === undefined) return '-'

  if (['float', 'number', 'string', 'text'].includes(type)) {
    return <DisplayStringOrNumber {...common} />
  }

  if (type === 'multilingual') {
    return <DisplayMultilingual {...common} />
  }

  if (type === 'boolean') {
    return (
      <DisplayBoolean
        tagSize={tagSize}
        {...common}
      />
    )
  }

  if (type === 'date' || type === 'datetime') {
    return (
      <DisplayDatetime
        hiddenLtDay={type === 'date'}
        {...common}
      />
    )
  }

  if (type === 'enum') {
    return (
      <DisplayEnum
        enumGroupName={enumGroupName}
        tagSize={tagSize}
        {...common}
      />
    )
  }

  if (type === 'multipleEnum') {
    return (
      <DisplayMultipleEnum
        enumGroupName={enumGroupName}
        tagSize={tagSize}
        {...common}
      />
    )
  }

  if (type === 'lookup') {
    return (
      <DisplayLookup
        modalName={modalName}
        tagSize={tagSize}
        {...common}
      />
    )
  }

  if (type === 'multipleLookup') {
    return (
      <DisplayMultipleLookup
        modalName={modalName}
        tagSize={tagSize}
        {...common}
      />
    )
  }

  if (type === 'file') {
    return <DisplayFile {...common} />
  }
}

function DisplayStringOrNumber({ value, onClick, style, className }: Pick<Props, CommonPropsKey>) {
  if (typeof value !== 'string' && typeof value !== 'number') return '-'

  return (
    <span
      style={style}
      className={classNames('easy-coder-display-text', className)}
      onClick={() => onClick?.(value)}>
      {value}
    </span>
  )
}

function DisplayMultilingual({ value, onClick, style, className }: Pick<Props, CommonPropsKey>) {
  if (typeof value !== 'string' && !isObject(value)) return '-'

  return (
    <span
      style={style}
      className={classNames('easy-coder-display-text', className)}
      onClick={() => onClick?.(value)}>
      {i18n.translate(value)}
    </span>
  )
}

function DisplayBoolean({ value, tagSize, onClick, style, className }: Pick<Props, 'tagSize' | CommonPropsKey>) {
  const transformValue = useMemo(() => !!value, [value])

  return (
    <Tag
      size={tagSize}
      style={style}
      className={classNames(`easy-coder-display-tag-${transformValue}`, className)}
      onClick={() => onClick?.(transformValue)}>{`${transformValue}`}</Tag>
  )
}

function DisplayDatetime({ value, hiddenLtDay, onClick, style, className }: Pick<Props, CommonPropsKey> & { hiddenLtDay?: boolean }) {
  const date = useMemo(() => {
    const date = new Date(value)
    if (date.toString() === 'Invalid Date') return

    const dateStr = `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, '0')}-${`${date.getDate()}`.padStart(2, '0')}`

    if (hiddenLtDay) {
      return dateStr
    }
    return `${dateStr} ${`${date.getHours()}`.padStart(2, '0')}:${`${date.getMinutes()}`.padStart(2, '0')}:${`${date.getSeconds()}`.padStart(2, '0')}`
  }, [value, hiddenLtDay])

  if (!date) return '-'

  return (
    <span
      style={style}
      className={classNames('easy-coder-display-text', className)}
      onClick={() => onClick?.(value)}>
      {date}
    </span>
  )
}

function DisplayEnum({
  value,
  enumGroupName,
  tagSize,
  hiddenWhenEmpty,
  onClick,
  style,
  className,
}: Pick<Props, 'enumGroupName' | 'tagSize' | CommonPropsKey> & { hiddenWhenEmpty?: boolean }) {
  const [enumGroup, setEnumGroup] = useState<WithEnumsGroup>()
  const dataCenter = useDataCenter()

  useEffect(() => {
    if (!enumGroupName) {
      setEnumGroup(undefined)
    } else {
      dataCenter.enumGroupList().then((groups) => {
        setEnumGroup(groups.find((group) => group.name === enumGroupName))
      })
    }
  }, [enumGroupName])

  const currentEnum = useMemo(() => {
    return enumGroup?.enums?.find((item) => item.name === value)
  }, [enumGroup, value])

  if (!currentEnum) {
    if (hiddenWhenEmpty) return null

    return '-'
  }

  return (
    <Tag
      style={style}
      size={tagSize}
      className={classNames('easy-coder-display-enum', className)}
      onClick={() => onClick?.(value)}>
      {i18n.translateFillEmpty(currentEnum.label)}
    </Tag>
  )
}

function DisplayMultipleEnum({ value, enumGroupName, tagSize, onClick, style, className }: Pick<Props, 'enumGroupName' | 'tagSize' | CommonPropsKey>) {
  if (!(value instanceof Array) || !value.length) return '-'

  return (
    <div className="easy-coder-tag-group">
      {value.map((item, index) => (
        <DisplayEnum
          key={index}
          value={item}
          enumGroupName={enumGroupName}
          tagSize={tagSize}
          onClick={onClick}
          hiddenWhenEmpty
          style={style}
          className={className}
        />
      ))}
    </div>
  )
}

function DisplayLookup({
  value,
  modalName,
  tagSize,
  hiddenWhenEmpty,
  onClick,
  style,
  className,
}: Pick<Props, 'modalName' | 'tagSize' | CommonPropsKey> & { hiddenWhenEmpty?: boolean }) {
  if (!isLookup(value)) {
    if (hiddenWhenEmpty) return null

    return '-'
  }

  return (
    <Tag
      size={tagSize}
      style={style}
      className={classNames('easy-coder-display-lookup', className)}
      onClick={() => onClick?.(value)}>
      {i18n.translateFillEmpty(value._display)}
    </Tag>
  )
}

function DisplayMultipleLookup({ value, modalName, tagSize, onClick, style, className }: Pick<Props, 'modalName' | 'tagSize' | CommonPropsKey>) {
  if (!(value instanceof Array) || !value.length) return '-'

  return (
    <div className="easy-coder-tag-group">
      {value.map((item, index) => (
        <DisplayLookup
          key={index}
          value={item}
          modalName={modalName}
          tagSize={tagSize}
          onClick={onClick}
          hiddenWhenEmpty
          style={style}
          className={className}
        />
      ))}
    </div>
  )
}

function DisplayFile({ value, onClick, style, className }: Pick<Props, CommonPropsKey>) {
  const dataCenter = useDataCenter()

  if (!(value instanceof Array) || !value.length) return '-'

  return (
    <div className="easy-coder-file-group">
      {value.map((item) => {
        if (!isFile(item)) return null

        if (isImg(item.type)) {
          return (
            <img
              style={style}
              className={className}
              onClick={() => onClick(item)}
              src={dataCenter.getFilePath(item.token)}
            />
          )
        }

        return (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <IconFile
              onClick={() => onClick(item)}
              style={{ fontSize: 40, ...style }}
              className={className}
            />
          </div>
        )
      })}
    </div>
  )
}

function isObject(v: any): v is Record<string, any> {
  return Object.prototype.toString.call(v) === '[object Object]'
}

function isLookup(v: any): v is LookupInRecord {
  if (!v) return false

  if (typeof v !== 'object') return false

  if (v._id === undefined || v._display === undefined) return false

  return true
}

function isFile(v: any): v is FileInRecord {
  if (!v) return false

  if (typeof v !== 'object') return false

  if (v.token === undefined) return false

  return true
}

function isImg(type: string) {
  return [
    'bmp',
    'jpg',
    'jpeg',
    'png',
    'tif',
    'gif',
    'pcx',
    'tga',
    'exif',
    'fpx',
    'svg',
    'psd',
    'cdr',
    'pcd',
    'dxf',
    'ufo',
    'eps',
    'ai',
    'raw',
    'wmf',
    'webp',
    'avif',
    'apng',
  ].includes(type.toLocaleLowerCase())
}
