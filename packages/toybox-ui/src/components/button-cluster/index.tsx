import React, { FC, ReactNode, useMemo } from 'react'
import { Space, Button as AntButton } from 'antd'
import { ButtonType, ButtonSize } from 'antd/lib/button'
import { Button } from '../button'
import { DropdownMenu, IMenuItem } from '../dropdown-menu'

export interface IButtonClusterProps<CallbackType = DefaultCallbackType> {
  items: IButtonItem<CallbackType>[]
  max?: number
  group?: boolean
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
  visible?: boolean | isDisabledType
}

export const ButtonCluster: FC<IButtonClusterProps> = ({
  items,
  max = 3,
  group,
}) => {
  const visibleItems = useMemo(() => {
    return items.filter((item) => {
      if (item.visible !== undefined) {
        return typeof item.visible === 'function'
          ? item.visible()
          : item.visible
      } else return true
    })
  }, [items])
  const overSize = useMemo(
    () => visibleItems.length > max,
    [max, visibleItems.length]
  )

  const visiableItems = useMemo(
    () =>
      overSize
        ? visibleItems.filter((item, idx) => idx < max - 1)
        : visibleItems,
    [overSize, visibleItems, max]
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

  const content = useMemo(
    () => (
      <>
        {visiableItems.map((item, idx) => (
          <Button
            key={idx}
            type={item.type}
            onClick={item.callback}
            icon={item.icon}
            size={item.size}
            disabled={
              typeof item.disabled === 'function'
                ? item.disabled()
                : item.disabled
            }
            danger={item.danger}
            tooltip={item.tooltip}
          >
            {item.text}
          </Button>
        ))}
        {dropDownRender}
      </>
    ),
    [visiableItems, dropDownRender]
  )

  return group ? (
    <AntButton.Group>{content}</AntButton.Group>
  ) : (
    <Space>{content}</Space>
  )
}
