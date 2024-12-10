import classNames from 'classnames'
import { Menu, ResizeBox, MenuProps } from '@arco-design/web-react'

import { MenuData } from './type'

export interface BaseMenuProps extends Omit<MenuProps, 'children'> {
  data?: MenuData[]
  defaultWidth?: number
  canResize?: boolean
  extraRender?: React.ReactNode
}

export default function BaseMenu({ data, mode, defaultWidth, canResize, extraRender, ...extra }: BaseMenuProps) {
  if (mode === 'vertical') {
    if (canResize) {
      return (
        <ResizeBox
          directions={['right']}
          style={{ width: defaultWidth }}
          resizeTriggers={{
            right: <div className="easy-coder-resize-x-trigger" />,
          }}>
          <Menu
            mode={mode}
            {...extra}>
            {data?.map((item) => renderMenuItemOrSubMenu(item))}
            <Menu.Item
              key=""
              className={classNames('easy-coder-menu-extra', `mode-${mode}`)}
              disabled>
              {extraRender}
            </Menu.Item>
          </Menu>
        </ResizeBox>
      )
    }

    return (
      <div style={{ width: defaultWidth }}>
        <Menu
          mode={mode}
          {...extra}>
          {data?.map((item) => renderMenuItemOrSubMenu(item))}
          <Menu.Item
            key=""
            className={classNames('easy-coder-menu-extra', `mode-${mode}`)}
            disabled>
            {extraRender}
          </Menu.Item>
        </Menu>
      </div>
    )
  }

  return (
    <Menu
      mode={mode}
      {...extra}>
      {data?.map((item) => renderMenuItemOrSubMenu(item))}
      <Menu.Item
        key=""
        className={classNames('easy-coder-menu-extra', `mode-${mode}`)}
        disabled>
        {extraRender}
      </Menu.Item>
    </Menu>
  )
}

function renderMenuItemOrSubMenu(item: MenuData) {
  if (item.subMenus?.length) {
    return (
      <Menu.SubMenu
        selectable
        key={item.id}
        title={item.label}>
        {item.subMenus.map((menu) => renderMenuItemOrSubMenu(menu))}
      </Menu.SubMenu>
    )
  }

  return <Menu.Item key={item.id}>{item.label}</Menu.Item>
}
