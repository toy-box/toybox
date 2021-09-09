import React, { useState } from 'react'
import classNames from 'classnames'
import { ArrowDownSFill } from '@airclass/icons'

import './styles'

export type ExpandPanelProps = {
  className?: string
  style?: React.CSSProperties
  title?: React.ReactNode
  defaultExpand?: boolean
  arrow?: React.ReactNode
}

export const ExpandPanel: React.FC<ExpandPanelProps> = ({
  className,
  style,
  title,
  defaultExpand,
  arrow = <ArrowDownSFill />,
  children,
}) => {
  const prefix = 'tbox-expand-panel'
  const [expand, setExpand] = useState(defaultExpand)

  return (
    <div className={classNames(prefix, className, { expand })} style={style}>
      <div className={`${prefix}-header`} onClick={() => setExpand(!expand)}>
        <div className={`${prefix}-header-expand`}>{arrow}</div>
        <div className={`${prefix}-header-title`}>{title}</div>
      </div>
      <div className={`${prefix}-content-wrapper`}>
        <div className={prefix + '-content'}>{children}</div>
      </div>
    </div>
  )
}
