import React, { FC, useMemo } from 'react'
import { Button, Dropdown, Menu } from 'antd'
import { MoreFill } from '@airclass/icons'
import { DisableCheckType, OperateItemType, RowData } from '../interface'

export interface IOperateColumnProps {
  text: any
  record: RowData
  index: number
  operateItems: OperateItemType[]
}

export const operateFactory = (
  operateItems: OperateItemType[],
  fc: FC<{
    text: any
    record: RowData
    index: number
    operateItems: OperateItemType[]
  }>
) => {
  return (text: any, record: RowData, index: number) => {
    return fc({ text, record, index, operateItems })
  }
}

export const OperateColumn: FC<IOperateColumnProps> = ({
  text,
  record,
  index,
  operateItems,
}) => {
  return (
    <div className="tbox-operate-column">
      {operateItems.map((item, idx) => {
        const doDisabled =
          typeof item.disabled === 'function'
            ? (item.disabled as DisableCheckType)(text, record, index)
            : item.disabled
        return (
          <Button
            key={idx}
            disabled={doDisabled}
            onClick={() => item.callback && item.callback(record, index)}
            {...item}
          >
            {item.text}
          </Button>
        )
      })}
    </div>
  )
}

export const OperateDropdown: FC<IOperateColumnProps> = ({
  text,
  record,
  index,
  operateItems,
}) => {
  const menu = useMemo(() => {
    return (
      <Menu>
        {operateItems.map((item, idx) => {
          const doDisabled =
            typeof item.disabled === 'function'
              ? (item.disabled as DisableCheckType)(text, record, index)
              : item.disabled
          return (
            <Menu.Item
              key={idx}
              onClick={() => item.callback && item.callback(record, index)}
              danger={item.danger}
              disabled={doDisabled}
            >
              {item.text}
            </Menu.Item>
          )
        })}
      </Menu>
    )
  }, [index, operateItems, record, text])

  return (
    <Dropdown overlay={menu} placement="bottomCenter" trigger={['click']}>
      <Button type="text" icon={<MoreFill />} />
    </Dropdown>
  )
}
