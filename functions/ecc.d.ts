/// <reference path="../.ecc/types/client.d.ts" />

declare interface FunctionDefine {
  apiId: string
  apiName: string
  label: string
  description?: string
  params?: VariableDefine.Desc[]
  result?: VariableDefine.Desc
  fn: Function
}
