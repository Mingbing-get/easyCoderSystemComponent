import { Collapse } from '@arco-design/web-react'

import { CollapseProps } from '..'

interface Props extends Omit<CollapseProps, 'triggerRegion' | 'dataFrom' | 'modalConfig' | 'variableValue' | 'extraRender' | 'headerRender' | 'contentRender'> {
  triggerRegion?: 'header' | 'icon'
}

export default function RenderWhenCustom({ itemClassName, itemStyle, contentStyle, customData, customRender, ...extra }: Props) {
  return (
    <Collapse
      {...extra}
      destroyOnHide>
      {customData?.map((item) => (
        <Collapse.Item
          key={item.id}
          name={item.id}
          className={itemClassName}
          style={itemStyle}
          contentStyle={contentStyle}
          header={customRender?.[item.headerSlotId]?.(item)}
          extra={customRender?.[item.extraSlotId]?.(item)}>
          {customRender?.[item.contentSlotId]?.(item)}
        </Collapse.Item>
      ))}
    </Collapse>
  )
}
