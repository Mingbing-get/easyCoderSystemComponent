import { useCallback, useMemo, useState } from 'react'
import classNames from 'classnames'
import { Form, Input, Button, Message } from '@arco-design/web-react'
import { IconUser } from '@arco-design/web-react/icon'

import { useDataCenter } from '@easy-coder/sdk/data'
import { i18n } from '@easy-coder/sdk/i18n'

import { User } from '../editUser'
import Register from './register'
import { local } from '../local'

import './index.scss'

interface Props {
  inModal?: boolean
  onComplete?: (user: User) => void
}

export default function Login({ inModal, onComplete }: Props) {
  const dataCenter = useDataCenter()
  const [count, setCount] = useState<string>()
  const [password, setPassword] = useState<string>()
  const [loading, setLoading] = useState(false)
  const [showRegister, setShowRegister] = useState(false)

  const handleSubmit = useCallback(
    async (count: string, password: string) => {
      if (!count || !password) return

      setLoading(true)
      const res = await dataCenter.login(count, password)

      if (res.code !== 0) {
        Message.warning(res.msg || i18n.translate(local.networkError))
      } else {
        Message.success(i18n.translate(local.loginSuccess))
        setCount(undefined)
        setPassword(undefined)
        onComplete?.(res.data)
      }
      setLoading(false)
    },
    [count, password, onComplete]
  )

  const canSubmit = useMemo(() => {
    if (!count || count.length < 6) return false

    if (!password || password.length < 8) return false

    return true
  }, [count, password])

  const handleRegisterComplete = useCallback(
    (count: string, password: string) => {
      setCount(count)
      setPassword(password)
      setShowRegister(false)

      requestAnimationFrame(() => {
        handleSubmit(count, password)
      })
    },
    [handleSubmit]
  )

  if (showRegister) {
    return (
      <Register
        inModal={inModal}
        onComplete={handleRegisterComplete}
        toLogin={() => setShowRegister(false)}
      />
    )
  }

  return (
    <div className={classNames('login-wrapper', inModal && 'is-in-modal')}>
      <Form
        layout="vertical"
        className="login-form"
        autoComplete="off">
        <div className="login-logo">
          <IconUser className="login-logo-icon" />
        </div>
        <Form.Item
          label={i18n.translate(local.account)}
          required>
          <Input
            value={count}
            onChange={setCount}
            placeholder={i18n.translate(local.placeInputAccount)}
          />
        </Form.Item>
        <Form.Item
          label={i18n.translate(local.password)}
          required>
          <Input
            value={password}
            onChange={setPassword}
            type="password"
            placeholder={i18n.translate(local.placeInputPassword)}
          />
        </Form.Item>
        <Form.Item>
          <Button
            long
            disabled={!canSubmit}
            loading={loading}
            type="primary"
            onClick={() => handleSubmit(count || '', password || '')}>
            {i18n.translate(local.login)}
          </Button>
        </Form.Item>
        <div className="link-tip">
          <span onClick={() => setShowRegister(true)}>
            {i18n.translate(local.notAccount)}, {i18n.translate(local.toRegister)}?
          </span>
        </div>
      </Form>
    </div>
  )
}
