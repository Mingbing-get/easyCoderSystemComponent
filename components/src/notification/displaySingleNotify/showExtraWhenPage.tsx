import { useCallback, useMemo } from 'react'
import { Button, Popover, Modal } from '@arco-design/web-react'

import { useGetModalContainer, useVariableValue, GLOBAL_VARIABLE } from '@easy-coder/sdk/store'
import { EasyCoderMessage, LookupInRecord, useDataCenter } from '@easy-coder/sdk/data'
import { RenderPage, useEasyCodeClient } from '@easy-coder/sdk/client'
import { i18n } from '@easy-coder/sdk/i18n'

interface Props {
  extra: EasyCoderMessage.PageExtra
}

const viewDetails = i18n.translate({ zh: '查看详情', en: 'View details' })

export default function ShowExtraWhenPage({ extra }: Props) {
  const dataCenter = useDataCenter()
  const getModalContainer = useGetModalContainer()
  const { otherPlatformResources } = useEasyCodeClient()
  const { variableValue, addDependent } = useVariableValue()

  const user = useMemo(() => {
    addDependent([GLOBAL_VARIABLE, '_currentUser'])
    return variableValue?.['_currentUser']
  }, [variableValue])

  const handleClick = useCallback(() => {
    if (!extra.showType || extra.showType === 'openPage') {
      const search: string[] = []

      for (const key in extra.params) {
        const v = extra.params[key]
        if ([undefined, null].includes(v)) continue

        if (v instanceof Array) {
          v.forEach((item, index) => {
            if (isLookup(item)) {
              search.push(`${key}[${index}]=${item._id}`)
            } else {
              search.push(`${key}[${index}]=${item}`)
            }
          })
        } else if (isLookup(v)) {
          search.push(`${key}=${v._id}`)
        } else {
          search.push(`${key}=${v}`)
        }
      }

      window.open(`${dataCenter.config.host}/display/${extra.pageName}?${search.join('&')}`)
    } else if (extra.showType === 'modal') {
      Modal.info({
        title: null,
        footer: null,
        closable: true,
        icon: null,
        maskClosable: true,
        className: 'view-page-modal',
        content: (
          <RenderPage
            dataCenter={dataCenter}
            pageApiName={extra.pageName}
            paramsFromUrl={false}
            defaultParamsValue={extra.params}
            getModalContainer={getModalContainer}
            user={user}
            disableSetDocumentTitle
            otherPlatformResources={otherPlatformResources}
          />
        ),
      })
    }
  }, [extra])

  if (extra.showType === 'popover') {
    return (
      <Popover
        trigger="click"
        triggerProps={{ showArrow: false, autoAlignPopupWidth: false }}
        position="bottom"
        style={{ maxWidth: 'auto' }}
        content={
          <div className="view-page-popover-content">
            <RenderPage
              dataCenter={dataCenter}
              pageApiName={extra.pageName}
              paramsFromUrl={false}
              defaultParamsValue={extra.params}
              getModalContainer={getModalContainer}
              user={user}
              disableSetDocumentTitle
              otherPlatformResources={otherPlatformResources}
            />
          </div>
        }>
        <Button
          size="mini"
          type="text">
          {viewDetails}
        </Button>
      </Popover>
    )
  }

  return (
    <Button
      size="mini"
      type="text"
      onClick={handleClick}>
      {viewDetails}
    </Button>
  )
}

function isLookup(v: any): v is LookupInRecord {
  if (Object.prototype.toString.call(v) !== '[object Object]') return false

  if (!v._id) return false

  return true
}
