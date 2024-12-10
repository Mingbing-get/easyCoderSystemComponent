import classNames from 'classnames'
import { EasyCoderElement, useElementContext } from '@easy-coder/sdk/store'
import { ModalConfig } from '@easy-coder/sdk/design'

import RenderWhenCustom, { CustomRender } from './render/renderWhenCustom'
import RenderWhenModel from './render/renderWhenModel'
import RenderWhenVariable from './render/renderWhenVariable'

import './index.scss'
import { useEffectCallback } from '@easy-coder/sdk/helper'

export interface CustomMenu {
  id: string
  labelSlotId: string
  contentSlotId: string
  label?: string
  children?: CustomMenu[]
}

interface MenuExport {
  activeItem?: Record<string, any>
}

export interface MenuProps extends EasyCoderElement.DataProps {
  className?: string
  style?: React.CSSProperties
  menuClassName?: string
  menuStyle?: React.CSSProperties
  contentClassName?: string
  contentStyle?: React.CSSProperties

  mode?: 'vertical' | 'horizontal'
  theme?: 'light' | 'dark'
  defaultWidth?: number
  canResizeMenu?: boolean

  dataFrom?: 'modal' | 'variable' | 'custom'

  modalConfig?: ModalConfig
  parentFieldName?: string

  variableValue?: Record<string, any>[]
  childKeyName?: string
  idKeyName?: string

  labelRender?: (payload: { item?: Record<string, any> }) => React.ReactNode
  contentRender?: (payload: { item?: Record<string, any> }) => React.ReactNode

  customData?: CustomMenu[]
  customRender?: Record<string, CustomRender>
  extraRender?: () => React.ReactNode

  onActiveChange?: (item?: Record<string, any>) => void
}

export default function Menu({
  menuClassName,
  menuStyle,
  contentClassName,
  contentStyle,
  className,

  mode = 'vertical',
  theme = 'light',
  defaultWidth,
  canResizeMenu,

  dataFrom,

  modalConfig,
  parentFieldName,

  variableValue,
  childKeyName,
  idKeyName,

  labelRender,
  contentRender,

  customData,
  customRender,
  extraRender,

  onActiveChange,
  ...extra
}: MenuProps) {
  const { exportAttr } = useElementContext<MenuExport>()

  const handleChangeActive = useEffectCallback(
    (item?: Record<string, any>) => {
      exportAttr('activeItem', item)
      onActiveChange?.(item)
    },
    [onActiveChange]
  )

  return (
    <div
      className={classNames('easy-coder-menu', `mode-${mode}`, className)}
      {...extra}>
      {dataFrom === 'custom' && (
        <RenderWhenCustom
          menuClassName={menuClassName}
          menuStyle={menuStyle}
          contentClassName={contentClassName}
          contentStyle={contentStyle}
          canResizeMenu={canResizeMenu}
          mode={mode}
          theme={theme}
          defaultWidth={defaultWidth}
          extraRender={extraRender}
          customData={customData}
          customRender={customRender}
          onActiveChange={handleChangeActive}
        />
      )}
      {dataFrom === 'modal' && (
        <RenderWhenModel
          menuClassName={menuClassName}
          menuStyle={menuStyle}
          contentClassName={contentClassName}
          contentStyle={contentStyle}
          canResizeMenu={canResizeMenu}
          mode={mode}
          theme={theme}
          defaultWidth={defaultWidth}
          extraRender={extraRender}
          labelRender={labelRender}
          contentRender={contentRender}
          modalConfig={modalConfig}
          parentFieldName={parentFieldName}
          onActiveChange={handleChangeActive}
        />
      )}
      {dataFrom === 'variable' && (
        <RenderWhenVariable
          menuClassName={menuClassName}
          menuStyle={menuStyle}
          contentClassName={contentClassName}
          contentStyle={contentStyle}
          canResizeMenu={canResizeMenu}
          mode={mode}
          theme={theme}
          defaultWidth={defaultWidth}
          extraRender={extraRender}
          labelRender={labelRender}
          contentRender={contentRender}
          variableValue={variableValue}
          childKeyName={childKeyName}
          idKeyName={idKeyName}
          onActiveChange={handleChangeActive}
        />
      )}
    </div>
  )
}
