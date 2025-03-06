import { useCallback, useEffect, useMemo, useState } from 'react'
import classNames from 'classnames'
import { Message } from '@arco-design/web-react'

import { useDataCenter } from '@easy-coder/sdk/data'
import { i18n } from '@easy-coder/sdk/i18n'

import EditUser, { User } from '../editUser'
import { local } from '../local'

interface Props {
  inModal?: boolean
  onComplete?: (count: string, password: string) => void
  toLogin?: () => void
}

export default function Register({ inModal, onComplete, toLogin }: Props) {
  const dataCenter = useDataCenter()
  const [count, setCount] = useState<string>()

  const fetchGenerateCount = useCallback(async () => {
    const res = await dataCenter.get<number>('/user/generateCount')
    if (res?.code === 0) {
      setCount(`${res.data}`)
    } else {
      Message.error(i18n.translate(local.createAccountError))
    }
  }, [])

  const initUser = useMemo(() => {
    const initUser = { count: count || '', _id: 0, role: 'user', nickName: {} } as User

    return initUser
  }, [count])

  useEffect(() => {
    fetchGenerateCount()
  }, [])

  const handleSubmit = useCallback(
    async (user: User & { password: string }) => {
      const temp = { ...user }
      delete (temp as any)._id

      const res = await dataCenter.post<number>('/user/register', temp)
      if (res?.code !== 0) {
        Message.error(i18n.translate(local.registerError))
        return
      }
      Message.success(i18n.translate(local.registerSuccess))

      // 自动登录
      onComplete?.(user.count, user.password || '')
    },
    [onComplete]
  )

  return (
    <div className={classNames('login-wrapper', inModal && 'is-in-modal')}>
      <EditUser
        className="register-form"
        admin={initUser}
        fields={['count', 'nickName', 'avatar', 'email', 'password', 'phone', 'confirmPassword']}
        onSubmit={handleSubmit as any}
        header={<h3 className="register-title">{i18n.translate(local.register)}</h3>}
        footer={
          <div className="link-tip">
            <span onClick={toLogin}>
              {i18n.translate(local.hasAccount)}, {i18n.translate(local.toLogin)}?
            </span>
          </div>
        }
      />
    </div>
  )
}
