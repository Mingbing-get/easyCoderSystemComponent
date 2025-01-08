import { useCallback, useState } from 'react'
import { Input, Button, Message, Form } from '@arco-design/web-react'
import { useDataCenter } from '@easy-coder/sdk/data'

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
      Message.info('请输入旧密码')
      isPass = false
    } else if (oldPassword.length < 8) {
      Message.info('旧密码错误')
      isPass = false
    } else if (!newPassword) {
      Message.info('请输入新密码')
      isPass = false
    } else if (newPassword.length < 8) {
      Message.info('新密码至少八位')
      isPass = false
    } else if (newPassword !== confirmPassword) {
      Message.info('两次密码不相等')
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
      Message.success('修改密码成功')
      onComplete?.()
    } else {
      Message.error('修改密码失败')
    }

    setIsLoading(false)
  }, [userId, onComplete, newPassword, oldPassword])

  return (
    <Form>
      <Form.Item
        label="旧密码"
        required>
        <Input
          type="password"
          value={oldPassword}
          onChange={setOldPassword}
          onBlur={handleBlur}
        />
      </Form.Item>
      <Form.Item
        label="新密码"
        required>
        <Input
          type="password"
          value={newPassword}
          onChange={setNewPassword}
          onBlur={handleBlur}
        />
      </Form.Item>
      <Form.Item
        label="确认密码"
        required>
        <Input
          type="password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          onBlur={handleBlur}
        />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 5 }}>
        <Button
          type="primary"
          onClick={handleSubmit}
          loading={isLoading}
          disabled={isDisabled}>
          提交
        </Button>
      </Form.Item>
    </Form>
  )
}
