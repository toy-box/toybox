import React, { FC, useMemo } from 'react'
import { Space } from 'antd'
import { ButtonCluster, IButtonItem } from '@toy-box/toybox-ui'
import { isFn } from '@toy-box/toybox-shared'
import { useDataGrid } from '../hooks'

export interface IOperatePanel {
  items?: IButtonItem[]
  max?: number
  placement?: 'left' | 'right'
}

export const OperatePanel: FC<IOperatePanel> = ({
  items = [],
  max,
  placement = 'left',
  children,
}) => {
  const dataGrid = useDataGrid()
  const innerItems = useMemo(
    () =>
      items.map((item) => ({
        ...item,
        disabled: isFn(item.disabled)
          ? item.disabled.bind(this, dataGrid)
          : item.disabled,
        callback: item.callback
          ? item.callback.bind(this, dataGrid)
          : item.callback,
      })),
    [dataGrid]
  )

  const content = useMemo(() => {
    if (placement === 'right') {
      return (
        <>
          {children}
          <ButtonCluster items={innerItems} max={max} />
        </>
      )
    }
    return (
      <>
        <ButtonCluster items={innerItems} max={max} />
        {children}
      </>
    )
  }, [placement, innerItems])

  return <Space>{content}</Space>
}
