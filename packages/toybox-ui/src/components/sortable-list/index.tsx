import React, { FC } from 'react'
import classNames from 'classnames'
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
  DraggableProvidedDragHandleProps,
} from 'react-beautiful-dnd'
import { arrayMove } from '@toy-box/toybox-shared'

import './styles'

export interface ISortableList<T> {
  dataSource: Array<T>
  itemRender: ItemRender<T>
  onChange?: (dataSource: Array<T>) => void
  style?: React.CSSProperties
  itemClassName?: string
  className?: string
  idKey?: string
}

export type ItemRenderProps<T> = {
  item: T
  dragHandleProps: DraggableProvidedDragHandleProps
}

export type ItemRender<T> = React.FC<ItemRenderProps<T>>

export const SortableList: FC<ISortableList<any>> = ({
  dataSource,
  itemRender: ItemRender,
  onChange,
  style,
  itemClassName,
  className,
  idKey = 'id',
}) => {
  const handleSortEnd = (result: DropResult) => {
    if (!result.destination) {
      return
    }
    if (result.destination.index === result.source.index) {
      return
    }
    onChange([
      ...arrayMove(dataSource, result.source.index, result.destination.index),
    ])
  }

  return (
    <DragDropContext onDragEnd={handleSortEnd}>
      <Droppable droppableId="list">
        {(provided) => (
          <ul
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={classNames('tbox-select-list', className)}
            style={style}
          >
            {dataSource.map((item, index) => (
              <Draggable
                draggableId={item[idKey]}
                index={index}
                key={item[idKey]}
              >
                {(provided, snapshot) => (
                  <li
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={classNames(
                      'tbox-select-list__item',
                      itemClassName,
                      {
                        draging: snapshot.isDragging,
                      }
                    )}
                  >
                    <ItemRender
                      dragHandleProps={provided.dragHandleProps}
                      item={item}
                    />
                  </li>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  )
}
