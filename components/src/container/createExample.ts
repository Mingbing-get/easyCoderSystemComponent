import { DataCenter } from '@easy-coder/sdk/data'
import { VariableDefine } from '@easy-coder/sdk/variable'
import { i18n } from '@easy-coder/sdk/i18n'
import { createExampleRecords } from '@easy-coder/sdk/store'

export default async function createExampleByVariableDefine(dataCenter: DataCenter, variableDefine: VariableDefine.Desc) {
  if (variableDefine.type === 'boolean') return true

  if (variableDefine.type === 'date') return '2025-01-01'

  if (variableDefine.type === 'datetime') return new Date().toUTCString()

  if (variableDefine.type === 'file') return []

  if (variableDefine.type === 'float') return 1.1

  if (variableDefine.type === 'number') return 1

  if (variableDefine.type === 'string') return i18n.translateFillEmpty({ zh: '示例', en: 'example' })

  if (variableDefine.type === 'text') return i18n.translateFillEmpty({ zh: '示例', en: 'example' })

  if (variableDefine.type === 'multilingual') return { zh: '示例', en: 'example' }

  if (variableDefine.type === 'array') {
    const result: any[] = []
    for (let i = 0; i < 5; i++) {
      result.push(await createExampleByVariableDefine(dataCenter, variableDefine.item as VariableDefine.Date))
    }
    return result
  }

  if (variableDefine.type === 'object') {
    const result: any = {}
    for (const key in variableDefine.prototype) {
      result[key] = await createExampleByVariableDefine(dataCenter, variableDefine.prototype[key])
    }
    return result
  }

  if (variableDefine.type === 'enum' || variableDefine.type === 'multipleEnum') {
    const enumGroupList = await dataCenter.enumGroupList()
    const curEnumGroup = enumGroupList.find((group) => group.name === variableDefine.enumGroupName)

    if (variableDefine.type === 'enum') {
      return curEnumGroup?.enums?.[0]?.name
    }

    return curEnumGroup?.enums?.map((item) => item.name) || []
  }

  if (variableDefine.type === 'lookup') {
    const exampleRecords = await createExampleRecords(dataCenter, {
      modalName: variableDefine.modalName,
      useApiId: true,
      count: 1,
    })

    return exampleRecords[0]
  }

  if (variableDefine.type === 'multipleLookup') {
    return await createExampleRecords(dataCenter, {
      modalName: variableDefine.modalName,
      useApiId: true,
      count: 5,
    })
  }
}
