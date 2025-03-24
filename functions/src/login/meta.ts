import login from '.'

const loginMeta: FunctionDefine = {
  apiId: 'system_component_tzPfEAXQIQGbJsfq',
  apiName: 'system_component_login',
  label: {
    zh: '登录',
    en: 'login',
  },
  params: [
    {
      type: 'string',
      label: {
        zh: '账号',
        en: 'Account',
      },
      apiName: 'account',
    },
    {
      type: 'string',
      label: {
        zh: '密码',
        en: 'Password',
      },
      apiName: 'password',
    },
  ],
  result: {
    type: 'object',
    label: {
      zh: '登录结果',
      en: 'Login result',
    },
    apiName: 'result',
    prototype: {
      code: {
        type: 'number',
        label: {
          zh: '状态码',
          en: 'Status code',
        },
        apiName: 'code',
      },
      msg: {
        type: 'string',
        label: {
          zh: '提示信息',
          en: 'Tips',
        },
        apiName: 'msg',
      },
      data: {
        type: 'lookup',
        label: {
          zh: '登录用户',
          en: 'Login user',
        },
        modalName: '_user',
        apiName: 'data',
      },
    },
  },
  fn: login,
}

export default loginMeta
