import { useMemo } from 'react'
import { Icon } from '@arco-design/web-react'

import { SVGTag } from '../type'
import { SVGTagListToHtml } from './parseHtml'

interface IconProps extends Omit<React.SVGAttributes<SVGElement>, 'className' | 'children'> {
  style?: React.CSSProperties
  type?: string
  spin?: boolean
  className?: string | string[]
  tags: SVGTag[]
}

export default function RenderSvgIcon({ tags, viewBox, ...props }: IconProps) {
  const svgHtml = useMemo(() => SVGTagListToHtml(tags), [tags])

  return (
    <Icon
      {...props}
      viewBox={viewBox || '0 0 1024 1024'}
      dangerouslySetInnerHTML={{ __html: svgHtml }}
    />
  )
}
