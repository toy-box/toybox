import React, { FC, useMemo } from 'react'
import { ButtonCluster, IButtonItem } from '@toy-box/toybox-ui'
import { isFn } from '@toy-box/toybox-shared'
import { useIndexView } from '../hooks'

export interface IOperatePanel {
  items?: IButtonItem[]
}

export const OperatePanel: FC<IOperatePanel> = ({ items = [] }) => {
  const indexView = useIndexView()
  const innerItems = useMemo(
    () =>
      items.map((item) => ({
        ...item,
        disabled: isFn(item.disabled)
          ? item.disabled.bind(this, indexView)
          : item.disabled,
        callback: item.callback
          ? item.callback.bind(this, indexView)
          : item.callback,
      })),
    [indexView]
  )
  return <ButtonCluster items={innerItems} />
}
