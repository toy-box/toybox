import React, { CSSProperties, FC, ReactNode } from 'react'
import classNames from 'classnames'
import './styles'

export interface ToolBarProps {
  left?: ReactNode
  center?: ReactNode
  right?: ReactNode
  className?: string
  style?: CSSProperties
}

export const ToolBar: FC<ToolBarProps> = ({
  left,
  center,
  right,
  className,
  style,
}) => {
  return (
    <div className={classNames('tbox-toolbar', className)} style={style}>
      <div className="tbox-toolbar__left">{left}</div>
      <div className="tbox-toolbar__center">{center}</div>
      <div className="tbox-toolbar__right">{right}</div>
    </div>
  )
}
