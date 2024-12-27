import { EasyCoderElement } from '@easy-coder/sdk/store'

import Carousel, { Props } from '.'

const carouselMeta: EasyCoderElement.Desc<Props> = {
  type: 'system_component_carousel',
  label: 'carousel',
  Render: Carousel,
}

export default carouselMeta
