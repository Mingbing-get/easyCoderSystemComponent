import { EasyCoderElement } from '@easy-coder/sdk/store'

import Collapse, { Props } from '.'

const collapseMeta: EasyCoderElement.Desc<Props> = {
  type: 'system_component_collapse',
  label: 'collapse',
  Render: Collapse,
}

export default collapseMeta
