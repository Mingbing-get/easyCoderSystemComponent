import { useMemo } from 'react'
import { EasyCoderElement } from '@easy-coder/sdk/store'
import classNames from 'classnames'

import BaseMenu from './base'
import useMenuSelected, { findCustomMenuById } from './hooks/useMenuSelected'
import { MenuData } from './base/type'

import './index.scss'

export interface CustomMenu {
  id: string
  labelSlotId: string
  contentSlotId: string
  label?: string
  children?: CustomMenu[]
}

type CustomRender = (payload: Pick<CustomMenu, 'label' | 'id'>) => React.ReactNode

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
  customData?: CustomMenu[]
  customRender?: Record<string, CustomRender>
  extraRender?: () => React.ReactNode
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
  customData,
  customRender,
  extraRender,
  ...extra
}: MenuProps) {
  const data = useMemo(() => {
    return customMenuToMenuData(customData, customRender)
  }, [customData, customRender])

  const { selectedKey, openKeys, onClickMenuItem } = useMenuSelected(customData)

  const selectKeys = useMemo(() => [selectedKey], [selectedKey])

  const activeItemWithContentRender = useMemo(() => {
    if (!selectedKey) return

    const item = findCustomMenuById(customData, selectedKey)
    if (!item) return

    return {
      activeItem: item,
      contentRender: customRender?.[item.contentSlotId],
    }
  }, [customRender, customData, selectedKey])

  return (
    <div
      className={classNames('easy-coder-menu', `mode-${mode}`, className)}
      {...extra}>
      <BaseMenu
        style={menuStyle}
        className={menuClassName}
        triggerProps={{ showArrow: false }}
        data={data}
        mode={mode}
        theme={theme}
        defaultWidth={defaultWidth}
        canResize={canResizeMenu}
        openKeys={openKeys}
        selectedKeys={selectKeys}
        onClickMenuItem={onClickMenuItem}
        extraRender={extraRender?.()}
      />
      <div
        className={classNames('easy-coder-menu-content', contentClassName)}
        style={contentStyle}>
        {activeItemWithContentRender &&
          activeItemWithContentRender?.contentRender?.({ label: activeItemWithContentRender.activeItem.label, id: activeItemWithContentRender.activeItem.id })}
      </div>
    </div>
  )
}

function customMenuToMenuData(customMenu?: CustomMenu[], customRender?: Record<string, CustomRender>): MenuData[] | undefined {
  return customMenu?.map((item) => ({
    label: customRender?.[item.labelSlotId]?.({ label: item.label, id: item.id }),
    id: item.id,
    subMenus: customMenuToMenuData(item.children, customRender),
  }))
}
