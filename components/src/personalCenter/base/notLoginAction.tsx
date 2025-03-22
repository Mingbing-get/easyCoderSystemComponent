import { Menu, Button } from '@arco-design/web-react'

import { i18n } from '@easy-coder/sdk/i18n'

import ToggleLang from './toggleLang'
import { local } from './local'

interface Props {
  onLogin?: () => void
}

export default function NotLoginNavAction({ onLogin }: Props) {
  return (
    <Menu className="easy-coder-nav-menu">
      <ToggleLang style={{ marginBottom: 4 }} />
      <Button
        type="text"
        long
        onClick={onLogin}>
        {i18n.translate(local.login)}
      </Button>
    </Menu>
  )
}
