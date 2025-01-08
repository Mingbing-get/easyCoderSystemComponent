import toast from '.'

const toastMeta: FunctionDefine = {
  apiId: 'system_component_ohxddMCgepXhRexG',
  apiName: 'system_component_toast',
  label: '显示提示',
  description: '类型支持: info, success, error, warn; 若填写的不是其中的一个, 则使用info',
  params: [
    {
      type: 'string',
      label: '内容',
      apiName: 'content',
      required: true,
    },
    {
      type: 'string',
      label: '类型',
      apiName: 'type',
    },
    {
      type: 'object',
      label: '属性配置',
      apiName: 'pro',
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
