import { Divider as DividerBase, DividerProps as DividerBaseProps } from '@arco-design/web-react'
import { EasyCoderElement } from '@easy-coder/sdk/store'
import { Multilingual, i18n } from '@easy-coder/sdk/i18n'

export interface DividerProps extends EasyCoderElement.DataProps, Omit<DividerBaseProps, 'className' | 'children'> {
  className?: string
  text?: string | Multilingual
}

export default function Divider({ text, ...extra }: DividerProps) {
  return <DividerBase {...extra}>{i18n.translate(text)}</DividerBase>
}
