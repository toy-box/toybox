import React, { FC, CSSProperties } from 'react'
import classNames from 'classnames'

import './styles'

export interface IRowProps {
  className?: string
  style?: CSSProperties
  allowWrap?: boolean
}

export const Row: FC<IRowProps> = ({
  className,
  allowWrap,
  style,
  children,
}) => {
  const prefixCls = 'tbox-row'
  return (
    <div
      className={classNames(prefixCls, className, { allowWrap })}
      style={style}
    >
      {children}
    </div>
  )
}
