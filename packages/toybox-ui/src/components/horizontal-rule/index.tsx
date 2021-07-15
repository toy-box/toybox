import React from 'react'
import classNames from 'classnames'
import './styles'

type hrType = 'solid' | 'dashed' | 'dotted'

export interface HorizontalRuleProps {
  style?: React.CSSProperties
  className?: string
  type?: hrType
}

export const HorizontalRule = ({ className, style, type = 'solid' }) => {
  const mixStyle = {
    ...style,
    borderBottomStyle: type,
  }
  return (
    <hr
      style={mixStyle}
      className={classNames('tbox-horizontal-rule', className)}
    />
  )
}
