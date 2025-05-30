import { useEffect, useState } from 'react'
import { VariableCondition, VariableSetter, MultipleLookupSetter, variableConditionToModalCondition } from '@easy-coder/sdk/variable'
import { useVariableValue, useVariableDefine } from '@easy-coder/sdk/store'
import { CRUD, useDataCenter } from '@easy-coder/sdk/data'

interface Props extends Omit<VariableSetter.MultipleLookup, 'condition'> {
  condition?: VariableCondition.Desc
}

export default function WithConditionMultipleLookupSetter({ condition, ...extra }: Props) {
  const [modalCondition, setModalCondition] = useState<CRUD.Condition<any> | false | undefined>(false)
  const dataCenter = useDataCenter()
  const { variableValue, addDependent } = useVariableValue()
  const { variableDefine, initComplete } = useVariableDefine()

  useEffect(() => {
    if (!condition) {
      setModalCondition(undefined)
      return
    }

    if (!initComplete) {
      setModalCondition(false)
      return
    }

    variableConditionToModalCondition({
      dataCenter,
      condition,
      context: variableValue,
      contextDefine: variableDefine,
      onVariablePath: addDependent,
    }).then(setModalCondition)
  }, [condition, initComplete, variableValue, variableDefine])

  return (
    <MultipleLookupSetter
      condition={modalCondition}
      {...extra}
    />
  )
}
