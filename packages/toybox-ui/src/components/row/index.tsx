import React, { FC, CSSProperties } from 'react'
import classNames from 'classnames'

import './styles'

export interface IFieldRowProps {
  className?: string
  style?: CSSProperties
  allowWrap?: boolean
}

const FieldRow: FC<IFieldRowProps> = ({
  className,
  allowWrap,
  style,
  children,
}) => {
  const prefixCls = 'tbox-field-row'
  return (
    <div
      className={classNames(prefixCls, className, { allowWrap })}
      style={style}
    >
      {children}
    </div>
  )
}

export default FieldRow
