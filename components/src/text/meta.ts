import { EasyCoderElement } from '@easy-coder/sdk/store'
import { StringOrMultilingualSetter } from '@easy-coder/sdk/design'
import { i18n, Multilingual } from '@easy-coder/sdk/i18n'
import { isFxValue } from '@easy-coder/sdk/variable'

import Text, { TextProps } from '.'

function createTextTypeFn(label: Multilingual) {
  return async (props: TextProps) => {
    let type: 'string' | 'multilingual' = 'multilingual'
    if (isFxValue(props.text)) {
      if ((props.text as any)._r !== 'multilingual') {
        type = 'string'
      }
    }

    return { type, label }
  }
}

const textMeta: EasyCoderElement.Desc<TextProps> = {
  type: 'system_component_text',
  label: {
    zh: '文本',
    en: 'Text',
  },
  defaultAttr: {
    text: {
      zh: '内容',
      en: 'Content',
    },
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
      supportModels: [
        'background',
        'filter',
        'position',
        'borderColor',
        'borderRadius',
        'borderStyle',
        'borderWidth',
        'boxShadow',
        'boxSizing',
        'color',
        'cursor',
        'fontSize',
        'fontStyle',
        'fontWeight',
        'height',
        'margin',
        'maxHeight',
        'maxWidth',
        'minHeight',
        'minWidth',
        'outline',
        'padding',
        'transform',
        'transition',
        'width',
      ],
    },
  },
  attr: {
    text: {
      type: 'multilingual',
      label: {
        zh: '内容',
        en: 'Content',
      },
      setter: StringOrMultilingualSetter,
      setterProps: {
        title: i18n.translate({ zh: '内容', en: 'Content' }),
        size: 'mini',
      },
    },
    maxLine: {
      type: 'number',
      label: {
        zh: '最大显示行数',
        en: 'Max show lines',
      },
    },
    disabledPopover: {
      type: 'boolean',
      label: {
        zh: '是否禁止提示',
        en: 'Is disabled popover',
      },
    },
  },
  event: {
    onClick: {
      label: {
        zh: '点击时',
        en: 'On click',
      },
    },
  },
  export: {
    attr: {
      text: createTextTypeFn({ zh: '文本内容', en: 'Content' }),
    },
    event: {
      setText: {
        params: [createTextTypeFn({ zh: '新值', en: 'New value' })],
        label: {
          zh: '修改变量值',
          en: 'Set value',
        },
      },
    },
  },
  Render: Text,
}

export default textMeta
