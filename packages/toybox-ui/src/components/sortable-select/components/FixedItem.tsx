import React, { FC, ReactNode, useCallback, useContext, useMemo } from 'react'
import classNames from 'classnames'
import { LockLine, CheckLine } from '@airclass/icons'
import { ISelectItem } from '../types'
import { SortableSelectContext } from '../context'

export type FixedItemProps = ISelectItem

export const FixedItem: FC<FixedItemProps> = ({ label, value, disabled }) => {
  const context = useContext(SortableSelectContext)
  const checked = useMemo(() => {
    if (Array.isArray(context.value)) {
      return context.value.some((v) => v === value)
    }
    return value === context.value
  }, [context.value])

  const handleCheck = useCallback(() => {
    if (!disabled) {
      context.checkValue && context.checkValue(value)
    }
  }, [context.checkValue])

  return (
    <ul>
      <li
        className={classNames('tbox-sortable-select--item fixed')}
        onClick={handleCheck}
      >
        <LockLine className="fixed-icon" />
        <div className="select-item__label">{label}</div>
        <CheckLine className={classNames('selec-item__check', { checked })} />
      </li>
    </ul>
  )
}
