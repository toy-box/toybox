import { FC } from 'react'
import { DateColumn } from './DateColumn'
import { ObjectColumn } from './ObjectColumn'
import { DefaultColumn } from './DefaultColumn'
import { BooleanColumn } from './BooleanColumn'
import { SingleOptionColumn } from './SingleOptionColumn'
import { RefObjectColumn } from './RefObjectColumn'
import { PrimaryColumn } from './PrimaryColumn'
import { IColumnProps } from '../interface'

export * from './OperateColumn'
export { default as ResizableTitle, ResizeCallbackData } from './ResizableTitle'

export const DefaultColumnRenderMap: Record<string, FC<IColumnProps>> = {
  businessObject: ObjectColumn,
  date: DateColumn,
  datetime: DateColumn,
  object: ObjectColumn,
  singleOption: SingleOptionColumn,
  boolean: BooleanColumn,
  string: DefaultColumn,
  integer: DefaultColumn,
  number: DefaultColumn,
  objectId: RefObjectColumn,
  primary: PrimaryColumn,
}
