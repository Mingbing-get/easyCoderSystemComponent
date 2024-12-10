import { useCallback, useEffect, useState } from 'react'
import { useElementContext, useStateById, useVariableDefine } from '@easy-coder/sdk/store'
import { useDataCenter } from '@easy-coder/sdk/data'
import { VariableDefine, getVariableByPath, variableMapApiNameToId, variableMapIdToApiName } from '@easy-coder/sdk/variable'

interface Props {
  propsKey: string
  value?: Record<string, any>[]
  childKeyName?: string
}

export default function useStandardVariable({ value, propsKey, childKeyName }: Props) {
  const dataCenter = useDataCenter()
  const { id } = useElementContext()
  const element = useStateById('element', id)
  const { variableDefine, initComplete } = useVariableDefine()

  const [afterTransformValue, setAfterTransformValue] = useState<Record<string, any>[]>([])

  const transform = useCallback(async (define: VariableDefine.Array, curDefine: VariableDefine.Array, childKeyName?: string, value?: Record<string, any>[]) => {
    if (!value?.length) return

    const itemDefine = getNextObjectInArrayObject(define)
    if (!itemDefine) return

    const curItemDefine = getNextObjectInArrayObject(curDefine)
    if (!curItemDefine) return

    const nextObjectDefine = { ...itemDefine.prototype }
    const curNextObjectDefine = { ...curItemDefine.prototype }

    const childApiName = itemDefine.prototype?.[childKeyName]?.apiName
    const childApiId = childApiName ? findApiIdUseApiNameInObject(curItemDefine, childApiName) : undefined

    if (childApiId) {
      delete curNextObjectDefine[childApiId]
    }
    if (childKeyName) {
      delete nextObjectDefine[childKeyName]
    }

    const records: Record<string, any>[] = []
    for (const item of value) {
      const apiNameItem = await variableMapIdToApiName(dataCenter, curNextObjectDefine, item)
      const rootApiIdItem = await variableMapApiNameToId(dataCenter, nextObjectDefine, apiNameItem)

      if (childApiId && item[childApiId]?.length) {
        const childDefine = curItemDefine.prototype[childApiId]
        if (childDefine.type === 'array') {
          rootApiIdItem[childKeyName] = await transform(define, childDefine, childKeyName, item[childApiId])
        }
      }

      records.push(rootApiIdItem)
    }

    return records
  }, [])

  useEffect(() => {
    if (!initComplete || !element.props?.[propsKey]?.length) return

    getVariableByPath(dataCenter, element.props?.[propsKey], variableDefine).then(async (res) => {
      if (res.type !== 'array') return

      const records = await transform(res, res, childKeyName, value)
      setAfterTransformValue(records)
    })
  }, [variableDefine, initComplete, element.props?.[propsKey], value, childKeyName])

  return afterTransformValue
}

function getNextObjectInArrayObject(define: VariableDefine.Array) {
  if (define.item.type !== 'object') return

  return define.item as VariableDefine.Object
}

function findApiIdUseApiNameInObject(define: VariableDefine.Object, apiName: string) {
  for (const key in define.prototype) {
    if (define.prototype[key].apiName === apiName) return key
  }
}
