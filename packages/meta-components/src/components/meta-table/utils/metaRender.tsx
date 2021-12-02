import React, { FC } from 'react'
import { ColumnMetaType, IColumnProps } from '../interface'
import { MetaColumnContext } from '../context'

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
            <MetaColumnContext.Provider value={{ text, record, index }}>
              <ColumnRender
                text={text}
                record={record}
                index={index}
                columnMeta={columnMeta}
              />
            </MetaColumnContext.Provider>
          )
        }
      : (props: Omit<IColumnProps, 'columnMeta'>) => {
          return (
            <MetaColumnContext.Provider value={props}>
              <ColumnRender {...props} columnMeta={columnMeta} />
            </MetaColumnContext.Provider>
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
