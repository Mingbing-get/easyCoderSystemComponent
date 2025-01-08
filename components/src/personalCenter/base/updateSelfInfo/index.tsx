import { useCallback } from 'react'
import { Message } from '@arco-design/web-react'
import { useDataCenter } from '@easy-coder/sdk/data'

import EditAdmin, { User } from '../editUser'

interface Props {
  user?: User
  onComplete?: () => void
}

export default function UpdateSelfInfo({ user, onComplete }: Props) {
  const dataCenter = useDataCenter()

  const handleSubmit = useCallback(
    async (newUser: Partial<User>) => {
      const res = await dataCenter.put<User>('/user/update', newUser, { needLogin: true })
      if (res?.code === 0) {
        dataCenter.setAuth({
          ...dataCenter.getAuth(),
          user: res.data,
        })
        Message.success('修改信息成功')
        onComplete?.()
      } else {
        Message.error('修改信息失败')
      }
    },
    [onComplete]
  )

  if (!user) {
    return <span>请先登录</span>
  }

  return (
    <EditAdmin
      fields={['count', 'email', 'nickName', 'phone', 'avatar']}
      admin={user as User}
      onSubmit={handleSubmit}
    />
  )
}
