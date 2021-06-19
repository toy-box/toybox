import React, { FC, ReactNode, useCallback, useContext, useMemo } from 'react'
import classNames from 'classnames'
import { MenuFill, CheckLine } from '@airclass/icons'
import { Draggable } from 'react-beautiful-dnd'
import { ISelectItem } from '../types'
import { SortableSelectContext } from '../context'

export type SelectOptionItemProps = ISelectItem & {
  index: number
}

export const SelectOptionItem: FC<SelectOptionItemProps> = ({
  label,
  value,
  disabled,
  index,
}) => {
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
    <Draggable draggableId={value.toString()} index={index}>
      {(provided, snapshot) => (
        <li
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={classNames('tbox-sortable-select--item', {
            disabled,
            draging: snapshot.isDragging,
          })}
          onClick={handleCheck}
        >
          <MenuFill {...provided.dragHandleProps} className="drag-handle" />
          <div className="select-item__label">{label}</div>
          <CheckLine className={classNames('selec-item__check', { checked })} />
        </li>
      )}
    </Draggable>
  )
}
