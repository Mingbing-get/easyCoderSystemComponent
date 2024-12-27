import { EasyCoderElement } from '@easy-coder/sdk/store'

import Slider, { Props } from '.'

const sliderMeta: EasyCoderElement.Desc<Props> = {
  type: 'system_component_slider',
  label: 'slider',
  Render: Slider,
}

export default sliderMeta
