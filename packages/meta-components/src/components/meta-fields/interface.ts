import { FieldDate, FieldDateProps } from './Date'
import { FieldString, FieldStringProps } from './String'
import { FieldText } from './Text'
import { FieldNumber } from './Number'
import { FieldSelect, FieldSelectProps } from './Select'
import { FieldRate } from './Rate'
import { FieldCheckGroupProps } from './CheckGroup'
import { FieldPercent } from './Percent'
import { FieldBoolean, FieldBooleanProps } from './Boolean'
import { FieldBusinessObjectProps } from './BusinessObject'
import { FieldTreeSelectProps } from './TreeSelect'
import { ReactNode } from 'react'

type Component<P> =
  | React.ComponentType<P>
  | React.ForwardRefExoticComponent<P>
  | React.FC<P>
  | keyof React.ReactHTML

export type CustomizeComponent = Component<any>

export declare type FieldModeType = 'read' | 'edit' | 'update'

export interface BaseFieldProps {
  field: Toybox.MetaSchema.Types.IFieldMeta
  mode?: FieldModeType
  disabled?: boolean
  value?: any
  onClick?: (value: any) => void
  onChange?: (value: any, test?: any) => void
  onPressEnter?: (value: any, test?: any) => void
}

export interface SimpleTreeNode {
  id: string | number
  pId: string | number
  title: ReactNode
  value: string | number
  disabled?: boolean
}

export declare type FieldProps =
  | BaseFieldProps
  | FieldStringProps
  | FieldDateProps
  | FieldBusinessObjectProps
  | FieldBooleanProps
  | FieldCheckGroupProps
  | FieldSelectProps
  | FieldTreeSelectProps

export type FieldMap = Record<
  string,
  React.FC<FieldProps> | React.ForwardRefExoticComponent<FieldProps & any>
>

export const defaultFieldMap: FieldMap = {
  string: FieldString,
  text: FieldText,
  number: FieldNumber,
  date: FieldDate,
  datetime: FieldDate,
  singleOption: FieldSelect,
  boolean: FieldBoolean,
  rate: FieldRate,
  percent: FieldPercent,
  object: FieldSelect,
}
