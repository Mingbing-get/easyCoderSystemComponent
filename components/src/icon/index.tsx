import { EasyCoderElement } from '@easy-coder/sdk/store'
import { IconThumbUp } from '@arco-design/web-react/icon'

import RenderSvgIcon from './setter/renderSvgIcon'
import { WithGroupInfoSVGIcon } from './type'

export interface IconProps extends EasyCoderElement.DataProps {
  icon?: WithGroupInfoSVGIcon
  style?: React.CSSProperties
  className?: string
  onClick?: () => void
}

export default function Icon({ icon, ...extra }: IconProps) {
  if (icon) {
    return (
      <RenderSvgIcon
        {...extra}
        tags={icon.tags}
        viewBox={icon.viewBox}
        fill={icon.fill}
        stroke={icon.stroke}
        strokeWidth={icon.strokeWidth}
      />
    )
  }

  return <IconThumbUp {...extra} />
}
