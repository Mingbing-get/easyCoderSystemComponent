import { useMemo } from 'react'
import { EasyCoderElement, useElementContext, useStateById } from '@easy-coder/sdk/store'

export interface ContainerProps extends EasyCoderElement.DataProps {
  style?: React.CSSProperties
  className?: string
  list?: any[]
  children?: (payload?: { item: any }) => React.ReactNode
}

export default function Container({ children, list, ...extra }: ContainerProps) {
  const { id } = useElementContext<unknown, ContainerProps>()
  const element = useStateById('element', id)

  const hasList = useMemo(() => !!element?.props?.list, [element?.props?.list])

  return <div {...extra}>{hasList ? list?.map((item) => children?.({ item })) : children?.()}</div>
}
