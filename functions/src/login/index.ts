export default async function ({ dataCenter, i18n }: FunctionContext, account: string, password: string) {
  return await dataCenter.login(account, password)
}
