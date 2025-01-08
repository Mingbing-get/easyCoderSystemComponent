import { useCallback, useState } from 'react'
import { Menu, Divider, Modal } from '@arco-design/web-react'
import { useDataCenter } from '@easy-coder/sdk/data'

import { User } from './editUser'
import UpdateSelfInfo from './updateSelfInfo'
import UpdatePassword from './updatePassword'

interface Props {
  user: User
}

type MenuKey = 'update_info' | 'update_password'

const menu: { key: MenuKey; label: string }[] = [
  {
    key: 'update_info',
    label: '基本信息',
  },
  {
    key: 'update_password',
    label: '修改密码',
  },
]

function getMenuLabel(key?: MenuKey) {
  return menu.find((item) => item.key === key)?.label
}

export default function NavAction({ user }: Props) {
  const dataCenter = useDataCenter()
  const [showMenuKey, setShowMenuKey] = useState<MenuKey>()

  const handleLogout = useCallback(() => {
    dataCenter.setAuth({})
  }, [])

  return (
    <>
      <Menu style={{ boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)' }}>
        {menu.map((item) => (
          <Menu.Item
            key={item.key}
            onClick={() => setShowMenuKey(item.key)}>
            {item.label}
          </Menu.Item>
        ))}
        <Divider style={{ margin: '4px 0' }} />
        <Menu.Item
          key="logout"
          onClick={handleLogout}>
          退出登录
        </Menu.Item>
      </Menu>
      <Modal
        title={getMenuLabel(showMenuKey)}
        visible={!!showMenuKey}
        onCancel={() => setShowMenuKey(undefined)}
        footer={null}>
        {showMenuKey === 'update_info' && (
          <UpdateSelfInfo
            user={user}
            onComplete={() => setShowMenuKey(undefined)}
          />
        )}
        {showMenuKey === 'update_password' && (
          <UpdatePassword
            userId={user._id}
            onComplete={() => setShowMenuKey(undefined)}
          />
        )}
      </Modal>
    </>
  )
}
