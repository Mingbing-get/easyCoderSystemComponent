import { DataCenter } from '@easy-coder/sdk/data'
import { Dependency } from '@easy-coder/sdk/helper'

import { fileDownloadPrefix } from './config'

const matchGlobalReg = /!\[.*?\]\((.*?)\)/g
const matchAttrReg = /!\[.*?\]\((.*?)\)/

export default function ContentOnDependencies({ attrValue, dataCenter }: { attrValue?: string; dataCenter: DataCenter }) {
  const deps: Pick<Dependency, 'refType' | 'refPath'>[] = []

  if (attrValue) {
    const downLoadFilePath = `${dataCenter.config.host || location.origin}${fileDownloadPrefix}/`

    const linkAll = attrValue.match(matchGlobalReg)
    linkAll?.forEach((item) => {
      const single = item.match(matchAttrReg)
      const url = single?.[1]
      if (!url?.startsWith(downLoadFilePath)) return

      const suffix = url.substring(downLoadFilePath.length)
      const split = suffix.split(/[?\s=\/]/)
      const token = split[0]
      if (!token?.length) return

      deps.push({
        refType: 'file',
        refPath: [token],
      })
    })
  }

  return deps
}
