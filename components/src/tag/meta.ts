import { EasyCoderElement } from '@easy-coder/sdk/store'

import Tag, { Props } from '.'

const tagMeta: EasyCoderElement.Desc<Props> = {
  type: 'system_component_tag',
  label: 'tag',
  Render: Tag,
}

export default tagMeta
