import { createContext, useContext } from 'react'

import { TableProps } from '..'

export interface EasyCoderTableContext
  extends Pick<TableProps, 'columns' | 'headerRender' | 'rows' | 'customCellRender' | 'modalConfig' | 'dataFrom' | 'rowRender' | 'loopRow'> {
  canEdit?: boolean
}

export const easyCoderTableContext = createContext<EasyCoderTableContext>({})

export function useEasyCoderTable() {
  return useContext(easyCoderTableContext)
}

export const EasyCoderTableProvider = easyCoderTableContext.Provider
