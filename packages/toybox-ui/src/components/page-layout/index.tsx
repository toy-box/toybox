import React, { CSSProperties, FC, ReactNode } from 'react'
import classNames from 'classnames'
import './styles'

export interface IPageLayoutProps {
  style?: CSSProperties
  className?: string
  empty?: ReactNode
}

export const PageLayout: FC<IPageLayoutProps> = ({
  style,
  className,
  empty,
  children,
}) => {
  const prefix = 'tbox-page-layout'

  return (
    <div className={classNames(prefix, className)} style={style}>
      {children || empty}
    </div>
  )
}
