import { EasyCoderElement } from '@easy-coder/sdk/store'

export interface ContainerProps extends EasyCoderElement.DataProps {
  style?: React.CSSProperties
  className?: string
  children?: () => React.ReactNode
}

export default function Container({ children, ...extra }: ContainerProps) {
  return <div {...extra}>{children?.()}</div>
}
