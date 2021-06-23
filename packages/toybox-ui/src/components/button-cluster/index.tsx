import React, { FC, ReactNode, useMemo } from 'react'
import { Space } from 'antd'
import { ButtonType, ButtonSize } from 'antd/lib/button'
import { isFn } from '@toy-box/toybox-shared'
import { Button } from '../button'
import { DropdownMenu, IMenuItem } from '../dropdown-menu'

export interface IButtonClusterProps<CallbackType = DefaultCallbackType> {
  items: IButtonItem<CallbackType>[]
  max?: number
}

type isDisabledType = (...args: any) => boolean

type DefaultCallbackType = (...args: any) => void
export interface IButtonItem<CallbackType = DefaultCallbackType> {
  text: string
  icon?: ReactNode
  color?: string
  type?: ButtonType
  danger?: boolean
  size?: ButtonSize
  disabled?: boolean | isDisabledType
  tooltip?: boolean
  callback?: CallbackType
}

export const ButtonCluster: FC<IButtonClusterProps> = ({ items, max = 3 }) => {
  const overSize = useMemo(() => items.length > max, [])

  const visiableItems = useMemo(
    () => (overSize ? items.filter((item, idx) => idx < max - 1) : items),
    [overSize, items, max]
  )

  const dropDownItems = useMemo(
    () =>
      overSize
        ? items
            .filter((item, idx) => idx >= max - 1)
            .map(
              (item) =>
                ({
                  type: 'item',
                  ...item,
                } as IMenuItem)
            )
        : [],
    [overSize, items, max]
  )

  const dropDownRender = useMemo(
    () =>
      dropDownItems.length > 0 ? (
        <DropdownMenu items={dropDownItems} />
      ) : undefined,
    [dropDownItems]
  )

  return (
    <Space>
      {visiableItems.map((item, idx) => (
        <Button
          key={idx}
          type={item.type}
          onClick={item.callback}
          icon={item.icon}
          size={item.size}
          disabled={isFn(item.disabled) ? item.disabled() : item.disabled}
          danger={item.danger}
          tooltip={item.tooltip}
        >
          {item.text}
        </Button>
      ))}
      {dropDownRender}
    </Space>
  )
}
