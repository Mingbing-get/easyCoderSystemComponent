import { useCallback, useState } from 'react'
import { Menu, Modal, Button } from '@arco-design/web-react'

import { i18n } from '@easy-coder/sdk/i18n'

import Login from './login'
import ToggleLang from './toggleLang'
import { local } from './local'

export default function NotLoginNavAction() {
  const [showLogin, setShowLogin] = useState(false)

  const handleLogin = useCallback(() => {
    setShowLogin(true)
  }, [])

  return (
    <>
      <Menu className="easy-coder-nav-menu">
        <ToggleLang style={{ marginBottom: 4 }} />
        <Button
          type="text"
          long
          onClick={handleLogin}>
          {i18n.translate(local.login)}
        </Button>
      </Menu>
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
