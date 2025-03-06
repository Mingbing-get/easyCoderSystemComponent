import { useCallback, useState } from 'react'
import { Input, Button, Message, Form } from '@arco-design/web-react'

import { useDataCenter } from '@easy-coder/sdk/data'
import { i18n } from '@easy-coder/sdk/i18n'

import { local } from '../local'

interface Props {
  userId: number
  onComplete?: () => void
}

export default function UpdatePassword({ userId, onComplete }: Props) {
  const dataCenter = useDataCenter()
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isDisabled, setIsDisabled] = useState(true)

  const handleBlur = useCallback(() => {
    let isPass = true
    if (!oldPassword) {
      Message.info(i18n.translate(local.placeInputOldPassword))
      isPass = false
    } else if (oldPassword.length < 8) {
      Message.info(i18n.translate(local.oldPasswordError))
      isPass = false
    } else if (!newPassword) {
      Message.info(i18n.translate(local.placeInputNewPassword))
      isPass = false
    } else if (newPassword.length < 8) {
      Message.info(i18n.translate(local.passwordMoreThanEight))
      isPass = false
    } else if (newPassword !== confirmPassword) {
      Message.info(i18n.translate(local.passwordIsDiff))
      isPass = false
    }

    setIsDisabled(!isPass)
  }, [oldPassword, newPassword, confirmPassword])

  const handleSubmit = useCallback(async () => {
    setIsLoading(true)

    const res = await dataCenter.post<unknown>('/user/resetPassword', { newPassword, oldPassword }, { needLogin: true })
    if (res?.code === 0) {
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
      Message.success(i18n.translate(local.updatePasswordSuccess))
      onComplete?.()
    } else {
      Message.error(i18n.translate(local.updatePasswordFaile))
    }

    setIsLoading(false)
  }, [userId, onComplete, newPassword, oldPassword])

  return (
    <Form layout="vertical">
      <Form.Item
        label={i18n.translate(local.oldPassword)}
        required>
        <Input
          type="password"
          value={oldPassword}
          onChange={setOldPassword}
          onBlur={handleBlur}
        />
      </Form.Item>
      <Form.Item
        label={i18n.translate(local.newPassword)}
        required>
        <Input
          type="password"
          value={newPassword}
          onChange={setNewPassword}
          onBlur={handleBlur}
        />
      </Form.Item>
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
      <Form.Item>
        <Button
          long
          type="primary"
          onClick={handleSubmit}
          loading={isLoading}
          disabled={isDisabled}>
          {i18n.translate(local.submit)}
        </Button>
      </Form.Item>
    </Form>
  )
}
