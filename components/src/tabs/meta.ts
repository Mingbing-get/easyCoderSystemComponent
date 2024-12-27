import { EasyCoderElement } from '@easy-coder/sdk/store'

import Tabs, { Props } from '.'

const tabsMeta: EasyCoderElement.Desc<Props> = {
  type: 'system_component_tabs',
  label: 'tabs',
  Render: Tabs,
}

export default tabsMeta
