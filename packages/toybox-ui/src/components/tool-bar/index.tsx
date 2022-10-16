import React, { CSSProperties, FC } from 'react'
import classNames from 'classnames'
import './styles'

export interface ToolBarProps {
  className?: string
  style?: CSSProperties
}

export const ToolBar: FC<React.PropsWithChildren<ToolBarProps>> = ({
  className,
  style,
  children,
}) => {
  return (
    <div className={classNames('tbox-toolbar', className)} style={style}>
      {children}
    </div>
  )
}
