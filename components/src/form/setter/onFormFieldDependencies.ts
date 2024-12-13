import { Dependency } from '@easy-coder/sdk/helper'
import { EasyCoderElement } from '@easy-coder/sdk/store'

export const onFormFieldDependencies: EasyCoderElement.UiConfig<any, Record<string, any>>['onDependencies'] = ({ props, attrValue }) => {
  const deps: Pick<Dependency, 'refType' | 'refPath'>[] = []

  if (props?.modalConfig?.name) {
    for (const key in attrValue) {
      deps.push({
        refType: 'modalField',
        refPath: [props.modalConfig.name, key],
      })
    }
  }

  return deps
}
