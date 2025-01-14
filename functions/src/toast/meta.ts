import toast from '.'

const toastMeta: FunctionDefine = {
  apiId: 'system_component_ohxddMCgepXhRexG',
  apiName: 'system_component_toast',
  label: '显示提示',
  params: [
    {
      type: 'string',
      label: '内容',
      apiName: 'content',
      required: true,
    },
    {
      type: 'enum',
      label: '类型',
      apiName: 'type',
      enumGroupName: '',
      options: [
        { value: 'info', label: '信息' },
        { value: 'success', label: '成功' },
        { value: 'error', label: '错误' },
        { value: 'warn', label: '警告' },
      ],
    },
    {
      type: 'object',
      label: '属性配置',
      apiName: 'option',
      prototype: {
        canClose: {
          type: 'boolean',
          label: '是否可手动关闭',
          apiName: 'canClose',
        },
        duration: {
          type: 'number',
          label: '显示时间(ms)',
          apiName: 'duration',
        },
      },
    },
  ],
  fn: toast,
}

export default toastMeta
