import { EasyCoderElement } from '@easy-coder/sdk/store'
import { Dependency } from '@easy-coder/sdk/helper'

import { TableProps } from '..'

const onColumnDependencies: EasyCoderElement.UiConfig<any, TableProps['columns']>['onDependencies'] = async ({ dataCenter, attrValue, props }) => {
  const deps: Pick<Dependency, 'refPath' | 'refType'>[] = []

  if (props?.dataFrom === 'modal' && props?.modalConfig?.name) {
    const modals = await dataCenter.modalList()
    const currentModal = modals.find((modal) => modal.name === props.modalConfig.name)
    if (currentModal) {
      const stacks = [...(attrValue || [])]
      while (stacks.length > 0) {
        const first = stacks.pop()
        if (first.fieldKeys) {
          const field = currentModal.fields.find((field) => field.name === first.fieldKeys)
          if (field) {
            deps.push({
              refType: 'modalField',
              refPath: [currentModal.name, field.name],
            })
          }
        }

        if (first.children?.length) {
          stacks.push(...first.children)
        }
      }
    }
  }

  return deps
}

export default onColumnDependencies
