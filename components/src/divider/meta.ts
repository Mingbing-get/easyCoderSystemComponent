import { EasyCoderElement } from '@easy-coder/sdk/store'

import Divider, { Props } from '.'

const dividerMeta: EasyCoderElement.Desc<Props> = {
  type: 'system_component_divider',
  label: 'divider',
  Render: Divider,
}

export default dividerMeta
