import { useEffect, useMemo } from 'react'
import classNames from 'classnames'

import { CustomMenu, MenuProps } from '..'
import { MenuData } from '../base/type'
import useMenuSelected, { findCustomMenuById } from '../hooks/useMenuSelected'
import BaseMenu from '../base'

export type CustomRender = (payload: Pick<CustomMenu, 'label' | 'id'>) => React.ReactNode

interface Props
  extends Pick<
    MenuProps,
    | 'customData'
    | 'customRender'
    | 'canResizeMenu'
    | 'contentClassName'
    | 'contentStyle'
    | 'defaultWidth'
    | 'extraRender'
    | 'menuClassName'
    | 'menuStyle'
    | 'mode'
    | 'theme'
    | 'onActiveChange'
  > {}

export default function RenderWhenCustom({
  canResizeMenu,
  contentClassName,
  contentStyle,
  customData,
  customRender,
  defaultWidth,
  menuClassName,
  menuStyle,
  theme,
  mode,
  extraRender,
  onActiveChange,
}: Props) {
  const data = useMemo(() => {
    return customMenuToMenuData(customData, customRender)
  }, [customData, customRender])

  const { selectedKey, openKeys, onClickMenuItem } = useMenuSelected(customData)

  const selectKeys = useMemo(() => [selectedKey], [selectedKey])

  const { activeItem, contentRender } = useMemo(() => {
    if (!selectedKey) return {}

    const item = findCustomMenuById(customData, selectedKey)
    if (!item) return {}

    return {
      activeItem: item,
      contentRender: customRender?.[item.contentSlotId],
    }
  }, [customRender, customData, selectedKey])

  useEffect(() => {
    onActiveChange?.(activeItem ? { label: activeItem.label, id: activeItem.id } : undefined)
  }, [activeItem])

  return (
    <>
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
        {contentRender?.({ label: activeItem?.label, id: activeItem?.id })}
      </div>
    </>
  )
}

function customMenuToMenuData(customMenu?: CustomMenu[], customRender?: Record<string, CustomRender>): MenuData[] | undefined {
  return customMenu?.map((item) => ({
    label: customRender?.[item.labelSlotId]?.({ label: item.label, id: item.id }),
    id: item.id,
    subMenus: customMenuToMenuData(item.children, customRender),
  }))
}
