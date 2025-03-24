import getCurrentLang from '.'

const getCurrentLangMeta: FunctionDefine = {
  apiId: 'system_component_ImpGxFAVUWbupllk',
  apiName: 'system_component_getCurrentLang',
  label: {
    zh: '获取当前语言',
    en: 'Get current lang',
  },
  params: [],
  result: {
    type: 'string',
    label: {
      zh: '当前语言',
      en: 'Current lang',
    },
    apiName: '_currentLang',
  },
  fn: getCurrentLang,
}

export default getCurrentLangMeta
