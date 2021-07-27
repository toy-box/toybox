import React, { FC, CSSProperties } from 'react'
import classNames from 'classnames'

import './styles'

export interface IFieldRowProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  style?: CSSProperties
  allowWrap?: boolean
}

export const FieldRow: FC<IFieldRowProps> = ({
  className,
  allowWrap,
  style,
  children,
  ...otherProps
}) => {
  const prefixCls = 'tbox-field-row'
  return (
    <div
      {...otherProps}
      className={classNames(prefixCls, className, { allowWrap })}
      style={style}
    >
      {children}
    </div>
  )
}
