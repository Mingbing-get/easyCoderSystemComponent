import { EasyCoderElement } from '@easy-coder/sdk/store'

export interface Props extends EasyCoderElement.DataProps {
  
}

export default function Rate({ ...extra }: Props) {
  return <div {...extra}></div>
}
