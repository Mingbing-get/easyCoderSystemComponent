import { EasyCoderElement } from '@easy-coder/sdk/store'

import Container, { ContainerProps } from '.'

const createSlotPayloadType: EasyCoderElement.DynamicVariable<ContainerProps> = async (props, getAttrType) => {
  const listType = await getAttrType('list')
  if (!listType) return

  if (listType.type === 'array') {
    return {
      label: '当前项',
      ...listType.item,
    }
  } else if (listType.type === 'multipleEnum') {
    return {
      label: '当前项',
      type: 'enum',
      enumGroupName: listType.enumGroupName,
    }
  } else if (listType.type === 'multipleLookup') {
    return {
      label: '当前项',
      type: 'lookup',
      modalName: listType.modalName,
    }
  }
}

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
  attr: {
    list: {
      type: 'ref',
      label: '遍历数据',
      canAcceptTypes: ['array', 'multipleEnum', 'multipleLookup'],
    },
  },
  slot: {
    children: {
      label: '子节点',
      payload: {
        item: createSlotPayloadType,
      },
    },
  },
  Render: Container,
}

export default containerMeta
