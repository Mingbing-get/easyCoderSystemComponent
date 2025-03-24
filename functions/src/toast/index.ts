import Toast, { ToastType, ToastOption } from './toast'

export default async function ({ dataCenter, i18n }: FunctionContext, content: string, type?: ToastType, option?: ToastOption) {
  const instance = new Toast(content, type, option)
  instance.show()
}
