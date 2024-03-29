import React, { useContext } from 'react'
import { DefaultRecordType } from 'rc-table/lib/interface'
import { ColumnType } from 'antd/lib/table/interface'
import Cell from './Cell'
import Header from './Header'
import { TableContext } from '../context/tableContext'

export interface ColumnRowProps<RecordType> {
  column: ColumnType<RecordType>
  render?: ColumnType<RecordType>['render']
  records: RecordType[]
}

function ColumnRow<RecordType extends DefaultRecordType>({
  column,
  records,
}: ColumnRowProps<RecordType>) {
  const tableContext = useContext(TableContext)
  return (
    <tr>
      {tableContext?.showHeader ? (
        <Header title={column.title} headerWidth={tableContext.headerWidth} />
      ) : null}
      {records.map((record, index) => (
        <Cell
          key={index}
          record={record}
          index={index}
          ellipsis={column.ellipsis}
          className={column.className}
          render={column.render}
          width={tableContext?.columnWidth}
          dataIndex={column.dataIndex || column.key}
          align={column.align || 'center'}
        />
      ))}
    </tr>
  )
}

export default ColumnRow
