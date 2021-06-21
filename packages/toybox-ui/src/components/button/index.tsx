import React from 'react'
import { Button as AntButton, Tooltip } from 'antd'
import { ButtonProps as AntButtonProps } from 'antd/lib/button'
import { MoreFill } from '@airclass/icons'
import IconButton from './components/IconButton'

export interface IButtonProps extends AntButtonProps {
  tooltip?: boolean
}

export const Button = ({ children, icon, tooltip, ...props }: IButtonProps) => {
  if (tooltip) {
    return (
      <Tooltip title={children}>
        <AntButton icon={icon || <MoreFill />} {...props}></AntButton>
      </Tooltip>
    )
  }
  return (
    <AntButton icon={icon} {...props}>
      {children}
    </AntButton>
  )
}

Button.Icon = IconButton
