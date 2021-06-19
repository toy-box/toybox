import React, { FC } from 'react'
import { ColumnMetaType, IColumnProps } from '../interface'

export function metaRender(
  columnMeta: ColumnMetaType,
  renders: Record<string, FC<IColumnProps>>,
  defaultRender: FC<IColumnProps>
) {
  const columnFactory = (
    columnMeta: ColumnMetaType,
    ColumnRender: FC<IColumnProps>
  ) => {
    return (props: Omit<IColumnProps, 'columnMeta'>) => {
      return (
        <ColumnRender
          text={props.text}
          record={props.record}
          index={props.index}
          columnMeta={columnMeta}
        />
      )
    }
  }
  if (columnMeta.component != null) {
    return columnFactory(columnMeta, renders[columnMeta.component])
  }
  if (columnMeta.type === 'object') {
    return columnFactory(
      columnMeta,
      renders[columnMeta.key] || renders['object']
    )
  }
  return columnFactory(columnMeta, renders[columnMeta.type] || defaultRender)
}
