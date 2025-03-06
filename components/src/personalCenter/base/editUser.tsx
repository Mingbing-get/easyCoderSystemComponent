import { useEffect, useState } from 'react'
import { Input, Button, Form, Message } from '@arco-design/web-react'

import { BaseRecord } from '@easy-coder/sdk/data'
import { Multilingual, LanguageCode, MultilingualInput, i18n } from '@easy-coder/sdk/i18n'

import UploadImg from './uploadImg'
import { local } from './local'

type AdminField = keyof User | 'password' | 'confirmPassword'

export interface User extends BaseRecord {
  count: string
  nickName: Multilingual
  email?: string
  phone?: string
  avatar?: string
  role?: 'super' | 'admin' | 'user'
  isActive: boolean
  langCode?: LanguageCode
}

interface Props {
  className?: string
  style?: React.CSSProperties
  fields: AdminField[]
  admin?: User
  header?: React.ReactNode
  footer?: React.ReactNode
  onChange?: (admin: Partial<User>) => void
  onSubmit?: (admin: Partial<User>) => Promise<void>
}

interface WithPasswordUser extends User {
  password: string
}

export default function EditUser({ className, style, fields, admin, header, footer, onChange, onSubmit }: Props) {
  const [_admin, setAdmin] = useState<Partial<WithPasswordUser>>(admin || {})
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isDisabled, setIsDisabled] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!admin) return

    setAdmin(admin)
    setConfirmPassword('')
  }, [admin])

  useEffect(() => {
    if (fields.includes('count')) {
      if (!_admin.count) {
        setIsDisabled(true)
        return
      }
    }
    if (fields.includes('password')) {
      if (!_admin.password || _admin.password.length < 8) {
        setIsDisabled(true)
        return
      }
    }
    if (fields.includes('confirmPassword')) {
      if (confirmPassword !== _admin.password) {
        setIsDisabled(true)
        return
      }
    }
    if (fields.includes('nickName')) {
      if (!_admin.nickName) {
        setIsDisabled(true)
        return
      }
    }

    setIsDisabled(false)
  }, [_admin, confirmPassword])

  function handleBlur() {
    if (!confirmPassword || !fields.includes('confirmPassword')) return

    if (confirmPassword !== _admin.password) {
      Message.warning(i18n.translate(local.passwordIsDiff))
    }
  }

  function handleChangeAdmin<K extends keyof WithPasswordUser, V extends WithPasswordUser[K]>(key: K, value: V) {
    const newAdmin = {
      ..._admin,
      [key]: value,
    }
    setAdmin(newAdmin)
    onChange?.(newAdmin)
  }

  async function handleSubmit() {
    setIsLoading(true)
    await onSubmit?.(_admin)
    setIsLoading(false)
  }

  return (
    <Form
      layout="vertical"
      className={className}
      style={style}>
      {header}
      {fields.includes('count') && (
        <Form.Item
          label={i18n.translate(local.account)}
          required>
          <Input
            readOnly
            value={_admin.count}
          />
        </Form.Item>
      )}
      {fields.includes('nickName') && (
        <Form.Item
          label={i18n.translate(local.nickName)}
          required>
          <MultilingualInput
            value={_admin.nickName}
            onInputComplete={(v) => handleChangeAdmin('nickName', v)}
          />
        </Form.Item>
      )}
      {fields.includes('email') && (
        <Form.Item label={i18n.translate(local.email)}>
          <Input
            type="email"
            value={_admin.email}
            onChange={(v) => handleChangeAdmin('email', v)}
          />
        </Form.Item>
      )}
      {fields.includes('phone') && (
        <Form.Item label={i18n.translate(local.phone)}>
          <Input
            type="tel"
            value={_admin.phone}
            onChange={(v) => handleChangeAdmin('phone', v)}
          />
        </Form.Item>
      )}
      {fields.includes('avatar') && (
        <Form.Item label={i18n.translate(local.avatar)}>
          <UploadImg
            limit={1}
            value={_admin.avatar ? [_admin.avatar] : []}
            onChange={(val) => handleChangeAdmin('avatar', val?.[0])}
          />
        </Form.Item>
      )}
      {fields.includes('password') && (
        <Form.Item
          label={i18n.translate(local.password)}
          required>
          <Input
            type="password"
            value={_admin.password}
            onChange={(v) => handleChangeAdmin('password', v)}
            onBlur={handleBlur}
          />
        </Form.Item>
      )}
      {fields.includes('confirmPassword') && (
        <Form.Item
          label={i18n.translate(local.confirmPassword)}
          required>
          <Input
            type="password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            onBlur={handleBlur}
          />
        </Form.Item>
      )}
      <Form.Item>
        <Button
          type="primary"
          onClick={handleSubmit}
          loading={isLoading}
          disabled={isDisabled}
          long>
          {i18n.translate(local.submit)}
        </Button>
      </Form.Item>
      {footer}
    </Form>
  )
}
