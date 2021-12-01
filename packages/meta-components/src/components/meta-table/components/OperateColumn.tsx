import React, { FC, useMemo } from 'react'
import { ButtonCluster, IButtonClusterProps } from '@toy-box/toybox-ui'
import { isFn } from '@toy-box/toybox-shared'
import { RowData } from '../interface'
import { MetaColumnContext } from '../context'

declare type CallbackType = (text: any, record: RowData, index: number) => void
export interface IOperateColumnProps {
  text: any
  record: RowData
  index: number
  operate: IButtonClusterProps<CallbackType>
}

export const operateFactory = (
  operate: IButtonClusterProps,
  fc: FC<IOperateColumnProps>
) => {
  return (text: any, record: RowData, index: number) => {
    return fc({ text, record, index, operate })
  }
}

export const OperateColumn: FC<IOperateColumnProps> = ({
  text,
  record,
  index,
  operate,
}) => {
  const items = useMemo(() => {
    return operate.items.map((item) => ({
      ...item,
      disabled: isFn(item.disabled)
        ? item.disabled.bind(this, text, record, index)
        : item.disabled,
      callback: item.callback
        ? item.callback.bind(this, text, record, index)
        : undefined,
    }))
  }, [operate.items, text, record, index])
  return (
    <div className="tbox-operate-column">
      <ButtonCluster items={items} max={operate.max} />
    </div>
  )
}
