import { useCallback, useState } from 'react'
import { EasyCoderElement } from '@easy-coder/sdk/store'
import { Dropdown, Modal } from '@arco-design/web-react'
import { useCurrentUser } from '@easy-coder/sdk/client'

import NavAvatar from './base/avatar'
import NavAction from './base/action'
import Login from './base/login'

export interface PersonalCenterProps extends EasyCoderElement.DataProps {
  style?: React.CSSProperties
  className?: string
}

export default function PersonalCenter({ ...extra }: PersonalCenterProps) {
  const [showLogin, setShowLogin] = useState(false)
  const user = useCurrentUser()

  const handleLogin = useCallback(() => {
    if (user) return

    setShowLogin(true)
  }, [user])

  return (
    <>
      <Dropdown
        trigger="click"
        disabled={!user}
        droplist={user && <NavAction user={user} />}
        position="br">
        <NavAvatar
          {...extra}
          user={user}
          onClick={handleLogin}
        />
      </Dropdown>
      <Modal
        title="登录"
        visible={showLogin}
        onCancel={() => setShowLogin(false)}
        footer={null}>
        <Login
          inModal
          onComplete={() => setShowLogin(false)}
        />
      </Modal>
    </>
  )
}
