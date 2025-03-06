import { useCallback, useState } from 'react'
import { Menu, Divider, Modal } from '@arco-design/web-react'

import { useDataCenter } from '@easy-coder/sdk/data'
import { i18n } from '@easy-coder/sdk/i18n'

import { User } from './editUser'
import UpdateSelfInfo from './updateSelfInfo'
import UpdatePassword from './updatePassword'
import ToggleLang from './toggleLang'
import { local } from './local'

interface Props {
  user: User
}

type MenuKey = 'update_info' | 'update_password'

const menu: { key: MenuKey; label: string }[] = [
  {
    key: 'update_info',
    label: i18n.translate(local.baseInfo),
  },
  {
    key: 'update_password',
    label: i18n.translate(local.updatePassword),
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
        <ToggleLang
          style={{ marginBottom: 4 }}
          needPost
        />
        <Menu.Item
          key="logout"
          onClick={handleLogout}>
          {i18n.translate(local.logout)}
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
