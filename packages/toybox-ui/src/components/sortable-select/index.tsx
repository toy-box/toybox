import React, { FC, ReactNode, useCallback, useMemo } from 'react'
import { Popover } from 'antd'
import {
  RenderFunction,
  getRenderPropValue,
} from 'antd/lib/_util/getRenderPropValue'
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd'
import { arrayMove } from '@toy-box/toybox-shared'
import { ISelectItem, ValueType } from './types'
import { SelectOptionItem, FixedItem } from './components'
import { SortableSelectContext } from './context'

import './styles'

type ActionType = 'hover' | 'click' | 'focus'

export interface ISortableSelectProps {
  title: ReactNode | RenderFunction
  trigger?: ActionType | ActionType[]
  dataSource: ISelectItem[]
  value: ValueType
  multiple?: boolean
  onChange: (value: ValueType) => void
  onSortEnd: (options: ISelectItem[]) => void
}

type SelectItemCheck = ISelectItem & {
  checked?: boolean
}

export const SortableSelect: FC<
  React.PropsWithChildren<ISortableSelectProps>
> = ({
  title,
  trigger = 'click',
  dataSource,
  value,
  multiple,
  onChange,
  onSortEnd,
  children,
}) => {
  const fixedItems = useMemo(
    () => dataSource.filter((item) => item.fixed),
    [dataSource]
  )
  const sortItems = useMemo(
    () => dataSource.filter((item) => !item.fixed),
    [dataSource]
  )

  const checkValue = useCallback(
    (val: string) => {
      if (multiple) {
        if (value == null) {
          return onChange([val])
        }
        if (Array.isArray(value)) {
          if (!value.some((v) => v === val)) {
            return onChange([...value, val])
          }
          return onChange(value.filter((v) => v !== val))
        }
        if (value === val) {
          return onChange([])
        }
        return onChange([value, val])
      }
      return onChange(val)
    },
    [multiple, value]
  )

  const handleSortEnd = (result: DropResult) => {
    if (!result.destination) {
      return
    }
    if (result.destination.index === result.source.index) {
      return
    }
    onSortEnd([
      ...fixedItems,
      ...arrayMove(sortItems, result.source.index, result.destination.index),
    ])
  }

  const content = () => {
    return (
      <SortableSelectContext.Provider value={{ value, checkValue }}>
        <div className="tbox-sortable-select">
          <ul className="select-menu fixed">
            {fixedItems.map((item, index) => (
              <FixedItem key={index} {...item} />
            ))}
          </ul>
          <DragDropContext onDragEnd={handleSortEnd}>
            <Droppable droppableId="list">
              {(provided) => (
                <ul
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="select-menu"
                >
                  {sortItems.map((item, index) => (
                    <SelectOptionItem
                      index={index}
                      key={`item-${item.value}`}
                      {...item}
                    />
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </SortableSelectContext.Provider>
    )
  }

  return (
    <Popover
      title={getRenderPropValue(title)}
      trigger={trigger}
      overlayClassName="popover-no-padding popover-no-arrow"
      content={content}
      placement="bottom"
    >
      {children}
    </Popover>
  )
}
