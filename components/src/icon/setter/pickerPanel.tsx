import { useCallback, useEffect, useMemo, useState } from 'react'
import classNames from 'classnames'
import { Input, Spin, Tabs } from '@arco-design/web-react'
import { i18n } from '@easy-coder/sdk/i18n'
import { LongText } from '@easy-coder/sdk/helper'
import { EasyCoderData, useDataCenter } from '@easy-coder/sdk/data'

import useVirtualGrid from '../useVirtualGrid'
import { IconGroup, SVGIcon, WithGroupInfoSVGIcon } from '../type'
import RenderSvgIcon from './renderSvgIcon'

interface Props {
  value?: WithGroupInfoSVGIcon
  onPick?: (value: WithGroupInfoSVGIcon) => void
}

interface WithIdSVGIcon extends SVGIcon {
  id: string
  name: string
}

export default function PickerPanel({ value, onPick }: Props) {
  const dataCenter = useDataCenter()
  const [iconGroups, setIconGroups] = useState<IconGroup[]>()
  const [showGroupName, setShowGroupName] = useState(value?.groupName)
  const [icons, setIcons] = useState<WithIdSVGIcon[]>([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')

  const handleFetchGroups = useCallback(async () => {
    setLoading(true)
    const res = await dataCenter.post<EasyCoderData.WithPage<IconGroup>>('/icon/groupList', { pageSize: -1 }, { needLogin: true, cache: {} })
    setLoading(false)
    setShowGroupName((old) => {
      if (old) return old

      return res.data.list[0]?.name
    })
    setIconGroups(res.data.list)
  }, [])

  const handleFetchIcons = useCallback(async (groupName: string) => {
    setLoading(true)
    const res = await dataCenter.get<Record<string, SVGIcon>>('/icon/icons', { groupName }, { needLogin: true, cache: {} })

    const icons = Object.entries(res.data).map(([id, icon]) => ({ ...icon, id, name: i18n.translateFillEmpty(icon.label) }))
    setIcons(icons)
    setLoading(false)
  }, [])

  useEffect(() => {
    handleFetchGroups()
  }, [])

  useEffect(() => {
    setShowGroupName(value?.groupName)
  }, [value?.groupName])

  useEffect(() => {
    if (!showGroupName) return

    handleFetchIcons(showGroupName)
  }, [showGroupName])

  const afterFilterIcons = useMemo(() => {
    if (!searchText) return icons

    return icons.filter((icon) => icon.name.includes(searchText))
  }, [searchText, icons])

  const { domRef, info } = useVirtualGrid<HTMLDivElement>({
    gap: {
      x: 8,
      y: 8,
    },
    itemSize: {
      width: 60,
      height: 56,
    },
    wrapper: {
      paddingX: 16,
      paddingY: 8,
    },
    total: afterFilterIcons.length,
  })

  return (
    <Spin loading={loading}>
      <Tabs
        size="mini"
        activeTab={showGroupName}
        onChange={setShowGroupName}>
        {iconGroups?.map((item) => (
          <Tabs.TabPane
            key={item.name}
            title={i18n.translate(item.label)}>
            {item.name === showGroupName && (
              <div
                className="icon-picker-panel-content"
                ref={domRef}>
                <div className="icon-picker-panel-content-top">
                  <Input.Search
                    size="mini"
                    placeholder="请输入关键词"
                    value={searchText}
                    onChange={setSearchText}
                  />
                </div>
                <div
                  className="icon-picker-panel-content-container"
                  style={{ paddingTop: info.paddingTop, minHeight: info.wrapperHeight }}>
                  <div className="icon-picker-panel-content-body">
                    {afterFilterIcons.slice(info.start, info.count + info.start).map((item) => (
                      <div
                        className={classNames('icon-list-item', showGroupName === value?.groupName && item.id === value?.id && 'is-selected')}
                        key={item.id}
                        onClick={() => onPick({ groupName: showGroupName, ...item })}>
                        <RenderSvgIcon
                          tags={item.tags}
                          viewBox={item.viewBox}
                          fill={item.fill}
                          stroke={item.stroke}
                          strokeWidth={item.strokeWidth}
                        />
                        <LongText
                          style={{ maxWidth: '100%', fontSize: 12 }}
                          text={item.name}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </Tabs.TabPane>
        ))}
      </Tabs>
    </Spin>
  )
}
