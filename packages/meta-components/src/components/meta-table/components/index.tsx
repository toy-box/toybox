import { FC } from 'react'
import { DateColumn } from './DateColumn'
import { ObjectColumn } from './ObjectColumn'
import { DefaultColumn } from './DefaultColumn'
import { BooleanColumn } from './BooleanColumn'
import { SingleOptionColumn } from './SingleOptionColumn'
import { RefObjectColumn } from './RefObjectColumn'
import { TimestampColumn } from './TimestampColumn'
import { IColumnProps } from '../interface'
import { MetaValueType } from 'packages/meta-schema/src/types'
export * from './PrimaryColumn'
export * from './OperateColumn'

export { default as ResizableTitle, ResizeCallbackData } from './ResizableTitle'

export const DefaultColumnRenderMap: Record<string, FC<IColumnProps>> = {
  businessObject: ObjectColumn,
  [MetaValueType.DATE]: DateColumn,
  [MetaValueType.DATETIME]: DateColumn,
  [MetaValueType.OBJECT]: ObjectColumn,
  [MetaValueType.SINGLE_OPTION]: SingleOptionColumn,
  [MetaValueType.BOOLEAN]: BooleanColumn,
  [MetaValueType.STRING]: DefaultColumn,
  [MetaValueType.INTEGER]: DefaultColumn,
  [MetaValueType.NUMBER]: DefaultColumn,
  [MetaValueType.OBJECT_ID]: RefObjectColumn,
  [MetaValueType.TIMESTAMP]: TimestampColumn,
}
