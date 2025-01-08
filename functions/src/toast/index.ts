type ToastType = 'info' | 'success' | 'error' | 'warn'

interface ToastPro {
  canClose?: boolean
  duration?: number
}

export default async function ({ dataCenter }: FunctionContext, content: string, type?: ToastType, pro?: ToastPro) {
  console.log(content, type, pro)
}
