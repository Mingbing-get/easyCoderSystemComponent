import toast from '.'

const toastMeta: FunctionDefine = {
  apiId: 'system_component_ohxddMCgepXhRexG',
  apiName: 'system_component_toast',
  label: {
    zh: '显示提示',
    en: 'Show toast',
  },
  params: [
    {
      type: 'string',
      label: {
        zh: '内容',
        en: 'Content',
      },
      apiName: 'content',
      required: true,
    },
    {
      type: 'enum',
      label: {
        zh: '类型',
        en: 'Type',
      },
      apiName: 'type',
      enumGroupName: '_role',
      options: [
        { value: 'info', label: '信息' },
        { value: 'success', label: '成功' },
        { value: 'error', label: '错误' },
        { value: 'warn', label: '警告' },
      ],
    },
    {
      type: 'object',
      label: {
        zh: '属性配置',
        en: 'Attribute configuration',
      },
      apiName: 'option',
      prototype: {
        canClose: {
          type: 'boolean',
          label: {
            zh: '是否可手动关闭',
            en: 'Whether it can be closed manually',
          },
          apiName: 'canClose',
        },
        duration: {
          type: 'number',
          label: {
            zh: '显示时间(ms)',
            en: 'Display time (ms)',
          },
          apiName: 'duration',
        },
      },
    },
  ],
  fn: toast,
}

export default toastMeta
