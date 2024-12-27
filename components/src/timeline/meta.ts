import { EasyCoderElement } from '@easy-coder/sdk/store'

import Timeline, { Props } from '.'

const timelineMeta: EasyCoderElement.Desc<Props> = {
  type: 'system_component_timeline',
  label: 'timeline',
  Render: Timeline,
}

export default timelineMeta
