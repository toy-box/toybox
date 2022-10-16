import React, { FC, useMemo, useState, useCallback } from 'react'
import { ArrowLeftSLine, ArrowRightSLine } from '@airclass/icons'
import { Menu, MenuProps } from 'antd'
import classNames from 'classnames'

import './styles'

export interface ISiderNavProps {
  className?: string
  width?: number
  style?: React.CSSProperties
  menu?: Omit<MenuProps, 'inlineCollapsed'>
  toggle?: ISiderNavToggle | false
}

export interface ISiderNavToggle {
  rightIcon?: React.ReactNode
  leftIcon?: React.ReactNode
  top?: number
}

const toggleDefault = {
  top: 60,
  rightIcon: <ArrowRightSLine />,
  leftIcon: <ArrowLeftSLine />,
}

export const SiderNav: FC<React.PropsWithChildren<ISiderNavProps>> = ({
  className,
  style,
  width,
  toggle: _toggle,
  menu,
}) => {
  const prefixCls = 'tbox-sider-nav'
  const [collapsed, setCollapsed] = useState(false)

  const toggle = useMemo(
    () => ({
      ...toggleDefault,
      ..._toggle,
    }),
    [_toggle]
  )

  const toggleCollapsed = useCallback(() => {
    setCollapsed(!collapsed)
  }, [collapsed])

  const mixedSytle = useMemo(() => {
    const realWidth = typeof width === 'number' ? `${width}px` : width
    return {
      ...style,
      width: collapsed ? '64px' : realWidth,
    }
  }, [width, style, collapsed])

  const menuRender = useMemo(() => {
    return menu && <Menu {...menu} inlineCollapsed={collapsed} />
  }, [menu, collapsed])

  const toggleRender = useMemo(() => {
    return (
      toggle && (
        <div
          className={prefixCls + '__toggle'}
          onClick={toggleCollapsed}
          style={{ top: `${toggle.top}px` }}
        >
          {collapsed ? toggle.rightIcon : toggle.leftIcon}
        </div>
      )
    )
  }, [toggle, collapsed, toggleCollapsed])

  return (
    <div
      className={classNames(prefixCls, collapsed, className)}
      style={mixedSytle}
    >
      {toggleRender}
      {menuRender}
    </div>
  )
}

SiderNav.defaultProps = {
  width: 200,
  toggle: toggleDefault,
}
