import { EasyCoderElement } from '@easy-coder/sdk/store'

import Rate, { Props } from '.'

const rateMeta: EasyCoderElement.Desc<Props> = {
  type: 'system_component_rate',
  label: 'rate',
  Render: Rate,
}

export default rateMeta
