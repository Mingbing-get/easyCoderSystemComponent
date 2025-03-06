import { EasyCoderElement } from '@easy-coder/sdk/store'

import Container, { ContainerProps } from '.'

const createSlotPayloadType: EasyCoderElement.DynamicVariable<ContainerProps> = async (props, getAttrType) => {
  const listType = await getAttrType('list')
  if (!listType) return

  if (listType.type === 'array') {
    return {
      label: {
        zh: '当前项',
        en: 'Current Item',
      },
      ...listType.item,
    }
  } else if (listType.type === 'multipleEnum') {
    return {
      label: {
        zh: '当前项',
        en: 'Current Item',
      },
      type: 'enum',
      enumGroupName: listType.enumGroupName,
    }
  } else if (listType.type === 'multipleLookup') {
    return {
      label: {
        zh: '当前项',
        en: 'Current Item',
      },
      type: 'lookup',
      modalName: listType.modalName,
    }
  }
}

const containerMeta: EasyCoderElement.Desc<ContainerProps> = {
  type: 'system_component_container',
  label: {
    zh: '容器',
    en: 'Container',
  },
  className: {
    className: {
      label: {
        zh: '样式名',
        en: 'Classname',
      },
    },
  },
  style: {
    style: {
      label: {
        zh: '样式',
        en: 'Style',
      },
    },
  },
  attr: {
    list: {
      type: 'ref',
      label: {
        zh: '遍历数据',
        en: 'Traverse data',
      },
      canAcceptTypes: ['array', 'multipleEnum', 'multipleLookup'],
    },
  },
  slot: {
    children: {
      label: {
        zh: '子节点',
        en: 'Subnode',
      },
      payload: {
        item: createSlotPayloadType,
      },
    },
  },
  Render: Container,
}

export default containerMeta
