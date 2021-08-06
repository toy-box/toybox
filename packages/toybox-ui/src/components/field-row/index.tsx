import React, { FC, CSSProperties, useMemo } from 'react'
import classNames from 'classnames'

import './styles'

export interface IFieldRowProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  style?: CSSProperties
  allowWrap?: boolean
  size?: number
}

export const FieldRow: FC<IFieldRowProps> = ({
  className,
  allowWrap,
  style,
  size = 8,
  children,
  ...otherProps
}) => {
  const prefixCls = 'tbox-field-row'
  const mixStyles = useMemo(
    () => ({
      ...style,
      gap: `${size}px`,
    }),
    []
  )
  return (
    <div
      {...otherProps}
      className={classNames(prefixCls, className, { allowWrap })}
      style={mixStyles}
    >
      {children}
    </div>
  )
}
