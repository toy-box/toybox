import React, { CSSProperties, FC } from 'react'
import classNames from 'classnames'

export declare type LayoutType = 'main' | 'oneSide' | 'twoSide'

export interface LayoutContainerProps {
  style?: CSSProperties
  className?: string
  type?: LayoutType
}

export const LayoutContainer: FC<LayoutContainerProps> = ({
  style,
  className,
  children,
}) => {
  return (
    <div
      className={classNames('tbox-pagy-layout-container', className)}
      style={style}
    >
      {children}
    </div>
  )
}
