import { useCallback, useEffect, useMemo, useState } from 'react'
import { EasyCoderElement, useElementContext, useStateById, useVariableDefine, useEnv } from '@easy-coder/sdk/store'
import { getVariableByPath, VariableDefine } from '@easy-coder/sdk/variable'
import { useDataCenter } from '@easy-coder/sdk/data'

import createExampleByVariableDefine from './createExample'

export interface ContainerProps extends EasyCoderElement.DataProps {
  style?: React.CSSProperties
  className?: string
  list?: any[]
  children?: (payload?: { item: any }) => React.ReactNode
}

export default function Container({ children, list, ...extra }: ContainerProps) {
  const { id } = useElementContext<unknown, ContainerProps>()
  const element = useStateById('element', id)

  const listPath: string[] | undefined = useMemo(() => element?.props?.list, [element?.props?.list])

  return (
    <div {...extra}>
      {listPath ? (
        <RenderContainerWithList
          list={list}
          listPath={listPath}
          children={children}
        />
      ) : (
        children?.()
      )}
    </div>
  )
}

interface RenderContainerWithListProps {
  list?: any[]
  children?: (payload?: { item: any }) => React.ReactNode
  listPath: string[]
}
function RenderContainerWithList({ list, listPath, children }: RenderContainerWithListProps) {
  const { variableDefine, initComplete } = useVariableDefine()
  const dataCenter = useDataCenter()
  const { isPreviewing } = useEnv()
  const [withExampleList, setWithExampleList] = useState(list)

  const createExample = useCallback(async (listPath: string[], variableDefine?: Record<string, VariableDefine.Desc>) => {
    const listVariableDefine = await getVariableByPath(dataCenter, listPath, variableDefine)

    if (['array', 'multipleLookup', 'multipleEnum'].includes(listVariableDefine?.type)) {
      const exampleRecords = await createExampleByVariableDefine(dataCenter, listVariableDefine)
      setWithExampleList(exampleRecords)
    }
  }, [])

  useEffect(() => {
    if (!isPreviewing || list?.length || !initComplete) {
      setWithExampleList(list)
      return
    }

    createExample(listPath, variableDefine)
  }, [list, listPath, isPreviewing, variableDefine, initComplete])

  return withExampleList?.map((item) => children?.({ item }))
}
