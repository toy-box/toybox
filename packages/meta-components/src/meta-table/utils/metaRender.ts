import { FC } from 'react'
import { ColumnMetaType, IColumnProps } from '../interface'

export function metaRender(
  columnMeta: ColumnMetaType,
  renders: Record<string, FC<IColumnProps>>,
  defaultRender: FC<IColumnProps>
) {
  const columnFactory = (
    columnMeta: ColumnMetaType,
    render: FC<IColumnProps>
  ) => {
    return ({
      text,
      record,
      index,
    }: {
      text: any
      record: { [key: string]: any }
      index: number
    }) => {
      return render({ text, record, index, columnMeta })
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
