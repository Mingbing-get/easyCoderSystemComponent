import { Collapse } from '@arco-design/web-react'

import { CollapseProps } from '..'

interface Props extends Omit<CollapseProps, 'triggerRegion' | 'dataFrom' | 'modalConfig' | 'customData' | 'customRender'> {
  triggerRegion?: 'header' | 'icon'
}

export default function RenderWhenVariable({
  itemClassName,
  itemStyle,
  contentStyle,
  variableValue,
  headerRender,
  extraRender,
  contentRender,
  ...extra
}: Props) {
  return (
    <Collapse
      {...extra}
      destroyOnHide>
      {variableValue?.map((item, index) => (
        <Collapse.Item
          key={index}
          name={`${index}`}
          className={itemClassName}
          style={itemStyle}
          contentStyle={contentStyle}
          header={headerRender?.({ item })}
          extra={extraRender?.({ item })}>
          {contentRender?.({ item })}
        </Collapse.Item>
      ))}
    </Collapse>
  )
}
