import React, { FC } from 'react'
import { Space, Pagination, PaginationProps } from 'antd'
import './styles'

export const PaginationBar: FC<PaginationProps> = (props) => {
  return (
    <div className="tbox-pagination-bar">
      <Space>
        <span className="tbox-pagination-bar__info">{props.total} 条记录</span>
      </Space>
      <Pagination {...props} />
    </div>
  )
}
