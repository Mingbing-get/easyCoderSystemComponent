import { useMemo } from 'react'
import { EasyCoderElement } from '@easy-coder/sdk/store'
import * as iconsFa from 'react-icons/fa'

export interface IconProps extends EasyCoderElement.DataProps {
  iconName?: string
  style?: React.CSSProperties
  className?: string
}

export default function Icon({ iconName, ...extra }: IconProps) {
  const Render = useMemo(() => iconsFa[iconName] || iconsFa.FaPlus, [iconName])

  return <Render {...extra} />
}
