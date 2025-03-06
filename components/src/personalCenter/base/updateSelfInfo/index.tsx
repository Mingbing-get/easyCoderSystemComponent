import { useCallback } from 'react'
import { Message } from '@arco-design/web-react'

import { useDataCenter } from '@easy-coder/sdk/data'
import { i18n } from '@easy-coder/sdk/i18n'

import EditAdmin, { User } from '../editUser'
import { local } from '../local'

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
        Message.success(i18n.translate(local.updateInfoSuccess))
        onComplete?.()
      } else {
        Message.error(i18n.translate(local.updateInfoError))
      }
    },
    [onComplete]
  )

  if (!user) {
    return <span>{i18n.translate(local.palceLogin)}</span>
  }

  return (
    <EditAdmin
      fields={['count', 'email', 'nickName', 'phone', 'avatar']}
      admin={user as User}
      onSubmit={handleSubmit}
    />
  )
}
