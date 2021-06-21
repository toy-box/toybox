import React, { FC, ReactNode, useMemo } from 'react'
import { Dropdown, Menu } from 'antd'
import { MoreFill } from '@airclass/icons'
import { DropDownProps } from 'antd/lib/dropdown'
import { IButtonProps, Button } from '../button'

export type DropdownMenuProps = Omit<DropDownProps, 'overlay'> & {
  items: MeunBaseItem[]
} & Pick<IButtonProps, 'type'>

export declare type MeunBaseItem = IMenuItem | IMenuSub | IMenuDivider

export declare type MenuItemType = 'item' | 'subMenu' | 'divider'

export interface IMenuItem {
  type: 'item'
  text: ReactNode
  icon?: ReactNode
  color?: string
  danger?: boolean
  disabled?: boolean
  callback?: (...args: any) => void
}

export interface IMenuDivider {
  type: 'divider'
}

export interface IMenuSub {
  type: 'subMenu'
  text: ReactNode
  icon?: ReactNode
  color?: string
  danger?: boolean
  disabled?: boolean
  items: MeunBaseItem[]
}

export const DropdownMenu: FC<DropdownMenuProps> = ({
  items,
  type,
  children,
  ...props
}) => {
  const menu = useMemo(() => {
    return (
      <Menu>
        {items.map((item, index) => {
          switch (item.type) {
            case 'subMenu':
              return (
                <Menu.SubMenu title={item.text} key={index}>
                  {(item as IMenuSub).items.map((subItem, idx) =>
                    subItem.type === 'divider' ? (
                      <Menu.Divider key={idx} />
                    ) : (
                      <Menu.Item
                        key={idx}
                        onClick={(subItem as IMenuItem).callback}
                        icon={subItem.icon}
                        disabled={subItem.disabled}
                        danger={subItem.danger}
                      >
                        {subItem.text}
                      </Menu.Item>
                    )
                  )}
                </Menu.SubMenu>
              )
            case 'divider':
              return <Menu.Divider key={index} />
            case 'item':
            default:
              return (
                <Menu.Item
                  key={index}
                  onClick={(item as IMenuItem).callback}
                  icon={item.icon}
                  disabled={item.disabled}
                  danger={item.danger}
                >
                  {item.text}
                </Menu.Item>
              )
          }
        })}
      </Menu>
    )
  }, [items])

  return (
    <Dropdown overlay={menu} {...props}>
      {children || <Button type={type} icon={<MoreFill />} />}
    </Dropdown>
  )
}
