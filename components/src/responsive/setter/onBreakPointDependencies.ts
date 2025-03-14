import { EasyCoderElement } from '@easy-coder/sdk/store'
import { Dependency } from '@easy-coder/sdk/helper'
import { StyleConvert } from '@easy-coder/sdk/style'

import { BreakPoint } from '..'

const onBreakPointDependencies: EasyCoderElement.UiConfig<any, BreakPoint[]>['onDependencies'] = ({ attrValue }) => {
  const deps: Pick<Dependency, 'refPath' | 'refType'>[] = []
  const styleConvert = new StyleConvert()

  attrValue?.forEach((item) => {
    const itemDeps = styleConvert.obtainDependencies(item.style)
    deps.push(
      ...itemDeps.map((item) => ({
        refPath: item.refPath,
        refType: item.refType,
      }))
    )
  })

  return deps
}

export default onBreakPointDependencies
