import { Avatar } from '@arco-design/web-react'
import { IconUser } from '@arco-design/web-react/icon'

import { User } from './editUser'

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
      {!user ? '未登录' : user.avatar ? <img src={user.avatar} /> : <IconUser />}
    </Avatar>
  )
}
