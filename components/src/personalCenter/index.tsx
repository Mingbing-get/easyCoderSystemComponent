import { useEffect, useState } from 'react'
import { EasyCoderElement, useElementContext } from '@easy-coder/sdk/store'
import { Dropdown, Modal } from '@arco-design/web-react'
import { useCurrentUser } from '@easy-coder/sdk/client'
import { i18n } from '@easy-coder/sdk/i18n'

import NavAvatar from './base/avatar'
import NavAction from './base/action'
import NotLoginNavAction from './base/notLoginAction'
import Login from './base/login'
import { local } from './base/local'

export interface PersonalCenterProps extends EasyCoderElement.DataProps {
  style?: React.CSSProperties
  className?: string
}

export interface PersonalCenterExport {
  openLogin?: () => void
}

export default function PersonalCenter({ ...extra }: PersonalCenterProps) {
  const { exportEvent } = useElementContext<PersonalCenterExport>()
  const user = useCurrentUser()
  const [showLogin, setShowLogin] = useState(false)

  useEffect(() => {
    exportEvent('openLogin', () => {
      if (user) return

      setShowLogin(true)
    })

    return () => {
      exportEvent('openLogin', undefined)
    }
  }, [user])

  return (
    <>
      <Dropdown
        trigger="click"
        droplist={user ? <NavAction user={user} /> : <NotLoginNavAction onLogin={() => setShowLogin(true)} />}
        position="br">
        <NavAvatar
          user={user}
          {...extra}
        />
      </Dropdown>
      <Modal
        title={i18n.translate(local.login)}
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
