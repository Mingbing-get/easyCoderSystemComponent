import { Collapse } from '@arco-design/web-react'
import { useEnv } from '@easy-coder/sdk/store'

import { CollapseProps } from '..'

interface Props extends Omit<CollapseProps, 'triggerRegion' | 'dataFrom' | 'modalConfig' | 'customData' | 'customRender' | 'autoFetch'> {
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
  const { isPreviewing } = useEnv()

  return (
    <Collapse
      {...extra}
      defaultActiveKey={isPreviewing ? ['0'] : undefined}
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
