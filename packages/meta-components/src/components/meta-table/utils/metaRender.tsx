import React, { FC } from 'react'
import { ColumnMetaType, IColumnProps } from '../interface'

export declare type MetaColumnRender = (
  props: Omit<IColumnProps, 'columnMeta'>
) => JSX.Element
export declare type FlatMetaColumnRender = (text, record, index) => JSX.Element

export function metaRender(
  columnMeta: ColumnMetaType,
  renders: Record<string, FC<IColumnProps>>,
  defaultRender: FC<IColumnProps>
): MetaColumnRender
export function metaRender(
  columnMeta: ColumnMetaType,
  renders: Record<string, FC<IColumnProps>>,
  defaultRender: FC<IColumnProps>,
  boolean: true
): FlatMetaColumnRender
export function metaRender(
  columnMeta: ColumnMetaType,
  renders: Record<string, FC<IColumnProps>>,
  defaultRender: FC<IColumnProps>,
  flat?: boolean
): FlatMetaColumnRender | MetaColumnRender {
  const columnFactory = (
    columnMeta: ColumnMetaType,
    ColumnRender: FC<IColumnProps>
  ) => {
    return flat
      ? (text, record, index) => {
          return (
            <ColumnRender
              text={text}
              record={record}
              index={index}
              columnMeta={columnMeta}
            />
          )
        }
      : (props: Omit<IColumnProps, 'columnMeta'>) => {
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
