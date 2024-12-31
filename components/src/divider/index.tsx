import { Divider as DividerBase, DividerProps as DividerBaseProps } from '@arco-design/web-react'
import { EasyCoderElement } from '@easy-coder/sdk/store'

export interface DividerProps extends EasyCoderElement.DataProps, Omit<DividerBaseProps, 'className' | 'children'> {
  className?: string
  text?: string
}

export default function Divider({ text, ...extra }: DividerProps) {
  return <DividerBase {...extra}>{text}</DividerBase>
}
