import { Avatar } from '@arco-design/web-react'
import { IconUser } from '@arco-design/web-react/icon'

import { i18n } from '@easy-coder/sdk/i18n'

import { User } from './editUser'
import { local } from './local'

interface Props {
  style?: React.CSSProperties
  className?: string
  user?: User
  onClick?: () => void
  [x: `data-${string}`]: string
}

export default function NavAvatar({ user, onClick, ...extra }: Props) {
  return (
    <Avatar
      {...extra}
      onClick={onClick}>
      {!user ? i18n.translate(local.notLogin) : user.avatar ? <img src={user.avatar} /> : <IconUser />}
    </Avatar>
  )
}
