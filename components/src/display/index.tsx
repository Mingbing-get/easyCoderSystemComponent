import classNames from 'classnames'
import { TagProps } from '@arco-design/web-react'

import { LookupInRecord } from '@easy-coder/sdk/data'
import { ModalConfig } from '@easy-coder/sdk/design'
import { EasyCoderElement } from '@easy-coder/sdk/store'
import { VariableDefine } from '@easy-coder/sdk/variable'
import { Multilingual, i18n } from '@easy-coder/sdk/i18n'

import DisplayVariable from './main'

import './index.scss'

export interface DisplayProps extends EasyCoderElement.DataProps {
  type: Exclude<VariableDefine.Desc['type'], 'object' | 'array' | 'json'>
  enumGroupName?: string
  modalName?: ModalConfig

  style?: React.CSSProperties
  className?: string
  labelStyle?: React.CSSProperties
  labelClassName?: string
  valueStyle?: React.CSSProperties
  valueClassName?: string

  label?: string | Multilingual
  direction?: 'row' | 'column'
  tagSize?: TagProps['size']
  value?: number | string | LookupInRecord | Multilingual | string[] | LookupInRecord[]
  onClick?: (value: number | string | Multilingual | LookupInRecord) => void
}

export default function Display({
  type,
  enumGroupName,
  modalName,

  style,
  className,
  labelStyle,
  labelClassName,
  valueStyle,
  valueClassName,

  label,
  direction = 'row',
  tagSize = 'default',

  value,
  onClick,
  ...extra
}: DisplayProps) {
  return (
    <div
      className={classNames('easy-coder-display', `direction-${direction}`, className)}
      style={style}
      {...extra}>
      {label && (
        <label
          className={classNames('easy-coder-display-label', labelClassName)}
          style={labelStyle}>
          {i18n.translate(label)}
        </label>
      )}
      <div className="easy-coder-display-inner">
        <DisplayVariable
          value={value}
          type={type}
          enumGroupName={enumGroupName}
          modalName={modalName?.name}
          tagSize={tagSize}
          onClick={onClick}
          style={valueStyle}
          className={valueClassName}
        />
      </div>
    </div>
  )
}
