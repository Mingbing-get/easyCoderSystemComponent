import { EasyCoderElement } from '@easy-coder/sdk/store'
import { FileInRecord } from '@easy-coder/sdk/data'
import { Dependency } from '@easy-coder/sdk/helper'
import { isFxValue } from '@easy-coder/sdk/variable'

const onInputValueDependencies: EasyCoderElement.UiConfig<any, FileInRecord[]>['onDependencies'] = ({ dataCenter, attrValue, props }) => {
  const deps: Pick<Dependency, 'refType' | 'refPath'>[] = []

  if (props?.type === 'file' && !isFxValue(attrValue)) {
    attrValue?.forEach((item) => deps.push({ refType: 'file', refPath: [item.token] }))
  }

  return deps
}

export default onInputValueDependencies
