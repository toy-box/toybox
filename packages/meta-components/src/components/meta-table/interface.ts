import { TableProps, TablePaginationConfig } from 'antd/lib/table'
import { ButtonProps } from 'antd/lib/button'
import { ReactNode } from 'react'

export type sorterFun = (prev: any, current: any) => number

export interface IColumnVisible {
  key: string
  fixed?: boolean | 'left' | 'right'
  align?: 'left' | 'right' | 'center'
  component?: string
  width?: number
  sorter?: boolean | sorterFun
  sortDirections?: TableProps<RowData>['sortDirections']
  visiable?: boolean
}

export type ColumnMetaType = IColumnVisible & Toybox.MetaSchema.Types.IFieldMeta

export interface IColumnProps {
  text?: any
  record: RowData
  index: number
  columnMeta: ColumnMetaType
}

export type RowData = Record<string, any>

export type DisableCheckType = (
  text: any,
  record: RowData,
  index: number
) => boolean

export type OperateItemType = ButtonProps & {
  text?: string
  icon?: string
  color?: string
  callback?: (record: Record<string, any>, index: number) => void
  disabled?: DisableCheckType | boolean
}

export type PivotOptionType = {
  dimensions: string[]
}

export interface IMetaTableProps<T = RowData>
  extends Pick<
    TableProps<T>,
    | 'rowKey'
    | 'rowSelection'
    | 'expandable'
    | 'pagination'
    | 'loading'
    | 'dataSource'
    | 'bordered'
    | 'size'
    | 'showHeader'
    | 'summary'
    | 'title'
    | 'scroll'
  > {
  resizableTitle?: boolean
  /**
   * @description 字段源属性
   */
  columnMetas: ColumnMetaType[]
  /**
   * @description 自定义字段组件
   */
  columnComponents?: Record<string, (...args: any) => React.ReactNode>
  /**
   * @description 操作字段组件配置
   */
  operateItems?: OperateItemType[]
  /**
   * @description 操作字段表头
   */
  operateHeader?: ReactNode
  /**
   * @description 当表格查询条件变化时
   */
  onChange: (
    pagination: TablePaginationConfig,
    filters?: any,
    sorter?: any
  ) => void
  /**
   * @description 行自定义class
   */
  rowClassName?: (record: RowData, index: number) => string

  /**
   * @description 表格交叉显示配置
   */
  pivotOption?: PivotOptionType

  /**
   * @description 表格宽度
   */
  width?: number

  sort?: boolean
}
