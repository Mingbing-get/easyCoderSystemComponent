import { EasyCoderElement } from '@easy-coder/sdk/store'
import { Dropdown } from '@arco-design/web-react'
import { useCurrentUser } from '@easy-coder/sdk/client'

import NavAvatar from './base/avatar'
import NavAction from './base/action'
import NotLoginNavAction from './base/notLoginAction'

export interface PersonalCenterProps extends EasyCoderElement.DataProps {
  style?: React.CSSProperties
  className?: string
}

export default function PersonalCenter({ ...extra }: PersonalCenterProps) {
  const user = useCurrentUser()

  return (
    <Dropdown
      trigger="click"
      droplist={user ? <NavAction user={user} /> : <NotLoginNavAction />}
      position="br">
      <NavAvatar
        user={user}
        {...extra}
      />
    </Dropdown>
  )
}
