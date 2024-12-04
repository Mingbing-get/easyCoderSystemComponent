import { EasyCoderElement } from '@easy-coder/sdk/store'

import Container, { ContainerProps } from '.'

const containerMeta: EasyCoderElement.Desc<ContainerProps> = {
  type: 'system_component_container',
  label: '容器',
  className: {
    className: {
      label: '样式名',
    },
  },
  style: {
    style: {
      label: '样式',
    },
  },
  slot: {
    children: {
      label: '子节点',
    },
  },
  Render: Container,
}

export default containerMeta
