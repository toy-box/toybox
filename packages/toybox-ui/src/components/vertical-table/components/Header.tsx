import React, { FC } from 'react'
import { ColumnTitle, ColumnTitleProps } from 'antd/es/table/interface'
import Cell from './Cell'
import { DefaultRecordType } from 'antd/node_modules/rc-table/lib/interface'

export interface HeaderProps<RecordType> {
  headerWidth?: number
  title?: ColumnTitle<RecordType>
  titleProps?: ColumnTitleProps<RecordType>
}

const Header: FC<HeaderProps<DefaultRecordType>> = ({
  headerWidth,
  title,
  titleProps,
}) => {
  const titleRender = React.useMemo(
    () => (typeof title === 'function' ? title(titleProps) : title),
    []
  )
  return (
    <Cell
      className="tbox-vertical-table-thead"
      width={headerWidth}
      fixLeft={0}
      firstFixLeft
    >
      {titleRender}
    </Cell>
  )
}

export default Header
