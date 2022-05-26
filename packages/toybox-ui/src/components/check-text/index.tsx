import React, { FC, ReactNode, useMemo } from 'react'
import classNames from 'classnames'
import { CheckFill } from '@airclass/icons'
import './styles'

export interface ICheckTextProps {
  text: ReactNode
  checked?: boolean
}

export const CheckText: FC<React.PropsWithChildren<ICheckTextProps>> = ({
  text,
  checked,
  children,
}) => {
  const checkIcon = useMemo(() => (children ? children : <CheckFill />), [])
  return (
    <div className={classNames('tbox-check-text', { checked })}>
      <span className="tbox-check-text-icon">{checkIcon}</span>
      <span>{text}</span>
    </div>
  )
}
