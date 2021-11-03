import React, { CSSProperties, FC, ReactNode } from 'react'
import classNames from 'classnames'
import './styles'

export interface IPageLayoutProps {
  style?: CSSProperties
  className?: string
  empty?: ReactNode
  single?: boolean
}

export const PageLayout: FC<IPageLayoutProps> = ({
  style,
  className,
  empty,
  single = true,
  children,
}) => {
  const prefix = 'tbox-page-layout'

  return (
    <div className={classNames(prefix, className, { single })} style={style}>
      {children || empty}
    </div>
  )
}
