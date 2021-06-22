import React, { CSSProperties, FC } from 'react'
import { Space, Pagination, PaginationProps } from 'antd'
import { ToolBar } from '../tool-bar'
import './styles'

export interface IPaginationBarProps extends PaginationProps {
  className?: string
  style?: CSSProperties
}

export const PaginationBar: FC<IPaginationBarProps> = ({
  className,
  style,
  ...otherProps
}) => {
  return (
    <ToolBar className={className} style={style}>
      <Space>
        <span className="tbox-pagination-bar__info">
          共 {otherProps.total} 条记录
        </span>
      </Space>
      <Pagination {...otherProps} />
    </ToolBar>
  )
}
