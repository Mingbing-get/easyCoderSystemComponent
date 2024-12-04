/// <reference path="../.ecc/types/index.d.ts" />

declare interface FaasDefine {
  apiId: string
  apiName: string
  label: string
  description?: string
  params?: VariableDefine.Desc[]
  result?: VariableDefine.Desc
}
