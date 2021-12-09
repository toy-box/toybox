import { TableProps } from 'antd/lib/table'
import { ButtonProps } from 'antd/lib/button'
import { JSXElementConstructor, ReactNode } from 'react'
import { IButtonClusterProps } from '@toy-box/toybox-ui'
import { OperateColumn } from './components'

export type sorterFun = (prev: any, current: any) => number

export interface IColumnVisible {
  key: string
  fixed?: boolean | 'left' | 'right'
  align?: 'left' | 'right' | 'center'
  component?: string
  width?: number | string
  sorter?: boolean | sorterFun
  sortDirections?: TableProps<RowData>['sortDirections']
  visiable?: boolean
}

export type ColumnMetaType = IColumnVisible & Toybox.MetaSchema.Types.IFieldMeta

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

export declare type ColumnComponentType = JSXElementConstructor<any>

export interface IMetaTableProps<T = RowData, OperateType = any>
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
    | 'onChange'
    | 'style'
    | 'className'
  > {
  resizableTitle?: boolean
  /**
   * @description 字段源属性
   */
  columnMetas: ColumnMetaType[]
  /**
   * @description 自定义字段组件
   */
  columnComponents?: Record<string, ColumnComponentType>
  /**
   * @description 操作字段组件配置
   */
  operate?: OperateType
  /**
   * @description 操作字段表头
   */
  operateHeader?: ReactNode
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

  sorter?: boolean | string[]

  operateColumn?: React.FC<IBaseOperateColumnProps<any>>
}

export interface IColumnData {
  text?: any
  record: RowData
  index: number
}

export interface IColumnProps extends IColumnData {
  columnMeta: ColumnMetaType
}

export interface IBaseOperateColumnProps<Operate> extends IColumnData {
  operate: Operate
}
